import React, { useEffect, useState, useRef } from 'react';
import styles from './DayOrWeekView.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getDatesForWeek } from '../../../utils/getDatesForWeek';
import { useGoogleAuth } from '../../../context/useGoogleAuth';
import FieldHeader from '../../FieldHeader.tsx/FieldHeader';
import { CalendarEvent } from '../../../types/CalendarEvent';
import { DayEventGrid } from '../../DayEventGrid/DayEventGrid';

import { TimeSlots } from '../../TimeSlots/TimeSlots';
import { useGoogleServices } from '../../../hooks/useGoogleServices';

const DayOrWeekView: React.FC = () => {
	const view = useSelector((state: RootState) => state.view);
	const selectedCalendarLists = useSelector(
		(state: RootState) => state.selectedCalendarLists
	);
	const currentDate = useSelector((state: RootState) => state.currentDate);
	const [datesForDisplay, setDatesForDisplay] = useState<string[]>(() => {
		return view === 'week' ? getDatesForWeek(currentDate) : [currentDate];
	});
	const [fullDayEvents, setFullDayEvents] = useState<CalendarEvent[]>([]);
	const [timeSlotEvents, setTimesSlotEvents] = useState<CalendarEvent[]>([]);
	const tableRef = useRef<HTMLDivElement | null>(null);
	const { isSignedIn } = useGoogleAuth();
	const { allEvents } = useGoogleServices();

	const filteredEventsByCalendar = (calendars: any) => {
		if (selectedCalendarLists.length === 0) {
			setFullDayEvents([]);
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
