import styles from './FieldHeader.module.css';
import { CalendarEvent } from './../../types/CalendarEvent';
import FieldHeaderPresentation from '../FieldHeaderPresentation/FieldHeaderPresentation';

type FieldHeaderProps = {
	dates: string[];
	fullDayEvents: CalendarEvent[];
};

const FieldHeader: React.FC<FieldHeaderProps> = ({ dates, fullDayEvents }) => {
	const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

	return (
		<div>
			<div className={styles.header}>
				<div className={styles.timeColumn}></div>
				<div className={styles.weekdays}>
					{dates.map((dateStr, index) => {
						const date = new Date(dateStr);
						const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7];
						const dayOfMonth = date.getDate();

						return (
							<div key={index} className={styles.dayContainer}>
								<div className={styles.dayOfWeek}>
									{dayOfWeek}
								</div>
								<div className={styles.dayOfMonth}>
									{dayOfMonth}
								</div>

								{/* Full-day events */}
								{/* <div className={styles.fullDayEvents}>
								{fullDayEvents
									.filter((event) => {
										const eventStart = new Date(
											event.start.date
										);
										let eventEnd = new Date(event.end.date);

										// Уменьшаем конец события на один день
										eventEnd.setDate(
											eventEnd.getDate() - 1
										);

										// Проверяем, попадает ли событие в диапазон текущей даты
										return (
											eventStart <= date &&
											eventEnd >= date
										);
									})
									.map((event) => {
										const eventStart = new Date(
											event.start.date
										);
										let eventEnd = new Date(event.end.date);

										// Уменьшаем конец события на один день
										eventEnd.setDate(
											eventEnd.getDate() - 1
										);

										// Расчет, сколько дней занимает событие
										const durationInDays =
											(eventEnd.getTime() -
												eventStart.getTime()) /
												(1000 * 3600 * 24) +
											1;

										// Определяем, с какого дня начать и сколько дней занимает событие
										const startOffset = Math.max(
											(eventStart.getTime() -
												date.getTime()) /
												(1000 * 3600 * 24),
											0
										);

										return (
											<div
												key={event.id}
												className={styles.fullDayEvent}
												style={{
													gridColumn: `span ${Math.min(
														durationInDays,
														dates.length - index
													)}`,
												}}
											>
												{event.summary}
											</div>
										);
									})}
							</div> */}
							</div>
						);
					})}
				</div>
			</div>
			<div style={{ width: '100%', display: 'flex' }}>
				<div className={styles.timeColumn}></div>
				<FieldHeaderPresentation
					fullDayEvents={fullDayEvents}
					dates={dates}
				/>
			</div>
		</div>
	);
};

export default FieldHeader;

// import styles from './FieldHeader.module.css';
// import { CalendarEvent } from '../Field/DayOrWeekView/DayOrWeekView';

// type FieldHeaderProps = {
// 	dates: string[];
// 	fullDayEvents: CalendarEvent[];
// };

// const FieldHeader: React.FC<FieldHeaderProps> = ({ dates, fullDayEvents }) => {
// 	const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// 	return (
// 		<div className={styles.header}>
// 			<div className={styles.timeColumn}></div>
// 			<div className={styles.weekdays}>
// 				{dates.map((dateStr, index) => {
// 					const date = new Date(dateStr);
// 					const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7];
// 					const dayOfMonth = date.getDate();

// 					return (
// 						<div key={index} className={styles.dayContainer}>
// 							<div className={styles.dayOfWeek}>{dayOfWeek}</div>
// 							<div className={styles.dayOfMonth}>
// 								{dayOfMonth}
// 							</div>

// 							{/* Full-day events */}
// 							<div className={styles.fullDayEvents}>
// 								{fullDayEvents
// 									.filter((event) => {
// 										const eventStart = new Date(
// 											event.start.date
// 										);
// 										const eventEnd = new Date(
// 											event.end.date
// 										);

// 										// Проверяем, начинается ли событие в пределах текущего дня
// 										return (
// 											eventStart <= date &&
// 											eventEnd >= date
// 										);
// 									})
// 									.map((event) => {
// 										const eventStart = new Date(
// 											event.start.date
// 										);
// 										const eventEnd = new Date(
// 											event.end.date
// 										);

// 										// Расчет, сколько дней занимает событие
// 										const durationInDays =
// 											(eventEnd.getTime() -
// 												eventStart.getTime()) /
// 												(1000 * 3600 * 24) +
// 											1;

