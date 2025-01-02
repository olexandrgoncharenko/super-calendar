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
	const { allEvents, isSignedIn } = useAuth();
	const [fullDayEvents, setFullDayEvents] = useState<CalendarEvent[]>([]);
	const [timeSlotEvents, setTimesSlotEvents] = useState<CalendarEvent[]>([]);

	const filteredEventsByCalendar = (calendars: any) => {
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

		const startDate = new Date(datesForDisplay[0]);
		startDate.setHours(0, 0, 0, 0);

		const endDate = new Date(
			datesForDisplay[datesForDisplay.length - 1] || startDate
		);
		endDate.setHours(23, 59, 59, 999);
		const uniqueEventIds = new Set();

		const filteredEventsByDate = allFilteredEventsByCalendar.filter(
			(event: any) => {
				let eventStart = new Date(event.start);
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

		const fullDayEvents: any[] = [];
		const timeSlotEvents: any[] = [];

		filteredEventsByDate.forEach((event: any) => {
			const eventStart = new Date(event.start);
			const eventEnd = new Date(event.end);
			const isMultiDayEvent = eventEnd.getDate() !== eventStart.getDate();
			if (isMultiDayEvent) {
				fullDayEvents.push(event);
			} else if (!isMultiDayEvent) {
				timeSlotEvents.push(event);
			}
		});

		setFullDayEvents(fullDayEvents);
		setTimesSlotEvents(timeSlotEvents);
	};

	useEffect(() => {
		if (isSignedIn) {
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
		const cellHeight = 40; // Высота ячейки времени в пикселях по умолчанию
		const defaultScrollHour = 7; // Прокрутка на 7:00, если нет событий

		if (!timeSlotEvents.length) return defaultScrollHour * cellHeight;

		const earliestEvent = timeSlotEvents.reduce((earliest, event) => {
			const eventStart = new Date(event.start);
			const earliestStart = new Date(earliest.start);
			return eventStart < earliestStart ? event : earliest;
		}, timeSlotEvents[0]);

		const eventStartHour = new Date(earliestEvent.start).getHours();
		return Math.min(eventStartHour, defaultScrollHour) * cellHeight;
	};

	const scrollToPosition = (
		position: number,
		tableRef: React.RefObject<HTMLDivElement>
	) => {
		if (tableRef.current) {
			setTimeout(() => {
				tableRef.current!.scrollTop = position;
			}, 0);
		}
	};

	useEffect(() => {
		const scrollPosition = calculateScrollPosition(timeSlotEvents);
		scrollToPosition(scrollPosition, tableRef);
	}, [timeSlotEvents, datesForDisplay]);

	return (
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
	);
};

export default DayOrWeekView;
