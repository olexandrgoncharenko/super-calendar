import React, { useEffect, useState, useRef } from 'react';
import styles from './DayOrWeekView.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getDatesForWeek } from '../../../utils/getDatesForWeek';
import { useAuth } from '../../../context/useAuth';

import FieldHeader from '../../FieldHeader.tsx/FieldHeader';
import { CalendarEvent } from '../../../types/CalendarEvent';
import { DayEventGrid } from '../../DayEventGrid/DayEventGrid';

import { TimeSlots } from '../../TimeSlots/TimeSlots';

const timeSlots = [
	'00:00-01:00',
	'01:00-02:00',
	'02:00-03:00',
	'03:00-04:00',
	'04:00-05:00',
	'05:00-06:00',
	'06:00-07:00',
	'07:00-08:00',
	'08:00-09:00',
	'09:00-10:00',
	'10:00-11:00',
	'11:00-12:00',
	'12:00-13:00',
	'13:00-14:00',
	'14:00-15:00',
	'15:00-16:00',
	'16:00-17:00',
	'17:00-18:00',
	'18:00-19:00',
	'19:00-20:00',
	'20:00-21:00',
	'21:00-22:00',
	'22:00-23:00',
	'23:00-00:00',
];

const DayOrWeekView: React.FC = () => {
	const currentDate = useSelector((state: RootState) => state.currentDate);
	const view = useSelector((state: RootState) => state.view);
	const [datesForDisplay, setDatesForDisplay] = useState<string[]>(() => {
		return view === 'week' ? getDatesForWeek(currentDate) : [currentDate];
	});
	const selectedCalendarLists = useSelector(
		(state: RootState) => state.selectedCalendarLists
	);

	const tableRef = useRef<HTMLDivElement | null>(null);

	// console.log(`selectedCalendarLists: ${selectedCalendarLists}`);

	const { allTasks, allEvents, isSignedIn } = useAuth();

	// console.log(allEvents);
	const [fullDayEvents, setFullDayEvents] = useState<CalendarEvent[]>([]);

	// console.log(`fullDayEvents: ${JSON.stringify(fullDayEvents)}`);
	// console.log(datesForDisplay);

	const [timeSlotEvents, setTimesSlotEvents] = useState<CalendarEvent[]>([]);
	// console.log(timeSlotEvents);

	const filteredEventsByCalendar = (calendars: any) => {
		// console.log('Запуск функции...');

		if (selectedCalendarLists.length === 0) {
			console.log('No calendars selected');

			setFullDayEvents([]);
			return [];
		}

		const allFilteredEventsByCalendar = calendars.reduce(
			(acc: any, calendar: any) => {
				if (selectedCalendarLists.includes(calendar.id)) {
					acc.push(...calendar.events); // быстрее, чем concat
				}
				return acc;
			},
			[]
		);

		// console.log(
		// 	`allFilteredEventsByCalendar: ${JSON.stringify(
		// 		allFilteredEventsByCalendar
		// 	)}`
		// );

		const startDate = new Date(datesForDisplay[0]);

		startDate.setHours(0, 0, 0, 0); // добавил

		const endDate = new Date(
			datesForDisplay[datesForDisplay.length - 1] || startDate
		);
		endDate.setHours(23, 59, 59, 999);
		// console.log(`Start date: ${startDate}, End date: ${endDate}`);
		const uniqueEventIds = new Set();

		const filteredEventsByDate = allFilteredEventsByCalendar.filter(
			(event: any) => {
				// let eventStart = getEventStartDate(event);
				let eventStart = new Date(event.start);
				// let eventEnd = getEventEndDate(event);

				// console.log(`event start: ${typeof eventStart}`);
				let eventEnd = new Date(event.end);

				if (
					eventStart &&
					eventEnd &&
					eventEnd > startDate &&
					!uniqueEventIds.has(event.id)
				) {
					uniqueEventIds.add(event.id);
					return eventStart <= endDate && eventEnd >= startDate;
				}
				return false;
			}
		);

		// console.log(
		// 	`filteredEventsByDate: ${JSON.stringify(filteredEventsByDate)}`
		// );

		const fullDayEvents: any[] = [];
		const timeSlotEvents: any[] = [];

		filteredEventsByDate.forEach((event: any) => {
			const eventStart = new Date(
				// event.start.dateTime || event.start.date
				event.start
			);
			const eventEnd = new Date(event.end);

			const isMultiDayEvent = eventEnd.getDate() !== eventStart.getDate();

			// Full-day or multi-day events
			if (
				// event.start.date ||
				isMultiDayEvent
			) {
				fullDayEvents.push(event);
			} else if (
				// event.start.dateTime &&
				!isMultiDayEvent
			) {
				//изменил
				timeSlotEvents.push(event);
			}
		});

		setFullDayEvents(fullDayEvents);
		setTimesSlotEvents(timeSlotEvents);
	};

	const getEventStartDate = (event: any): Date | null => {
		if (event.start.dateTime) {
			return event.start.dateTime;
		} else if (event.start.date) {
			const date = new Date(event.start.date);
			date.setUTCHours(0, 0, 0, 0); // Начало дня в UTC
			return date;
		}
		return null;
	};

	const getEventEndDate = (event: any): Date | null => {
		if (event.end.dateTime) {
			return event.end.dateTime;
		} else if (event.end.date) {
			const date = new Date(event.end.date);
			date.setUTCHours(23, 59, 59, 999); // Конец дня в UTC
			return date;
		}
		return null;
	};

	useEffect(() => {
		if (
			isSignedIn
			// &&
			// selectedCalendarLists.length > 0
			//  && allEvents.length > 0
		) {
			filteredEventsByCalendar(allEvents);
		} else {
			console.log('Waiting for  sign-in...');
		}
	}, [allEvents, selectedCalendarLists, isSignedIn, datesForDisplay, view]);

	useEffect(() => {
		const updatedDates =
			view === 'week' ? getDatesForWeek(currentDate) : [currentDate];
		setDatesForDisplay(updatedDates);
	}, [view, currentDate]);

	const calculateScrollPosition = (
		timeSlotEvents: CalendarEvent[]
	): number => {
		if (!timeSlotEvents || timeSlotEvents.length === 0) return 7 * 68; // Если нет событий, прокрутка на 7:00

		const cellHeight = 48; // Высота ячейки времени в пикселях

		// Находим самое раннее событие
		const earliestEvent = timeSlotEvents.reduce((earliest, event) => {
			const eventStart = new Date(event.start);
			const earliestStart = new Date(earliest.start);

			if (isNaN(eventStart.getTime())) {
				console.warn(`Invalid event time: ${event.start}`);
				return earliest;
			}

			// Логируем сравнение времени начала события с самым ранним событием
			// console.log(
			// 	`Comparing event start: ${eventStart} with earliest start: ${earliestStart}`
			// );

			return eventStart.getTime() < earliestStart.getTime()
				? event
				: earliest;
		}, timeSlotEvents[0]);

		// Логируем время начала самого раннего события
		// console.log('Earliest event start time:', earliestEvent.start);

		const eventStartHour = new Date(earliestEvent.start).getHours();

		// Если событие начинается позже 7:00, прокрутка на 7:00, если раньше — на сам час события
		return eventStartHour >= 7
			? 7 * cellHeight
			: eventStartHour * cellHeight;
	};
	// useEffect(() => {
	// 	if (!timeSlotEvents || timeSlotEvents.length === 0) {
	// 		console.log('No events to display, scrolling to top');
	// 		if (tableRef.current) {
	// 			tableRef.current.scrollTop = 7 * 68; // Сбрасываем прокрутку на верх
	// 		}
	// 		return;
	// 	}

	// 	if (tableRef.current) {
	// 		const cellHeight = 68; // Height of one time slot cell in pixels
	// 		let scrollPosition = 7 * cellHeight; // Default scroll position at 7:00 AM

	// 		console.log('Initial scroll position (7:00 AM):', scrollPosition);

	// 		const earliestEvent = timeSlotEvents.reduce((earliest, event) => {
	// 			const eventStart = new Date(event.start);
	// 			const earliestStart = new Date(earliest.start);

	// 			if (isNaN(eventStart.getTime())) {
	// 				console.warn(`Invalid event time: ${event.start}`);
	// 				return earliest;
	// 			}

	// 			// Log comparison of event start times
	// 			console.log(
	// 				`Comparing event start: ${eventStart} with earliest start: ${earliestStart}`
	// 			);

	// 			return eventStart.getHours() < earliestStart.getHours()
	// 				? event
	// 				: earliest;
	// 		}, timeSlotEvents[0]);

	// 		// Log the earliest event's start time
	// 		console.log('Earliest event start time:', earliestEvent.start);

	// 		const eventStartHour = new Date(earliestEvent.start).getHours();

	// 		if (eventStartHour >= 7) {
	// 			scrollPosition = 7 * cellHeight;
	// 		} else {
	// 			scrollPosition = eventStartHour * cellHeight;
	// 		}

	// 		// Log the final scroll position after determining the earliest event
	// 		console.log('Calculated scroll position:', scrollPosition);

	// 		// Set the scroll position with a slight delay
	// 		setTimeout(() => {
	// 			if (tableRef.current) {
	// 				console.log('Setting scroll position to:', scrollPosition);
	// 				tableRef.current!.scrollTop = scrollPosition;
	// 			}
	// 		}, 0);
	// 	}
	// }, [timeSlotEvents, datesForDisplay]);

	useEffect(() => {
		if (!timeSlotEvents || timeSlotEvents.length === 0) {
			// console.log('No events to display, scrolling to top');
			if (tableRef.current) {
				tableRef.current.scrollTop = 7 * 48; // Сбрасываем прокрутку на 7:00
			}
			return;
		}

		if (tableRef.current) {
			const scrollPosition = calculateScrollPosition(timeSlotEvents);

			// Логируем итоговую позицию прокрутки
			// console.log('Calculated scroll position:', scrollPosition);

			// Устанавливаем прокрутку с небольшой задержкой
			setTimeout(() => {
				if (tableRef.current) {
					// console.log('Setting scroll position to:', scrollPosition);
					tableRef.current!.scrollTop = scrollPosition;
				}
			}, 0);
		}
	}, [timeSlotEvents, datesForDisplay]);

	return (
		// <div>
		<div className={styles.week}>
			<FieldHeader
				dates={datesForDisplay}
				fullDayEvents={fullDayEvents}
			/>
			<div
				className={`${styles.container} ${styles['custom-scrollbar']}`}
				ref={tableRef}
			>
				<TimeSlots />
				<DayEventGrid
					dates={datesForDisplay}
					timeSlotEvents={timeSlotEvents}
				/>
			</div>
		</div>
		// </div>
	);
};

export default DayOrWeekView;
