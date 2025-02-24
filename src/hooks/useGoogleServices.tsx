import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGoogleAuth } from '../context/useGoogleAuth';
import { CalendarEvent } from '../types/CalendarEvent';
import { FetchedEvent } from '../types/FetchedEvent';
import { formatEventToLocalTime } from '../utils/formatEventToLocalTime';
import { CalendarListWithEvents } from '../types/CalendarListWithEvents';

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
		if (!isSignedIn) return;

		try {
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
		} catch (err) {
			console.error('Error fetching calendar lists:', err);
		}
	};

	useEffect(() => {
		if (isGoogleApiLoaded && isSignedIn) {
			fetchCalendarLists();
		}
	}, [isSignedIn, isGoogleApiLoaded]);

	const fetchAllEventsForCalendar = async (calendarId: string) => {
		try {
			const token = getToken();
			const now = new Date();
			const oneYearAgo = new Date();
			oneYearAgo.setFullYear(now.getFullYear() - 1);

			const fetchEvents = async (timeMin: string, timeMax?: string) => {
				let events: CalendarEvent[] = [];
				let nextPageToken: string | null = null;

				do {
					const url = new URL(
						`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
							calendarId
						)}/events`
					);
					url.searchParams.append('timeMin', timeMin);
					if (timeMax) url.searchParams.append('timeMax', timeMax);
					url.searchParams.append('singleEvents', 'true');
					url.searchParams.append('orderBy', 'startTime');
					if (nextPageToken)
						url.searchParams.append('pageToken', nextPageToken);

					const response = await fetch(url.toString(), {
						headers: {
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
						},
					});

					if (!response.ok) {
						console.warn(
							`No events found for calendar ${calendarId}: ${response.statusText}`
						);
						break;
					}

					const data = await response.json();
					const newEvents = data.items
						? data.items.map((event: FetchedEvent) =>
								formatEventToLocalTime(event)
						  )
						: [];
					events = [...events, ...newEvents];
					nextPageToken = data.nextPageToken || null;
				} while (nextPageToken);

				return events;
			};

			const [upcomingEvents, completedEvents] = await Promise.all([
				fetchEvents(now.toISOString()), // Будущие события
				fetchEvents(oneYearAgo.toISOString(), now.toISOString()), // Завершенные события за год
			]);

			return {
				id: calendarId,
				title: `Calendar ${calendarId}`, // Добавляем title
				events: [...upcomingEvents, ...completedEvents],
			};
		} catch (err) {
			console.error(
				`Error fetching events for calendar ${calendarId}:`,
				err
			);
			return {
				id: calendarId,
				title: `Calendar ${calendarId}`,
				events: [],
			};
		}
	};

	const fetchEventsForAllCalendarLists = async () => {
		if (!isSignedIn || userCalendarLists.length === 0) return;

		try {
			const eventsData = await Promise.all(
				userCalendarLists.map((calendar) =>
					fetchAllEventsForCalendar(calendar.id)
				)
			);
			const formattedEvents = eventsData.filter(
				(calendar) => calendar.events.length > 0
			);
			setAllEvents(formattedEvents);
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
