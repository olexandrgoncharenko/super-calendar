import styles from './MonthView.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useEffect, useState } from 'react';
import { useGoogleServices } from '../../../hooks/useGoogleServices';
import { CalendarEvent } from '../../../types/CalendarEvent';
import { DateTime } from 'luxon';
import { useGetDatesForCalendar } from '../../../hooks/useGetDatesForCalendar';
import { MonthWievDate } from '../../../types/MonthViewDate';

const MonthView: React.FC = () => {
	const activeCalendarViewMonthAndYear = useSelector(
		(state: RootState) => state.activeCalendarViewMonthAndYear
	);
	const [fullDayEvents, setFullDayEvents] = useState<CalendarEvent[]>([]);
	const [datesForDisplay, setDatesForDisplay] = useState<string[]>([]);

	const daysToDisplay = useGetDatesForCalendar(
		activeCalendarViewMonthAndYear.year,
		activeCalendarViewMonthAndYear.month
	);

	const formatDatesForDisplay = (dates: MonthWievDate[]): string[] => {
		const finishedDates = dates.map((day) =>
			DateTime.fromJSDate(day.date).toFormat('yyyy-MM-dd')
		);
		return finishedDates;
	};

	useEffect(() => {
		const dates = formatDatesForDisplay(daysToDisplay);
		setDatesForDisplay(dates);
	}, [daysToDisplay]);

	const { allEvents } = useGoogleServices();
	const selectedCalendarLists = useSelector(
		(state: RootState) => state.selectedCalendarLists
	);

	const getFilteredEvents = (calendars: any) => {
		if (selectedCalendarLists.length === 0) {
			return [];
		}

		const allFilteredEventsByCalendar = calendars.reduce(
			(acc: any, calendar: any) => {
				if (selectedCalendarLists.includes(calendar.id)) {
					acc.push(...calendar.events);
				}
				return acc;
			},
			[]
		);

		const startDate = new Date(datesForDisplay[0]);
		startDate.setHours(0, 0, 0, 0);

		const endDate = new Date(datesForDisplay[datesForDisplay.length - 1]);
		endDate.setHours(23, 59, 59, 999);

		const uniqueEventIds = new Set();

		const filteredEventsByDate = allFilteredEventsByCalendar.filter(
			(event: any) => {
				let eventStart = new Date(event.start);
				let eventEnd = new Date(event.end);

				const eventStartISO = eventStart.toISOString().split('T')[0];
				const eventEndISO = eventEnd.toISOString().split('T')[0];
				const startDateISO = startDate.toISOString().split('T')[0];
				const endDateISO = endDate.toISOString().split('T')[0];

				if (
					eventStartISO &&
					eventEndISO &&
					eventEndISO > startDateISO &&
					!uniqueEventIds.has(event.id)
				) {
					uniqueEventIds.add(event.id);
					return (
						eventStartISO <= endDateISO &&
						eventEndISO >= startDateISO
					);
				}
				return false;
			}
		);

		console.log('Filtered events:', filteredEventsByDate);

		setFullDayEvents(filteredEventsByDate);
	};

	useEffect(() => {
		if (datesForDisplay.length > 0 && allEvents.length > 0) {
			getFilteredEvents(allEvents);
		}
	}, [datesForDisplay, allEvents, selectedCalendarLists]);

	return (
		<div className={styles.days}>
			{datesForDisplay.map((day: string, index: number) => {
				const currentDayStr = day; //(YYYY-MM-DD)
				const eventsForDay = fullDayEvents.filter((event) => {
					const eventStartStr = DateTime.fromISO(
						event.start
					).toFormat('yyyy-MM-dd');
					return eventStartStr === currentDayStr;
				});

				return (
					<div key={index} className={styles.dayContainer}>
						<div className={styles.day}>{day}</div>
						{eventsForDay.length > 0 && (
							<ul className={styles.eventList}>
								{eventsForDay.map((event) => (
									<li
										key={event.id}
										className={styles.eventItem}
									>
										{event.summary}
									</li>
								))}
							</ul>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default MonthView;
