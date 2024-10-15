import React, { useEffect, useState } from 'react';
import styles from './DayOrWeekView.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getDatesForWeek } from '../../../utils/getDatesForWeek';
import { useAuth } from '../../../context/useAuth';

import FieldHeader from '../../FieldHeader.tsx/FieldHeader';
// import { useCalendarEvents } from '../../../hooks/useCalendarEvents';

// import { TaskList } from '../../../hooks/useGoogleAuth';
// import { json } from 'stream/consumers';

// interface TaskList {
// 	id: string;
// 	title: string;
// }

// import {
// 	RootState,
// 	// AppDispatch,
// 	// toggleTaskList,
// 	// toggleCalendarList,
// 	// initializeSelectedTaskLists,
// 	// initializeSelectedCalendarLists,
// } from './../../../store';

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

export interface CalendarEvent {
	id: string;
	start: {
		dateTime?: string; // для подій з конкретним часом
		date?: string; // для подій на весь день
	};
	end: {
		dateTime?: string;
		date?: string;
	};
	summary: string; // назва події або інший контент
	// можна додати інші поля, які ви використовуєте
}

const DayOrWeekView: React.FC = () => {
	const currentDate = useSelector((state: RootState) => state.currentDate);
	const view = useSelector((state: RootState) => state.view);
	const [datesForDisplay, setDatesForDisplay] = useState<string[]>(() => {
		return view === 'week' ? getDatesForWeek(currentDate) : [currentDate];
	});
	const selectedCalendarLists = useSelector(
		(state: RootState) => state.selectedCalendarLists
	);

	console.log(`selectedCalendarLists: ${selectedCalendarLists}`);

	const { allTasks, allEvents, isSignedIn } = useAuth();

	const [fullDayEvents, setFullDayEvents] = useState<CalendarEvent[]>([]);
	const [timeSlotEvents, setTimesSlotEvents] = useState<CalendarEvent[]>([]);

	// console.log(`fullDayEvents: ${JSON.stringify(fullDayEvents)}`);
	// console.log(`timeSlotEvents: ${JSON.stringify(timeSlotEvents)}`);

	// console.log(`allTasks: ${JSON.stringify(allTasks)}`);

	// const [allDayEvents, setAllDayEvents] = useState([]);
	// const [eventsWithTime, setEventsWithTime] = useState([]);

	// console.log(allEvents);
	// console.log(datesForDisplay);

	const filteredEventsByCalendar = (calendars: any) => {
		if (selectedCalendarLists.length === 0) {
			console.log('No calendars selected');
			return [];
		}

		let allFilteredEvents: any[] = [];

		calendars.forEach((calendar: any) => {
			if (selectedCalendarLists.includes(calendar.id)) {
				console.log(`Matching calendar found: ${calendar.id}`);
				allFilteredEvents = allFilteredEvents.concat(calendar.events);
			}
		});

		const startDate = new Date(datesForDisplay[0]);
		const endDate =
			datesForDisplay.length > 1
				? new Date(datesForDisplay[datesForDisplay.length - 1])
				: new Date(startDate);

		// Set end date to 23:59:59 to cover full-day events properly
		if (datesForDisplay.length === 1) {
			endDate.setHours(23, 59, 59, 999);
		}

		console.log(`Start date: ${startDate}, End date: ${endDate}`);

		const uniqueEvents: { [key: string]: any } = {};

		const filteredEvents = allFilteredEvents.filter((event: any) => {
			const eventStart = new Date(
				event.start.dateTime || event.start.date
			);
			const eventEnd = new Date(event.end.dateTime || event.end.date);

			// Ensure the event is unique by ID
			if (!uniqueEvents[event.id]) {
				uniqueEvents[event.id] = true;

				// Include events that start before the range but continue into it, or start within the range
				return eventStart <= endDate && eventEnd >= startDate;
			}
			return false;
		});

		// console.log('Filtered Events:', filteredEvents);

		const fullDayEvents: any[] = [];
		const timeSlotEvents: any[] = [];

		filteredEvents.forEach((event: any) => {
			const eventStart = new Date(
				event.start.dateTime || event.start.date
			);
			const eventEnd = new Date(event.end.dateTime || event.end.date);

			const isMultiDayEvent = eventEnd.getDate() !== eventStart.getDate();

			// Full-day or multi-day events
			if (event.start.date || isMultiDayEvent) {
				fullDayEvents.push(event);
			} else if (event.start.dateTime) {
				timeSlotEvents.push(event);
			}
		});

		setFullDayEvents(fullDayEvents);
		setTimesSlotEvents(timeSlotEvents);
	};

	// const filteredEventsByCalendar = (calendars: any) => {
	// 	if (selectedCalendarLists.length === 0) {
	// 		console.log('No calendars selected');
	// 		return [];
	// 	}

	// 	// Масив для збереження всіх відфільтрованих подій
	// 	let allFilteredEvents: any[] = [];

	// 	calendars.forEach((calendar: any) => {
	// 		// Перевірка, чи календар вибрано
	// 		if (selectedCalendarLists.includes(calendar.id)) {
	// 			console.log(`Matching calendar found: ${calendar.id}`);

	// 			// Додаємо всі події з вибраного календаря до загального масиву
	// 			allFilteredEvents = allFilteredEvents.concat(calendar.events);
	// 		}
	// 	});

	// 	const startDate = new Date(datesForDisplay[0]);
	// 	const startYear = startDate.getFullYear();
	// 	const startMonth = startDate.getMonth();
	// 	const startDay = startDate.getDate();

	// 	const endDate = new Date(datesForDisplay[datesForDisplay.length - 1]);

	// 	const endYear = endDate.getFullYear();
	// 	const endMonth = endDate.getMonth();
	// 	const endDay = endDate.getDate();

	// 	console.log(`endDate: ${endDate}`);
	// 	// console.log(`startYear: ${startYear}`);
	// 	// console.log(`startMonth: ${startMonth}`);
	// 	// console.log(`startDate: ${startDay}`);

	// 	console.log('Filtered Events:', allFilteredEvents);

	// 	const finalEvents = allFilteredEvents.forEach((event: any) => {
	// 		// const eventDate = event.start.dateTime || event.start.date; // Виправлено на правильне звернення
	// 		const eventDate = new Date(
	// 			event.start.dateTime || event.start.date
	// 		); // Виправлено на правильне звернення
	// 		const eventYear = eventDate.getFullYear();
	// 		const eventMonth = eventDate.getMonth();
	// 		const eventDay = eventDate.getDate();

	// 		// console.log(eventDay);

	// 		if (
	// 			eventYear >= startDate.getFullYear() &&
	// 			eventYear <= endDate.getFullYear()
	// 		) {
	// 			console.log(event);
	// 		}

	// 		// console.log(`event date: ${eventDate}`);
	// 		// console.log(eventDate);

	// 		// return eventDate; // Повертає значення, але не має сенсу, оскільки forEach не збирає результати
	// 	});
	// 	// return allFilteredEvents;
	// };
	// Filter events when dependencies (events, calendars) change

	// const filteredEventsByCalendar = (calendars: any) => {
	// 	if (selectedCalendarLists.length === 0) {
	// 		console.log('No calendars selected');
	// 		return [];
	// 	}

	// 	// Масив для збереження всіх відфільтрованих подій
	// 	let allFilteredEvents: any[] = [];

	// 	calendars.forEach((calendar: any) => {
	// 		// Перевірка, чи календар вибрано
	// 		if (selectedCalendarLists.includes(calendar.id)) {
	// 			console.log(`Matching calendar found: ${calendar.id}`);

	// 			// Додаємо всі події з вибраного календаря до загального масиву
	// 			allFilteredEvents = allFilteredEvents.concat(calendar.events);
	// 		}
	// 	});

	// 	const startDate = new Date(datesForDisplay[0]);
	// 	const endDate = new Date(datesForDisplay[datesForDisplay.length - 1]);

	// 	console.log(`Start date: ${startDate}, End date: ${endDate}`);

	// 	// Filtering events within the date range
	// 	const filteredEvents = allFilteredEvents.filter((event: any) => {
	// 		const eventDate = new Date(
	// 			event.start.dateTime || event.start.date
	// 		); // Ensure correct date handling
	// 		return eventDate >= startDate && eventDate <= endDate; // Only events within the selected date range
	// 	});

	// 	console.log('Filtered Events:', filteredEvents);
	// 	return filteredEvents; // Return the filtered events
	// };

	// const filteredEventsByCalendar = (calendars: any) => {
	// 	if (selectedCalendarLists.length === 0) {
	// 		console.log('No calendars selected');
	// 		return [];
	// 	}

	// 	// Масив для збереження всіх відфільтрованих подій
	// 	let allFilteredEvents: any[] = [];

	// 	calendars.forEach((calendar: any) => {
	// 		// Перевірка, чи календар вибрано
	// 		if (selectedCalendarLists.includes(calendar.id)) {
	// 			console.log(`Matching calendar found: ${calendar.id}`);

	// 			// Додаємо всі події з вибраного календаря до загального масиву
	// 			allFilteredEvents = allFilteredEvents.concat(calendar.events);
	// 		}
	// 	});

	// 	const startDate = new Date(datesForDisplay[0]);
	// 	const endDate =
	// 		datesForDisplay.length > 1
	// 			? new Date(datesForDisplay[datesForDisplay.length - 1])
	// 			: new Date(startDate); // Якщо вибрано один день, кінцева дата така ж, як і початкова

	// 	// Встановлюємо кінцевий час для одного дня (23:59:59), щоб включити події, які відбуваються пізно ввечері
	// 	if (datesForDisplay.length === 1) {
	// 		endDate.setHours(23, 59, 59, 999);
	// 	}

	// 	console.log(`Start date: ${startDate}, End date: ${endDate}`);

	// 	// Filtering events within the date range
	// 	const filteredEvents = allFilteredEvents.filter((event: any) => {
	// 		const eventDate = new Date(
	// 			event.start.dateTime || event.start.date
	// 		); // Ensure correct date handling
	// 		return eventDate >= startDate && eventDate <= endDate; // Only events within the selected date range
	// 	});

	// 	console.log('Filtered Events:', filteredEvents);
	// 	return filteredEvents; // Return the filtered events
	// };
	// const filteredEventsByCalendar = (calendars: any) => {
	// 	if (selectedCalendarLists.length === 0) {
	// 		console.log('No calendars selected');
	// 		return [];
	// 	}

	// 	// Масив для збереження всіх відфільтрованих подій
	// 	let allFilteredEvents: any[] = [];

	// 	calendars.forEach((calendar: any) => {
	// 		if (selectedCalendarLists.includes(calendar.id)) {
	// 			console.log(`Matching calendar found: ${calendar.id}`);
	// 			allFilteredEvents = allFilteredEvents.concat(calendar.events);
	// 		}
	// 	});

	// 	const startDate = new Date(datesForDisplay[0]);
	// 	const endDate =
	// 		datesForDisplay.length > 1
	// 			? new Date(datesForDisplay[datesForDisplay.length - 1])
	// 			: new Date(startDate);

	// 	if (datesForDisplay.length === 1) {
	// 		endDate.setHours(23, 59, 59, 999);
	// 	}

	// 	console.log(`Start date: ${startDate}, End date: ${endDate}`);

	// 	const uniqueEvents: { [key: string]: any } = {};
	// 	const filteredEvents = allFilteredEvents.filter((event: any) => {
	// 		const eventStartDate = new Date(
	// 			event.start.dateTime || event.start.date
	// 		);
	// 		const eventEndDate = new Date(event.end.dateTime || event.end.date);

	// 		// Проверка на дубляж по id
	// 		if (!uniqueEvents[event.id]) {
	// 			uniqueEvents[event.id] = true;

	// 			// Проверка, что событие попадает в текущий диапазон отображаемых дат
	// 			return (
	// 				(eventStartDate >= startDate &&
	// 					eventStartDate <= endDate) ||
	// 				(eventEndDate >= startDate && eventEndDate <= endDate) ||
	// 				(eventStartDate <= startDate && eventEndDate >= endDate) // Если событие перекрывает весь диапазон
	// 			);
	// 		}
	// 		return false;
	// 	});

	// 	console.log('Filtered Events:', filteredEvents);

	// 	const fullDayEvents: any[] = [];
	// 	const timeSlotEvents: any[] = [];

	// 	filteredEvents.forEach((event: any) => {
	// 		if (event.start.date) {
	// 			// Событие на весь день
	// 			const eventStartDate = new Date(event.start.date);
	// 			const eventEndDate = new Date(event.end.date);

	// 			// Если событие длится несколько дней
	// 			for (
	// 				let d = eventStartDate;
	// 				d <= eventEndDate;
	// 				d.setDate(d.getDate() + 1)
	// 			) {
	// 				fullDayEvents.push({ ...event, currentDate: new Date(d) });
	// 			}
	// 		} else if (event.start.dateTime) {
	// 			// Событие с конкретным временем
	// 			timeSlotEvents.push(event);
	// 		}
	// 	});

	// 	setFullDayEvents(fullDayEvents);
	// 	setTimesSlotEvents(timeSlotEvents);
	// };
	// const filteredEventsByCalendar = (calendars: any) => {
	// 	if (selectedCalendarLists.length === 0) {
	// 		console.log('No calendars selected');
	// 		return [];
	// 	}

	// 	// Масив для збереження всіх відфільтрованих подій
	// 	let allFilteredEvents: any[] = [];

	// 	calendars.forEach((calendar: any) => {
	// 		// Перевірка, чи календар вибрано
	// 		if (selectedCalendarLists.includes(calendar.id)) {
	// 			console.log(`Matching calendar found: ${calendar.id}`);

	// 			// Додаємо всі події з вибраного календаря до загального масиву
	// 			allFilteredEvents = allFilteredEvents.concat(calendar.events);
	// 		}
	// 	});

	// 	const startDate = new Date(datesForDisplay[0]);
	// 	const endDate =
	// 		datesForDisplay.length > 1
	// 			? new Date(datesForDisplay[datesForDisplay.length - 1])
	// 			: new Date(startDate); // Якщо вибрано один день, кінцева дата така ж, як і початкова

	// 	// Встановлюємо кінцевий час для одного дня (23:59:59), щоб включити події, які відбуваються пізно ввечері
	// 	if (datesForDisplay.length === 1) {
	// 		endDate.setHours(23, 59, 59, 999);
	// 	}

	// 	console.log(`Start date: ${startDate}, End date: ${endDate}`);

	// 	// Створимо об'єкт для збереження унікальних подій
	// 	const uniqueEvents: { [key: string]: any } = {};

	// 	// Фільтрація подій у межах вибраного діапазону дат
	// 	const filteredEvents = allFilteredEvents.filter((event: any) => {
	// 		const eventDate = new Date(
	// 			event.start.dateTime || event.start.date
	// 		);

	// 		// Перевірка на дублювання по id події
	// 		if (!uniqueEvents[event.id]) {
	// 			uniqueEvents[event.id] = true; // Позначаємо подію як оброблену

	// 			// Повертаємо лише події у межах вибраного діапазону
	// 			return eventDate >= startDate && eventDate <= endDate;
	// 		} else {
	// 			// Якщо подія вже була оброблена, пропускаємо її
	// 			return false;
	// 		}
	// 	});

	// 	console.log('Filtered Events:', filteredEvents);
	// 	// return filteredEvents; // Повертаємо відфільтровані події

	// 	const fullDayEvents: any[] = [];
	// 	const timeSlotEvents: any[] = [];

	// 	// filteredEvents.forEach((event: any) => {
	// 	// 	const eventDate = new Date(
	// 	// 		event.start.dateTime || event.start.date
	// 	// 	);
	// 	// 	// const eventDate = new Date(
	// 	// 	// 	event.start.dateTime || event.start.date
	// 	// 	// );

	// 	// 	// if (event.start.date || event.end.dateTime > eventDate) {
	// 	// 	// 	fullDayEvents.push(event);
	// 	// 	// }
	// 	// 	// // if (
	// 	// 	// // 	//event.start.date ||
	// 	// 	// // 	event.end.dateTime > eventDate
	// 	// 	// // )
	// 	// 	// //  {
	// 	// 	// // 	fullDayEvents.push(event);
	// 	// 	// // }
	// 	// 	// else if (
	// 	// 	// 	event.start.dateTime
	// 	// 	// 	// &&
	// 	// 	// 	// eventDate >= startDate &&
	// 	// 	// 	// eventDate <= endDate
	// 	// 	// ) {
	// 	// 	// 	timeSlotEvents.push(event);
	// 	// 	// }

	// 	// 	if (
	// 	// 		event.start.date ||
	// 	// 		(event.end.dateTime && event.end.dateTime > eventDate)
	// 	// 	) {
	// 	// 		fullDayEvents.push(event);
	// 	// 	} else if (event.start.dateTime) {
	// 	// 		timeSlotEvents.push(event);
	// 	// 	}

	// 	// 	// if (event.start.date) {
	// 	// 	// 	fullDayEvents.push(event);
	// 	// 	// } else if (
	// 	// 	// 	event.start.dateTime
	// 	// 	// 	// &&
	// 	// 	// 	// eventDate >= startDate &&
	// 	// 	// 	// eventDate <= endDate
	// 	// 	// ) {
	// 	// 	// 	timeSlotEvents.push(event);
	// 	// 	// }
	// 	// });

	// 	// console.log(`fullDayEvents: ${JSON.stringify(fullDayEvents)}`);
	// 	// console.log(`timeSlotEvents: ${JSON.stringify(timeSlotEvents)}`);

	// 	filteredEvents.forEach((event: any) => {
	// 		const eventStart = new Date(
	// 			event.start.dateTime || event.start.date
	// 		);
	// 		const eventEnd = new Date(event.end.dateTime || event.end.date);

	// 		const isMultiDayEvent = eventEnd.getDate() !== eventStart.getDate();

	// 		if (event.start.date || isMultiDayEvent) {
	// 			fullDayEvents.push(event); // Мультидневные события или события на весь день
	// 		} else if (event.start.dateTime) {
	// 			timeSlotEvents.push(event); // События с конкретным временем в пределах одного дня
	// 		}
	// 	});
	// 	setFullDayEvents(fullDayEvents);
	// 	setTimesSlotEvents(timeSlotEvents);
	// };

	// const filteredEventsByCalendar = (events: any[]) => {
	// 	const allDayEvents: any[] = [];
	// 	const timeSlotEvents: any[] = [];

	// 	events.forEach((event) => {
	// 		if (event.start.date && event.end.date) {
	// 			// Це подія на весь день
	// 			allDayEvents.push(event);
	// 		} else if (event.start.dateTime && event.end.dateTime) {
	// 			// Це подія з конкретним часом
	// 			timeSlotEvents.push(event);
	// 		}
	// 	});

	// 	console.log(`allDayEvents: ${allDayEvents}`);
	// 	console.log(`timeSlotEvents: ${timeSlotEvents}`);

	// 	return { allDayEvents, timeSlotEvents };
	// };

	useEffect(() => {
		if (isSignedIn && allEvents.length > 0) {
			filteredEventsByCalendar(allEvents);
		} else {
			// console.log('Waiting for calendar events or sign-in...');
		}
	}, [allEvents, selectedCalendarLists, isSignedIn, datesForDisplay]);

	useEffect(() => {
		const updatedDates =
			view === 'week' ? getDatesForWeek(currentDate) : [currentDate];
		setDatesForDisplay(updatedDates);
	}, [view, currentDate]);

	return (
		<div>
			<div className={styles.week}>
				{/* <div className={styles.header}>
					<div className={styles.timeColumn}></div>
					<div className={styles.weekdays}>
						{datesForDisplay.map((dateStr, index) => {
							const date = new Date(dateStr);
							const daysOfWeek = [
								'Пн',
								'Вт',
								'Ср',
								'Чт',
								'Пт',
								'Сб',
								'Вс',
							];
							const dayOfWeek =
								daysOfWeek[(date.getDay() + 6) % 7];
							const dayOfMonth = date.getDate();

							return (
								<div
									key={index}
									className={styles.dayContainer}
								>
									<div className={styles.dayOfWeek}>
										{dayOfWeek}
									</div>
									<div className={styles.dayOfMonth}>
										{dayOfMonth}
									</div>
								</div>
							);
						})}
					</div>
				</div> */}

				<FieldHeader
					dates={datesForDisplay}
					fullDayEvents={fullDayEvents}
				/>

				<div className={styles.body}>
					<div className={styles.timeColumn}>
						{timeSlots.map((time, index) => (
							<div key={index} className={styles.timeSlot}>
								{time}
							</div>
						))}
					</div>

					{/* {datesForDisplay.map((dateStr, dateIndex) => {
						const date = new Date(dateStr);

						return (
							<div key={dateIndex} className={styles.dayColumn}>
								{/* Full-day events */}
					{/* <div className={styles.fullDayEvents}>
									{fullDayEvents
										.filter((event) => {
											const eventDate = new Date(
												event.start.date
											);
											return (
												eventDate.toDateString() ===
												date.toDateString()
											);
										})
										.map((event) => (
											<div
												key={event.id}
												className={styles.fullDayEvent}
											>
												{event.summary}
											</div>
										))}
								</div> */}

					{/* Time slot events */}
					{/* {timeSlots.map((slot, slotIndex) => {
									const timeSlotEvent = timeSlotEvents.find(
										(event) => {
											const eventDateTime = new Date(
												event.start.dateTime || ''
											);
											return (
												eventDateTime.toDateString() ===
													date.toDateString() &&
												eventDateTime.getHours() ===
													slotIndex
											);
										}
									);

									return (
										<div
											key={slotIndex}
											className={styles.timeSlotEvent}
										>
											{timeSlotEvent
												? timeSlotEvent.summary
												: ''}
										</div>
									);
								})} */}
					{/* </div>
						); */}
					{/* })} */}
				</div>
			</div>
		</div>
	);

	// return (
	// 	<div className={styles.week}>
	// 		<div className={styles.header}>
	// 			<div className={styles.timeHeader}></div>
	// 			<div className={styles.weekdays}>
	// 				{datesForDisplay.map((dateStr, index) => {
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
	// 					const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7];
	// 					const dayOfMonth = date.getDate();

	// 					const dayEvents = fullDayEvents.filter(
	// 						(event) =>
	// 							new Date(event.start.date).toDateString() ===
	// 							date.toDateString()
	// 					);

	// 					const timeSlotEventsFinish = timeSlotEvents.filter(
	// 						(event) =>
	// 							new Date(
	// 								event.start.dateTime
	// 							).toDateString() === date.toDateString()
	// 					);

	// 					return (
	// 						<div key={index} className={styles.dayContainer}>
	// 							<div className={styles.dayOfWeek}>
	// 								{dayOfWeek}
	// 							</div>
	// 							<div className={styles.dayOfMonth}>
	// 								{dayOfMonth}
	// 							</div>
	// 							<div className={styles.eventsContainer}>
	// 								{dayEvents.map((event, idx) => (
	// 									<div
	// 										key={idx}
	// 										className={styles.fullDayEvent}
	// 									>
	// 										{event.summary}
	// 									</div>
	// 								))}
	// 								{timeSlots.map((slot, idx) => (
	// 									<div
	// 										key={idx}
	// 										className={styles.timeSlot}
	// 									>
	// 										{slot}
	// 										{timeSlotEventsFinish
	// 											.filter((event) => {
	// 												const eventTime = new Date(
	// 													event.start.dateTime!
	// 												).getHours();
	// 												const [startHour] = slot
	// 													.split('-')[0]
	// 													.split(':');
	// 												return (
	// 													eventTime ===
	// 													parseInt(startHour)
	// 												);
	// 											})
	// 											.map((event, idx) => (
	// 												<div
	// 													key={idx}
	// 													className={
	// 														styles.timeSlotEvent
	// 													}
	// 												>
	// 													{event.summary}
	// 												</div>
	// 											))}
	// 									</div>
	// 								))}
	// 							</div>
	// 						</div>
	// 					);
	// 				})}
	// 			</div>
	// 		</div>
	// 	</div>
	// );
};

