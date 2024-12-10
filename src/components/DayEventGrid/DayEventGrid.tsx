// import React from 'react';
// import styles from './DayEventGrid.module.css';
// import { CalendarEvent } from '../../types/CalendarEvent';

// type DayEventGridProps = {
// 	dates: string[];
// 	timeSlotEvents: CalendarEvent[];
// };

// export const DayEventGrid: React.FC<DayEventGridProps> = ({
// 	dates,
// 	timeSlotEvents,
// }) => {
// 	console.log(`timeSlotEvents: ${JSON.stringify(timeSlotEvents)}`);

// 	return (
// 		<div className={styles.table}>
// 			{dates.map((date) => (
// 				<div className={styles.table__column} key={date}>
// 					{Array.from({ length: 24 }, (_, hour) => (
// 						<div
// 							className={styles.table__cell}
// 							key={`${date}-${hour}`}
// 						>
// 							{/* Можно отобразить номер часа */}
// 						</div>
// 					))}
// 				</div>
// 			))}
// 		</div>
// 	);
// };

// import React from 'react';
// import styles from './DayEventGrid.module.css';
// import { CalendarEvent } from '../../types/CalendarEvent';

// type DayEventGridProps = {
// 	dates: string[];
// 	timeSlotEvents: CalendarEvent[];
// };

// export const DayEventGrid: React.FC<DayEventGridProps> = ({
// 	dates,
// 	timeSlotEvents,
// }) => {
// 	// Функция для проверки, занимает ли событие текущий час
// 	const isEventInHour = (
// 		event: CalendarEvent,
// 		date: string,
// 		hour: number
// 	) => {
// 		const eventStart = new Date(event.start);
// 		const eventEnd = new Date(event.end);

// 		const startHour = eventStart.getHours();
// 		const endHour = eventEnd.getHours();

// 		// Событие в пределах этого часа и этой даты
// 		return (
// 			eventStart.toDateString() === new Date(date).toDateString() &&
// 			hour >= startHour &&
// 			hour < endHour
// 		);
// 	};

// 	// Вычисление высоты события в часах
// 	const calculateEventHeight = (event: CalendarEvent) => {
// 		const eventStart = new Date(event.start);
// 		const eventEnd = new Date(event.end);

// 		const durationInHours =
// 			(eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
// 		return durationInHours * 100; // Высота в %, 100% = 1 час
// 	};

// 	// Вычисление смещения события внутри ячейки часа
// 	const calculateEventOffset = (event: CalendarEvent) => {
// 		const eventStart = new Date(event.start);
// 		return (eventStart.getMinutes() / 60) * 100; // Смещение в %
// 	};

// 	return (
// 		<div className={styles.table}>
// 			{dates.map((date) => (
// 				<div className={styles.table__column} key={date}>
// 					{Array.from({ length: 24 }, (_, hour) => (
// 						<div
// 							className={styles.table__cell}
// 							key={`${date}-${hour}`}
// 						>
// 							{/* Проверяем события, которые относятся к текущему часу */}
// 							{timeSlotEvents
// 								.filter((event) =>
// 									isEventInHour(event, date, hour)
// 								)
// 								.map((event) => (
// 									<div
// 										key={event.id}
// 										className={styles.event}
// 										style={{
// 											height: `${calculateEventHeight(
// 												event
// 											)}%`,
// 											top: `${calculateEventOffset(
// 												event
// 											)}%`,
// 										}}
// 									>
// 										{event.summary}
// 									</div>
// 								))}
// 						</div>
// 					))}
// 				</div>
// 			))}
// 		</div>
// 	);
// };

// import React from 'react';
// import styles from './DayEventGrid.module.css';
// import { CalendarEvent } from '../../types/CalendarEvent';

// type DayEventGridProps = {
// 	dates: string[];
// 	timeSlotEvents: CalendarEvent[];
// };

// export const DayEventGrid: React.FC<DayEventGridProps> = ({
// 	dates,
// 	timeSlotEvents,
// }) => {
// 	// Проверяем, начинается ли событие в конкретной дате и часе
// 	const isEventInHour = (
// 		event: CalendarEvent,
// 		date: string,
// 		hour: number
// 	) => {
// 		const eventStart = new Date(event.start);
// 		const eventEnd = new Date(event.end);

// 		const currentHourStart = new Date(date);
// 		currentHourStart.setHours(hour, 0, 0, 0);

// 		const currentHourEnd = new Date(date);
// 		currentHourEnd.setHours(hour + 1, 0, 0, 0);

// 		return (
// 			eventStart < currentHourEnd &&
// 			eventEnd > currentHourStart &&
// 			eventStart.toDateString() === new Date(date).toDateString()
// 		);
// 	};

// 	// Вычисление высоты события в процентах относительно одного часа
// 	const calculateEventHeight = (
// 		event: CalendarEvent,
// 		date: string,
// 		hour: number
// 	) => {
// 		const eventStart = new Date(event.start);
// 		const eventEnd = new Date(event.end);

// 		const currentHourStart = new Date(date);
// 		currentHourStart.setHours(hour, 0, 0, 0);

// 		const currentHourEnd = new Date(date);
// 		currentHourEnd.setHours(hour + 1, 0, 0, 0);

