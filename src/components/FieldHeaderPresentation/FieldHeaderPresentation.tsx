// import { CalendarEvent } from './../../components/Field/DayOrWeekView/DayOrWeekView';
import { CalendarEvent } from '../../types/CalendarEvent';
import React, { useEffect, useState } from 'react';
import styles from './FieldHeaderPresentation.module.css';

import { gapi } from 'gapi-script';

interface FieldHeaderProps {
	fullDayEvents: CalendarEvent[];
	dates: string[];
}

const FieldHeaderPresentation: React.FC<FieldHeaderProps> = ({
	fullDayEvents,
	dates,
}) => {
	console.log(`fullDayEvents: ${JSON.stringify(fullDayEvents)}`);

	const [eventsWithStyles, setEventsWithStyles] = useState<
		{ event: CalendarEvent; width: number; left: number; row: number }[]
	>([]);
	const [showAllEvents, setShowAllEvents] = useState(false);

	const sortEventsByStartDate = (events: CalendarEvent[]) => {
		return events.sort((a, b) => {
			const startA = new Date(
				// a.start.dateTime ?? a.start.date ?? '1970-01-01T00:00:00'
				a.start ?? '1970-01-01T00:00:00'
			);
			const startB = new Date(
				// b.start.dateTime ?? b.start.date ?? '1970-01-01T00:00:00'
				b.start ?? '1970-01-01T00:00:00'
			);
			return startA.getTime() - startB.getTime();
		});
	};

	const calculateEventStyles = (
		event: CalendarEvent,
		startDateForDisplay: Date,
		endDateForDisplay: Date,
		occupiedRows: number[]
		// eventHeight: number // перенести в css
	) => {
		let eventStart;
		let eventEnd;
		// if (event.start.date) {
		if (event.start) {
			eventStart = new Date(event.start);
			// eventStart = new Date(event.start.date);
			// eventStart.setHours(0, 0, 0, 0);
			// } else if (event.start.dateTime) {
		}
		// else if (event.start.dateTime) {
		// 	// eventStart = new Date(event.start.dateTime);
		// eventStart = new Date(event.start);
		// }
		else {
			eventStart = new Date('1970-01-01');
		}

		if (event.end) {
			const eventEndTemp = new Date(event.end);

			const eventEndYear = eventEndTemp.getFullYear();
			const eventEndMonth = eventEndTemp.getMonth();
			const evendEndDate = eventEndTemp.getDate() - 1;

			// eventEnd = new Date(
			// 	eventEndYear,
			// 	eventEndMonth,
			// 	evendEndDate,
			// 	23,
			// 	59,
			// 	59
			// );
			eventEnd = new Date(event.end);

			// } else if (event.end?.dateTime) {
			// 	eventEnd = new Date(event.end.dateTime);
		} else {
			// Default fallback in case both `end.date` and `end.dateTime` are missing
			eventEnd = new Date(eventStart.getTime() + 24 * 60 * 60 * 1000); // Add 1 day by default
		}

		// if (event.end?.date) {
		// 	const eventEndTemp = new Date(event.end.date);

		// 	const eventEndYear = eventEndTemp.getFullYear();
		// 	const eventEndMonth = eventEndTemp.getMonth();
		// 	const evendEndDate = eventEndTemp.getDate() - 1;

		// 	eventEnd = new Date(
		// 		eventEndYear,
		// 		eventEndMonth,
		// 		evendEndDate,
		// 		23,
		// 		59,
		// 		59
		// 	);
		// } else if (event.end?.dateTime) {
		// 	eventEnd = new Date(event.end.dateTime);
		// } else {
		// 	// Default fallback in case both `end.date` and `end.dateTime` are missing
		// 	eventEnd = new Date(eventStart.getTime() + 24 * 60 * 60 * 1000); // Add 1 day by default
		// }

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

		return {
			width: eventWidthPercentage,
			left: leftPercentage,
			row,
			// height: eventHeight,
		};
	};

	// Пересчет стилей для всех событий при изменении дат или событий
	useEffect(() => {
		const startDateForDisplay = new Date(dates[0]);
		startDateForDisplay.setHours(0, 0, 0, 0);

		const endDateForDisplay = new Date(dates[dates.length - 1]);
		endDateForDisplay.setHours(23, 59, 59, 999);

		const occupiedRows: number[] = []; // Массив для отслеживания занятых строк
		// const eventHeight = 40; // Высота каждого события

		const sortedEvents = sortEventsByStartDate(fullDayEvents);
		const calculatedStyles = sortedEvents.map((event) => ({
			event,
			...calculateEventStyles(
				event,
				startDateForDisplay,
				endDateForDisplay,
				occupiedRows
				// eventHeight
			),
		}));

		setEventsWithStyles(calculatedStyles);
	}, [fullDayEvents, dates]);

	// Расчет высоты строки в зависимости от количества событий
	//const uniqueRowsCount = new Set(eventsWithStyles.map((e) => e.row)).size; // Количество уникальных рядов
	// const rowHeight = uniqueRowsCount * 22; // Общая высота для всех рядов

	const eventsToDisplay = showAllEvents
		? eventsWithStyles
		: eventsWithStyles.slice(0, 2); // Только первые два события

	// const rowHeight = eventsToDisplay.length * 22;
	// const rowHeight = eventsWithStyles.length * 22;
	const rowHeight = eventsWithStyles.length * 18;

	return (
		<>
			<div className={styles.container}>
				<div className='timeColumn'></div>
				<div className={styles.wrapper}>
					<div className={styles.presentation}>
						{/* Фон с датами (ячейки presentation__row-cell) */}

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
										style={{ height: `${rowHeight}px` }} // Установите высоту ячеек в зависимости от высоты событий
									></div>
								);
							})}
						</div>
						{/* События, отображаемые поверх ячеек */}
						{/* {eventsToDisplay.map(({ event, width, left, row }) => { */}
						{eventsWithStyles.map(({ event, width, left, row }) => {
							return (
								<div
									className={styles.event}
									key={event.id}
									style={{
										width: `${width}%`,
										left: `${left}%`,
										top: `${row * 18}px`, // Расположение по рядам
										position: 'absolute',
										// height: `40px`, // Высота события
									}}
								>
									<span className={styles['event__descr']}>
										{event.summary}
									</span>
								</div>
							);
						})}
					</div>
					{/* {eventsWithStyles.length > 2 && (
						<button
							className={styles.toggleButton}
							onClick={() => setShowAllEvents((prev) => !prev)}
						>
							{showAllEvents ? 'Показать меньше' : 'Показать все'}
						</button>
					)} */}
				</div>
			</div>
		</>
	);
};

export default FieldHeaderPresentation;