// 	return (
// 		<div className={styles.week}>
// 			<div className={styles.header}>
// 				<div className={styles.timeHeader}></div>
// 				<div className={styles.weekdays}>
// 					{datesForDisplay.map((dateStr, index) => {
// 						const date = new Date(dateStr);
// 						const daysOfWeek = [
// 							'Пн',
// 							'Вт',
// 							'Ср',
// 							'Чт',
// 							'Пт',
// 							'Сб',
// 							'Вс',
// 						];
// 						const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7]; // Щоб почати тиждень з понеділка
// 						const dayOfMonth = date.getDate(); // Відображаємо число

// 						// Фільтрація подій, які тривають увесь день
// 						const dayEvents = fullDayEvents.filter((event) => {
// 							if (event.start.date) {
// 								const eventDate = new Date(event.start.date);
// 								return (
// 									eventDate.toDateString() ===
// 									date.toDateString()
// 								);
// 							}
// 							return false; // Якщо date не визначено, пропустити подію
// 						});

// 						// Фільтрація подій, які мають часові проміжки
// 						const timeSlotEventsFinish = timeSlotEvents.filter(
// 							(event) => {
// 								if (event.start.dateTime) {
// 									const eventDateTime = new Date(
// 										event.start.dateTime
// 									);
// 									return (
// 										eventDateTime.toDateString() ===
// 										date.toDateString()
// 									);
// 								}
// 								return false; // Якщо dateTime не визначено, пропустити подію
// 							}
// 						);