// 		// Ограничиваем событие рамками текущего часа
// 		const visibleStart = Math.max(
// 			eventStart.getTime(),
// 			currentHourStart.getTime()
// 		);
// 		const visibleEnd = Math.min(
// 			eventEnd.getTime(),
// 			currentHourEnd.getTime()
// 		);

// 		const durationInMs = visibleEnd - visibleStart;
// 		return (durationInMs / (1000 * 60 * 60)) * 100; // Высота в %
// 	};

// 	// Вычисление смещения события внутри часа
// 	const calculateEventOffset = (
// 		event: CalendarEvent,
// 		date: string,
// 		hour: number
// 	) => {
// 		const eventStart = new Date(event.start);

// 		const currentHourStart = new Date(date);
// 		currentHourStart.setHours(hour, 0, 0, 0);

// 		// Если событие началось до текущего часа, смещение 0%
// 		if (eventStart < currentHourStart) {
// 			return 0;
// 		}

// 		// Смещение в %, если событие началось в пределах текущего часа
// 		return (
// 			((eventStart.getTime() - currentHourStart.getTime()) /
// 				(1000 * 60)) *
// 			100
// 		);
// 	};

// 	return (
// 		<div className={styles.table}>
// 			{dates.map((date) => (
// 				<div className={styles.table__column} key={date}>
// 					{Array.from({ length: 24 }, (_, hour) => (
// 						<div
// 							className={styles.table__cell}
// 							key={`${date}-${hour}`}
// 						>
// 							{/* Проверяем события, которые относятся к текущему часу */}
// 							{timeSlotEvents
// 								.filter((event) =>
// 									isEventInHour(event, date, hour)
// 								)
// 								.map((event) => (
// 									<div
// 										key={event.id}
// 										className={styles.event}
// 										style={{
// 											height: `${calculateEventHeight(
// 												event,
// 												date,
// 												hour
// 											)}%`,
// 											top: `${calculateEventOffset(
// 												event,
// 												date,
// 												hour
// 											)}%`,
// 										}}
// 									>
// 										{event.summary}
// 									</div>
// 								))}
// 						</div>
// 					))}
// 				</div>
// 			))}
// 		</div>
// 	);
// };
import React from 'react';
import styles from './DayEventGrid.module.css';
import { CalendarEvent } from '../../types/CalendarEvent';

type DayEventGridProps = {
	dates: string[];
	timeSlotEvents: CalendarEvent[];
};

export const DayEventGrid: React.FC<DayEventGridProps> = ({
	dates,
	timeSlotEvents,
}) => {
	console.log(`timeSlotEvents: ${JSON.stringify(timeSlotEvents)}`);
	// Вычисление стилей для события, чтобы позиционировать его относительно дня
	const calculateEventStyles = (event: CalendarEvent, date: string) => {
		const eventStart = new Date(event.start);
		const eventEnd = new Date(event.end);

		const dayStart = new Date(date);
		dayStart.setHours(0, 0, 0, 0);

		const dayEnd = new Date(date);
		dayEnd.setHours(23, 59, 59, 999);

		// Ограничиваем событие рамками текущего дня
		const visibleStart = Math.max(eventStart.getTime(), dayStart.getTime());
		const visibleEnd = Math.min(eventEnd.getTime(), dayEnd.getTime());

		const durationInMs = visibleEnd - visibleStart;
		const totalDayDurationInMs = dayEnd.getTime() - dayStart.getTime();

		// Расчет позиции и высоты в процентах относительно колонки
		const topPercentage =
			((visibleStart - dayStart.getTime()) / totalDayDurationInMs) * 100;
		const heightPercentage = (durationInMs / totalDayDurationInMs) * 100;

		return {
			top: `${topPercentage}%`,
			height: `${heightPercentage}%`,
		};
	};

	return (
		<div
			className={styles.table}
			style={{
				gridTemplateColumns: `repeat(${dates.length}, 1fr)`,
			}}
		>
			{dates.map((date) => (
				<div className={styles.table__column} key={date}>
					{/* Фоновые ячейки */}
					{Array.from({ length: 24 }, (_, hour) => (
						<div
							className={styles.table__cell}
							key={`${date}-${hour}`}
						>
							{/* Часы можно отображать здесь */}
						</div>
					))}

					{/* События для текущего дня */}
					{timeSlotEvents
						.filter((event) => {
							const eventStart = new Date(event.start);
							const eventEnd = new Date(event.end);
							const dayStart = new Date(date);
							dayStart.setHours(0, 0, 0, 0);
							const dayEnd = new Date(date);
							dayEnd.setHours(23, 59, 59, 999);
							return eventStart < dayEnd && eventEnd > dayStart;
						})
						.map((event) => {
							const eventStyles = calculateEventStyles(
								event,
								date
							); // Изменено имя
							return (
								<div
									key={event.id}
									className={styles.event}
									style={{
										position: 'absolute',
										top: eventStyles.top,
										height: eventStyles.height,
										left: '5%', // небольшой отступ
										width: '90%', // ширина события
									}}
								>
									{event.summary}
								</div>
							);
						})}
				</div>
			))}
		</div>
	);
};
