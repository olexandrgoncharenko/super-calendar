import { CalendarEvent } from '../../types/CalendarEvent';
import React, { useEffect, useState } from 'react';
import styles from './FieldHeaderPresentation.module.css';

const staticCalendarColors: Record<string, string> = {
	'1': '#ac725e',
	'2': '#d06b64',
	'3': '#f83a22',
	'4': '#fa573c',
	'5': '#ff7537',
	'6': '#ffad46',
	'7': '#42d692',
	'8': '#16a765',
	'9': '#7bd148',
	'10': '#b3dc6c',
	'11': '#fbe983',
	'12': '#fad165',
	'13': '#92e1c0',
	'14': '#9fe1e7',
	'15': '#9fc6e7',
	'16': '#4986e7',
	'17': '#9a9cff',
	'18': '#b99aff',
	'19': '#c2c2c2',
	'20': '#cabdbf',
	'21': '#cca6ac',
	'22': '#f691b2',
	'23': '#cd74e6',
	'24': '#a47ae2',
};
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

		const defaultColor = '#79ede4'; // Дефолтный цвет фона события события

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