// 										// Определяем, с какого дня начать и сколько дней занимает событие
// 										const startOffset = Math.max(
// 											(eventStart.getTime() -
// 												date.getTime()) /
// 												(1000 * 3600 * 24),
// 											0
// 										);

// 										return (
// 											<div
// 												key={event.id}
// 												className={styles.fullDayEvent}
// 												style={{
// 													gridColumn: `span ${Math.min(
// 														durationInDays,
// 														dates.length - index
// 													)}`,
// 												}}
// 											>
// 												{event.summary}
// 											</div>
// 										);
// 									})}
// 							</div>
// 						</div>
// 					);
// 				})}
// 			</div>
// 		</div>
// 	);
// };

// export default FieldHeader;

// import styles from './FieldHeader.module.css';
// import { CalendarEvent } from '../Field/DayOrWeekView/DayOrWeekView';

// type FieldHeaderProps = {
// 	dates: string[];
// 	fullDayEvents: CalendarEvent[];
// };

// const FieldHeader: React.FC<FieldHeaderProps> = ({ dates, fullDayEvents }) => {
// 	const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// 	return (
// 		<div className={styles.header}>
// 			<div className={styles.timeColumn}></div>
// 			<div className={styles.weekdays}>
// 				{dates.map((dateStr, index) => {
// 					const date = new Date(dateStr);
// 					const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7];
// 					const dayOfMonth = date.getDate();

// 					// Фильтрация событий для текущей даты
// 					const eventsForDate = fullDayEvents.filter((event) => {
// 						const eventDate = new Date(event.start.date);
// 						return eventDate.toDateString() === date.toDateString();
// 					});

// 					return (
// 						<div key={index} className={styles.dayContainer}>
// 							<div className={styles.dayOfWeek}>{dayOfWeek}</div>
// 							<div className={styles.dayOfMonth}>
// 								{dayOfMonth}
// 							</div>

// 							{/* Full-day events */}
// 							<div className={styles.fullDayEvents}>
// 								{eventsForDate.map((event) => (
// 									<div
// 										key={event.id}
// 										className={styles.fullDayEvent}
// 									>
// 										{event.summary}
// 									</div>
// 								))}
// 							</div>
// 						</div>
// 					);
// 				})}
// 			</div>
// 		</div>
// 	);
// };

// export default FieldHeader;

// import styles from './FieldHeader.module.css';
// import { CalendarEvent } from '../Field/DayOrWeekView/DayOrWeekView';

// type FieldHeaderProps = {
// 	dates: string[];
// 	fullDayEvents: CalendarEvent[];
// };

// const FieldHeader: React.FC<FieldHeaderProps> = ({ dates, fullDayEvents }) => {
// 	return (
// 		<div className={styles.header}>
// 			<div className={styles.timeColumn}></div>
// 			<div className={styles.weekdays}>
// 				{dates.map((dateStr, index) => {
// 					const date = new Date(dateStr);
// 					const daysOfWeek = [
// 						'Пн',
// 						'Вт',
// 						'Ср',
// 						'Чт',
// 						'Пт',
// 						'Сб',
// 						'Вс',
// 					];
// 					const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7]; // Корректировка для понедельца как первого дня недели
// 					const dayOfMonth = date.getDate();

// 					return (
// 						<div key={index} className={styles.dayContainer}>
// 							<div className={styles.dayOfWeek}>{dayOfWeek}</div>
// 							<div className={styles.dayOfMonth}>
// 								{dayOfMonth}
// 							</div>
// 							{dates.map((dateStr, dateIndex) => {
// 								const date = new Date(dateStr);

// 								return (
// 									<div
// 										key={dateIndex}
// 										className={styles.dayColumn}
// 									>
// 										{/* Full-day events */}
// 										<div className={styles.fullDayEvents}>
// 											{fullDayEvents
// 												.filter((event) => {
// 													const eventDate = new Date(
// 														event.start.date
// 													);
// 													return (
// 														eventDate.toDateString() ===
// 														date.toDateString()
// 													);
// 												})
// 												.map((event) => (
// 													<div
// 														key={event.id}
// 														className={
// 															styles.fullDayEvent
// 														}
// 													>
// 														{event.summary}
// 													</div>
// 												))}
// 										</div>
// 									</div>
// 								);
// 							})}
// 						</div>
// 					);
// 				})}
// 			</div>
// 		</div>
// 	);
// };

// export default FieldHeader;
