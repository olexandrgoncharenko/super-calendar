import React from 'react';
import styles from './DayEventGrid.module.css';
import { CalendarEvent } from '../../types/CalendarEvent';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type DayEventGridProps = {
	dates: string[];
	timeSlotEvents: CalendarEvent[];
};

export const DayEventGrid: React.FC<DayEventGridProps> = ({
	dates,
	timeSlotEvents,
}) => {
	const staticCalendarColors = useSelector(
		(state: RootState) => state.staticCalendarColors
	);
	// console.log(`timeSlotEvents: ${JSON.stringify(timeSlotEvents)}`);
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

		const defaultColor = '#79ede4';

		const backgroundColor =
			event.colorId && staticCalendarColors[event.colorId]
				? staticCalendarColors[event.colorId]
				: defaultColor;

		return {
			top: `${topPercentage}%`,
			height: `${heightPercentage}%`,
			backgroundColor: backgroundColor,
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
										backgroundColor:
											eventStyles.backgroundColor,
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