// 						return (
// 							<div key={index} className={styles.dayContainer}>
// 								<div className={styles.dayOfWeek}>
// 									{dayOfWeek}
// 								</div>
// 								<div className={styles.dayOfMonth}>
// 									{dayOfMonth}
// 								</div>
// 								<div className={styles.eventsContainer}>
// 									{/* Відображення подій, які тривають увесь день */}
// 									{dayEvents.map((event) => (
// 										<div
// 											key={event.id}
// 											className={styles.event}
// 										>
// 											{event.summary}{' '}
// 											{/* Відображаємо назву події */}
// 										</div>
// 									))}
// 								</div>
// 								{timeSlotEventsFinish.map((event: any) => (
// 									<div
// 										key={event.id}
// 										className={styles.event}
// 									>
// 										{event.summary} at{' '}
// 										{new Date(
// 											event.start.dateTime
// 										).toLocaleTimeString()}
// 									</div>
// 								))}
// 							</div>
// 						);
// 					})}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

export default DayOrWeekView;

const handleCellClick = (date: string, time: string) => {
	console.log(`Selected date: ${date}, time: ${time}`);
};

// return (
// 	<div className={styles.week}>
// 		<div className={styles.header}>
// 			<div className={styles.timeHeader}></div>
// 			<div className={styles.weekdays}>
// 				{datesForDisplay.map((dateStr, index) => {
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
// 					const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7]; // Щоб почати тиждень з понеділка
// 					const dayOfMonth = date.getDate(); // Відображаємо число

