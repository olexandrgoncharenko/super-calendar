import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGoogleAuth } from '../context/useGoogleAuth';
import { CalendarEvent } from '../types/CalendarEvent';
import { FetchedEvent } from '../types/FetchedEvent';
import { formatEventToLocalTime } from '../utils/formatEventToLocalTime';
import { CalendarListWithEvents } from './../types/CalendarListWithEvents';

export interface UnifiedListItem {
	id: string;
	title?: string;
	summary?: string;
}

export const useGoogleServices = () => {
	const [userCalendarLists, setUserCalendarLists] = useState<
		UnifiedListItem[]
	>([]);
	const [allEvents, setAllEvents] = useState<CalendarListWithEvents[]>([]);
	const { isSignedIn, isGoogleApiLoaded } = useGoogleAuth();
	const staticCalendarColors = useSelector(
		(state: RootState) => state.staticCalendarColors
	);

	const getToken = (): string => {
		const token = localStorage.getItem('google_token');
		if (!token) {
			throw new Error('Access token is not available.');
		}
		return token;
	};

	const fetchCalendarLists = async () => {
		try {
			if (isSignedIn) {
				const token = getToken();

				const response = await fetch(
					'https://www.googleapis.com/calendar/v3/users/me/calendarList',
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
						},
					}
				);

				if (!response.ok) {
					throw new Error(
						`Failed to fetch calendars: ${response.statusText}`
					);
				}

				const data = await response.json();
				if (data.items) {
					const calendarLists = data.items.map((item: any) => ({
						id: item.id,
						title: item.summary,
						color:
							staticCalendarColors[item.colorId] ||
							staticCalendarColors['default'],
					}));
					setUserCalendarLists(calendarLists);
				}
			} else {
				console.error('Google API not loaded or user not signed in.');
			}
		} catch (err) {
			console.error('Error fetching calendar lists:', err);
		}
	};

	useEffect(() => {
		if (isGoogleApiLoaded && isSignedIn) {
			fetchCalendarLists();
		}
	}, [isSignedIn, isGoogleApiLoaded]);

	const fetchEventsForAllCalendarLists = async () => {
		try {
			const calendarListWithEvents: CalendarListWithEvents[] = [];
			// Time constraints: last year for completed events
			const now = new Date();
			const oneYearAgo = new Date();
			oneYearAgo.setFullYear(now.getFullYear() - 1);

			const token = getToken();

			for (const calendarList of userCalendarLists) {
				const encodedCalendarId = encodeURIComponent(calendarList.id);
				// Fetch upcoming events (from now)
				const upcomingResponse = await fetch(
					`https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events?maxResults=999&timeMin=${now.toISOString()}&singleEvents=true&orderBy=startTime`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
						},
					}
				);

				let upcomingEvents: CalendarEvent[] = [];
				if (upcomingResponse.ok) {
					const upcomingData = await upcomingResponse.json();
					upcomingEvents = upcomingData.items
						? upcomingData.items.map((event: FetchedEvent) =>
								formatEventToLocalTime(event)
						  )
						: [];
				} else {
					console.warn(
						`No upcoming events found for calendar with ID: ${calendarList.id}`
					);
				}
				// Fetch completed events (from one year ago to now)
				const completedResponse = await fetch(
					`https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events?maxResults=999&timeMin=${oneYearAgo.toISOString()}&timeMax=${now.toISOString()}&singleEvents=true&orderBy=startTime`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
						},
					}
				);

				let completedEvents: CalendarEvent[] = [];
				if (completedResponse.ok) {
					const completedData = await completedResponse.json();
					completedEvents = completedData.items
						? completedData.items.map((event: FetchedEvent) =>
								formatEventToLocalTime(event)
						  )
						: [];
				} else {
					console.warn(
						`No completed events found for calendar with ID: ${calendarList.id}`
					);
				}
				// Combine events
				const allEventsForCalendar = [
					...upcomingEvents,
					...completedEvents,
				];
				if (allEventsForCalendar.length > 0) {
					calendarListWithEvents.push({
						id: calendarList.id,
						title: calendarList.title,
						events: allEventsForCalendar,
					});
				}
			}
			setAllEvents(calendarListWithEvents);
		} catch (err) {
			console.error('Error fetching events for all calendar lists:', err);
		}
	};

	useEffect(() => {
		if (isSignedIn && userCalendarLists.length > 0) {
			fetchEventsForAllCalendarLists();
		}
	}, [isSignedIn, userCalendarLists]);

	return { userCalendarLists, allEvents };
};
