import React, { useEffect, useState } from 'react';
import styles from './DayOrWeekView.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getDatesForWeek } from '../../../utils/getDatesForWeek';
import { useAuth } from '../../../context/useAuth';
import { useCalendarEvents } from '../../../hooks/useCalendarEvents';

import { TaskList } from '../../../hooks/useGoogleAuth';

// interface TaskList {
// 	id: string;
// 	title: string;
// }

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
	const [startDateToFetch, setStartDateToFetch] = useState<string>('');
	const [endDateToFetch, setEndDateToFetch] = useState<string>('');

	// const { userTasklists } = useAuth();
	// console.log(`userTasklists ${userTasklists}`);

	useEffect(() => {
		const updatedDates =
			view === 'week' ? getDatesForWeek(currentDate) : [currentDate];
		setDatesForDisplay(updatedDates);
	}, [view, currentDate]);

	useEffect(() => {
		if (datesForDisplay.length > 0) {
			const startDate = new Date(datesForDisplay[0]);
			const endDate = new Date(
				datesForDisplay[datesForDisplay.length - 1]
			);

			setStartDateToFetch(startDate.toISOString());
			setEndDateToFetch(
				new Date(
					Date.UTC(
						endDate.getFullYear(),
						endDate.getMonth(),
						endDate.getDate(),
						23,
						59,
						59
					)
				).toISOString()
			);
		}
	}, [datesForDisplay]);

	const { events } = useCalendarEvents(startDateToFetch, endDateToFetch);

	useEffect(() => {
		if (events.length > 0) {
			console.log('Fetched events:', events);
		} else {
			console.log('No events fetched');
		}
	}, [events]);

	if (!startDateToFetch || !endDateToFetch) {
		return <div>Завантаження...</div>;
	}

	return (
		<div className={styles.week}>
			<div className={styles.header}>
				<div className={styles.timeHeader}></div>
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
						const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7]; // Щоб почати тиждень з понеділка
						return <div key={index}>{dayOfWeek}</div>;
					})}
				</div>
			</div>
			<div className={styles.body}>
				{timeSlots.map((timeSlot, rowIndex) => (
					<div key={rowIndex} className={styles.row}>
						<div className={styles.time}>{timeSlot}</div>
						<div className={styles.cells}>
							{datesForDisplay.map((dateStr, colIndex) => {
								const date = new Date(dateStr);
								const formattedDate = date.toLocaleDateString();

								return (
									<div
										key={colIndex}
										className={styles.cell}
										onClick={() =>
											handleCellClick(
												formattedDate,
												timeSlot
											)
										}
									>
										{formattedDate}
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default DayOrWeekView;

const handleCellClick = (date: string, time: string) => {
	console.log(`Selected date: ${date}, time: ${time}`);
};

// import React, { useEffect, useState } from 'react';
// import styles from './DayOrWeekView.module.css';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../store';
// import { getDatesForWeek } from '../../../utils/getDatesForWeek';
// import { useAuth } from '../../../context/useAuth';
// import { useCalendarEvents } from '../../../hooks/useCalendarEvents';
// // import { useGoogleTasks } from '../../../hooks/useGoogleTasks';

// const timeSlots = [
// 	'00:00-01:00',
// 	'01:00-02:00',
// 	'02:00-03:00',
// 	'03:00-04:00',
// 	'04:00-05:00',
// 	'05:00-06:00',
// 	'06:00-07:00',
// 	'07:00-08:00',
// 	'08:00-09:00',
// 	'09:00-10:00',
// 	'10:00-11:00',
// 	'11:00-12:00',
// 	'12:00-13:00',
// 	'13:00-14:00',
// 	'14:00-15:00',
// 	'15:00-16:00',
// 	'16:00-17:00',
// 	'17:00-18:00',
// 	'18:00-19:00',
// 	'19:00-20:00',
// 	'20:00-21:00',
// 	'21:00-22:00',
// 	'22:00-23:00',
// 	'23:00-00:00',
// ];

// const DayOrWeekView: React.FC = () => {
// 	const { fetchTaskLists } = useAuth();
// 	const [tasklists, setTasklists] = useState<any[]>([]);

// 	useEffect(() => {
// 		if (fetchTaskLists) {
// 			const tasklists = fetchTaskLists();

// 			setTasklists(tasklists);
// 			// const fetchedTaskLists = fetchTaskLists();
// 			// setTasklists(fetchedTaskLists);
// 			// console.log(`tasklists: ${fetchedTaskLists}`);
// 		}
// 	}, [fetchTaskLists]);

// 	const currentDate = useSelector((state: RootState) => state.currentDate);
// 	const view = useSelector((state: RootState) => state.view);

// 	// Ініціалізація початкового стану на основі view і currentDate
// 	const [datesForDisplay, setDatesForDisplay] = useState<string[]>(() => {
// 		return view === 'week' ? getDatesForWeek(currentDate) : [currentDate];
// 	});

// 	// Стан для діапазону дат
// 	const [startDateToFetch, setStartDateToFetch] = useState<string>('');
// 	const [endDateToFetch, setEndDateToFetch] = useState<string>('');

// 	// Оновлення datesForDisplay при зміні view або currentDate
// 	useEffect(() => {
// 		const updatedDates =
// 			view === 'week' ? getDatesForWeek(currentDate) : [currentDate];
// 		setDatesForDisplay(updatedDates);
// 	}, [view, currentDate]);

// 	// Оновлення діапазону дат для fetch
// 	useEffect(() => {
// 		if (datesForDisplay.length > 0) {
// 			const startDate = new Date(datesForDisplay[0]);
// 			const endDate = new Date(
// 				datesForDisplay[datesForDisplay.length - 1]
// 			);

// 			// setStartDateToFetch(startDate.toISOString());
// 			setStartDateToFetch(startDate.toISOString());

// 			setEndDateToFetch(
// 				new Date(
// 					Date.UTC(
// 						endDate.getFullYear(),
// 						endDate.getMonth(),
// 						endDate.getDate(),
// 						23,
// 						59,
// 						59
// 					)
// 				).toISOString()
// 			);
// 		}
// 	}, [datesForDisplay]);

// 	// Виклик хуку useCalendarEvents тільки після того, як діапазон дат встановлено
// 	const { events } = useCalendarEvents(startDateToFetch, endDateToFetch);

// 	// const { tasks, loading, error } = useGoogleTasks(tasklistId);

// 	useEffect(() => {
// 		if (events.length > 0) {
// 			console.log('Fetched events:', events);
// 		} else {
// 			console.log('No events fetched');
// 		}
// 	}, [events]);

// 	// Рендеринг контенту тільки після того, як все готово
// 	if (
// 		!startDateToFetch ||
// 		!endDateToFetch
// 		// || loading
// 	) {
// 		return <div>Завантаження...</div>;
// 	}

// 	// const { fetchTaskLists } = useAuth();

// 	// const tasklists = fetchTaskLists()

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
// 						return <div key={index}>{dayOfWeek}</div>;
// 					})}
// 				</div>
// 			</div>
// 			<div className={styles.body}>
// 				{timeSlots.map((timeSlot, rowIndex) => (
// 					<div key={rowIndex} className={styles.row}>
// 						<div className={styles.time}>{timeSlot}</div>
// 						<div className={styles.cells}>
// 							{datesForDisplay.map((dateStr, colIndex) => {
// 								const date = new Date(dateStr);
// 								const formattedDate = date.toLocaleDateString();

// 								return (
// 									<div
// 										key={colIndex}
// 										className={styles.cell}
// 										onClick={() =>
// 											handleCellClick(
// 												formattedDate,
// 												timeSlot
// 											)
// 										}
// 									>
// 										{formattedDate}
// 									</div>
// 								);
// 							})}
// 						</div>
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// export default DayOrWeekView;

// const handleCellClick = (date: string, time: string) => {
// 	// Обробка кліку
// 	console.log(`Selected date: ${date}, time: ${time}`);
// };