// 					// Фільтрація подій, які тривають увесь день
// 					const dayEvents = fullDayEvents.filter((event) => {
// 						// Перевірка на наявність date
// 						if (event.start.date) {
// 							const eventDate = new Date(event.start.date);
// 							return (
// 								eventDate.toDateString() ===
// 								date.toDateString()
// 							); // Порівнюємо дати
// 						}
// 						return false; // Якщо date не визначено, пропустити подію
// 					});

// 					return (
// 						<div key={index} className={styles.dayContainer}>
// 							<div className={styles.dayOfWeek}>
// 								{dayOfWeek}
// 							</div>
// 							<div className={styles.dayOfMonth}>
// 								{dayOfMonth}
// 							</div>
// 							<div className={styles.eventsContainer}>
// 								{dayEvents.map((event) => (
// 									<div
// 										key={event.id}
// 										className={styles.event}
// 									>
// 										{event.summary}{' '}
// 										{/* Відображаємо назву події */}
// 									</div>
// 								))}
// 							</div>
// 						</div>
// 					);
// 				})}
// 			</div>
// 		</div>
// 	</div>
// );

// <div className={styles.week}>
// 	<div className={styles.header}>
// 		<div className={styles.timeHeader}></div>
// 		<div className={styles.weekdays}>
// 			{datesForDisplay.map((dateStr, index) => {
// 				const date = new Date(dateStr);
// 				const daysOfWeek = [
// 					'Пн',
// 					'Вт',
// 					'Ср',
// 					'Чт',
// 					'Пт',
// 					'Сб',
// 					'Вс',
// 				];
// 				const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7]; // Щоб почати тиждень з понеділка
// 				return <div key={index}>{dayOfWeek}</div>;
// 			})}
// 		</div>
// 	</div>
// 	<div className={styles.body}>
// 		{timeSlots.map((timeSlot, rowIndex) => (
// 			<div key={rowIndex} className={styles.row}>
// 				<div className={styles.time}>{timeSlot}</div>
// 				<div className={styles.cells}>
// 					{datesForDisplay.map((dateStr, colIndex) => {
// 						const date = new Date(dateStr);
// 						const formattedDate = date.toLocaleDateString();

// 						return (
// 							<div
// 								key={colIndex}
// 								className={styles.cell}
// 								onClick={() =>
// 									handleCellClick(
// 										formattedDate,
// 										timeSlot
// 									)
// 								}
// 							>
// 								{formattedDate}
// 							</div>
// 						);
// 					})}
// 				</div>
// 			</div>
// 		))}
// 	</div>
// </div>
// );
