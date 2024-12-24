import { CalendarEvent } from '../../types/CalendarEvent';
import React, { useEffect, useState } from 'react';
import styles from './FieldHeaderPresentation.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
interface FieldHeaderProps {
	fullDayEvents: CalendarEvent[];
	dates: string[];
}

const FieldHeaderPresentation: React.FC<FieldHeaderProps> = ({
	fullDayEvents,
	dates,
}) => {
	const [eventsWithStyles, setEventsWithStyles] = useState<
		{
			event: CalendarEvent;
			width: number;
			left: number;
			row: number;
			backgroundColor: string;
		}[]
	>([]);

	const staticCalendarColors = useSelector(
		(state: RootState) => state.staticCalendarColors
	);

	const sortEventsByStartDate = (events: CalendarEvent[]) => {
		return events.sort((a, b) => {
			const startA = new Date(a.start ?? '1970-01-01T00:00:00');
			const startB = new Date(b.start ?? '1970-01-01T00:00:00');
			return startA.getTime() - startB.getTime();
		});
	};

	const calculateEventStyles = (
		event: CalendarEvent,
		startDateForDisplay: Date,
		endDateForDisplay: Date,
		occupiedRows: number[]
	) => {
		let eventStart;
		let eventEnd;

		if (event.start) {
			eventStart = new Date(event.start);
		} else {
			eventStart = new Date('1970-01-01');
		}

		if (event.end) {
			eventEnd = new Date(event.end);
		} else {
			eventEnd = new Date(eventStart.getTime() + 24 * 60 * 60 * 1000); // Дробавляем один день по умолчанию
		}

		// Ограничиваем начало и конец события диапазоном отображаемых дат
		const displayStart =
			eventStart < startDateForDisplay ? startDateForDisplay : eventStart;
		const displayEnd =
			eventEnd > endDateForDisplay ? endDateForDisplay : eventEnd;

		// Вычисляем ширину события как долю от общего диапазона
		const eventDurationInMs = displayEnd.getTime() - displayStart.getTime();
		const totalDurationInMs =
			endDateForDisplay.getTime() - startDateForDisplay.getTime() + 1;
		const eventWidthPercentage =
			(eventDurationInMs / totalDurationInMs) * 100;

		// Вычисляем смещение (позицию слева) в процентах
		const offsetMs = displayStart.getTime() - startDateForDisplay.getTime();
		const leftPercentage = (offsetMs / totalDurationInMs) * 100;

		// Находим ближайшую свободную строку для события
		let row = 0;
		while (occupiedRows[row]) {
			row++;
		}
		occupiedRows[row] = 1; // Занимаем строку

		const defaultColor = '#79ede4'; // Дефолтный цвет фона события

		const backgroundColor =
			event.colorId && staticCalendarColors[event.colorId]
				? staticCalendarColors[event.colorId]
				: defaultColor;
		return {
			width: eventWidthPercentage,
			left: leftPercentage,
			row,
			backgroundColor: backgroundColor,
		};
	};

	// Пересчет стилей для всех событий при изменении дат или событий
	useEffect(() => {
		const startDateForDisplay = new Date(dates[0]);
		startDateForDisplay.setHours(0, 0, 0, 0);

		const endDateForDisplay = new Date(dates[dates.length - 1]);
		endDateForDisplay.setHours(23, 59, 59, 999);

		const occupiedRows: number[] = []; // Массив для отслеживания занятых строк

		const sortedEvents = sortEventsByStartDate(fullDayEvents);
		const calculatedStyles = sortedEvents.map((event) => ({
			event,
			...calculateEventStyles(
				event,
				startDateForDisplay,
				endDateForDisplay,
				occupiedRows
			),
		}));

		setEventsWithStyles(calculatedStyles);
	}, [fullDayEvents, dates]);
	const rowHeight = eventsWithStyles.length * 20;

	return (
		<>
			<div className={styles.container}>
				<div className='timeColumn'></div>
				<div className={styles.wrapper}>
					<div className={styles.presentation}>
						<div
							className={styles['presentation__row']}
							style={{ height: `${rowHeight}px` }}
						>
							{dates.map((date) => {
								return (
									<div
										key={date}
										className={
											styles['presentation__row-cell']
										}
										style={{ height: `${rowHeight}px` }}
									></div>
								);
							})}
						</div>
						{eventsWithStyles.map(
							({ event, width, left, row, backgroundColor }) => {
								return (
									<div
										className={styles.event}
										key={event.id}
										style={{
											width: `${width}%`,
											left: `${left}%`,
											top: `${row * 20 + 1}px`, // отступ в 1px сверху и снизу
											position: 'absolute',
											backgroundColor: `${backgroundColor}`,
										}}
									>
										<span
											className={styles['event__descr']}
										>
											{event.summary}
										</span>
									</div>
								);
							}
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default FieldHeaderPresentation;
