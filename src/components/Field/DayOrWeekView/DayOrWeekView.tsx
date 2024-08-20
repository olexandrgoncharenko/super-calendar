// import React, {useEffect} from 'react';
import styles from './DayOrWeekView.module.css';
import { ViewType } from '../../../store';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useEffect, useState } from 'react';

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

const useShowDatesInField = (currentDate: string, view: ViewType) => {
	const [datesToShow, setDatesToShow] = useState<string[]>([]);

	useEffect(() => {
		if (view === 'day') {
			setDatesToShow([currentDate]);
		} else if (view === 'week') {
			const startOfWeek = new Date(currentDate);
			const dates = [];
			for (let i = 0; i < 7; i++) {
				const nextDate = new Date(startOfWeek);
				nextDate.setDate(startOfWeek.getDate() + i);
				dates.push(nextDate.toISOString());
			}
			setDatesToShow(dates);
		}
	}, [currentDate, view]);

	return datesToShow;
};

const DayOrWeekView: React.FC = () => {
	const currentDate = useSelector((state: RootState) => state.currentDate);
	const view = useSelector((state: RootState) => state.view);

	const datesForDisplay = useShowDatesInField(currentDate, view);

	const handleCellClick = (date: string, time: string) => {
		console.log(`Selected date: ${date}, time: ${time}`);
	};

	return (
		<div className={styles.week}>
			<div className={styles.header}>
				<div className={styles.timeHeader}></div>
				<div className={styles.weekdays}>
					{datesForDisplay.map((dateStr, index) => {
						const date = new Date(dateStr);
						const daysOfWeek = [
							'Sun',
							'Mon',
							'Tue',
							'Wed',
							'Thu',
							'Fri',
							'Sat',
						];
						const dayOfWeek = daysOfWeek[date.getDay()];
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

// import React, { useEffect } from 'react';
// import styles from './DayOrWeekView.module.css';
// // import { ViewType } from '../../../context/ViewContext';
// // import useDatesAndViewInField from '../../../hooks/useDatesAndViewInField';
// import { useState } from 'react';
// import { ViewType } from '../../../store';

// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../../../store';

// const datesForWeekExample = [
// 	'2024-05-20T21:00:00.000Z',
// 	'2024-05-21T21:00:00.000Z',
// 	'2024-05-22T21:00:00.000Z',
// 	'2024-05-23T21:00:00.000Z',
// 	'2024-05-24T21:00:00.000Z',
// 	'2024-05-25T21:00:00.000Z',
// 	'2024-05-26T21:00:00.000Z',
// ];

// interface DayOrWeekProps {
// 	currentView: ViewType;
// 	datesForDisplay: string[];
// }

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

// const useShowDatesInField = (currentDate: string, view: ViewType) => {
// 	const [datesToShow, setDatesToShow] = useState([]);

// 	if (view === 'day') {
// 		setDatesToShow([currentDate]);
// 	}

// 	return datesToShow;
// };
// // 	if (view === 'day') {
// // 		setDatesForDisplay([currentDate.toISOString().split('T')[0]]); // Преобразуем в строку формата 'YYYY-MM-DD'
// // 	}
// // };

// const DayOrWeekView: React.FC = () => {
// 	// const { currentDate, setCurrentDate, view, setView, datesForDisplay } =
// 	// 	useDatesAndViewInField();

// 	const currentDate = useSelector((state: RootState) => state.currentDate);
// 	console.log(`day or week current date: current date`);

// 	const datesForDisplay = useShowDatesInField(currentDate, view);

// 	console.log(`DW: ${datesForDisplay}`);

// 	// useEffect(() => {
// 	// 	console.log('Updated datesForDisplay:', datesForDisplay);
// 	// }, [datesForDisplay]);

// 	const getDayMonthYear = (date: Date) => {
// 		const day = date.getDate();
// 		const month = date.getMonth() + 1; // Months are 0-based
// 		const year = date.getFullYear();
// 		const daysOfWeek = [
// 			'Sunday',
// 			'Monday',
// 			'Tuesday',
// 			'Wednesday',
// 			'Thursday',
// 			'Friday',
// 			'Saturday',
// 		];
// 		const dayOfWeek = daysOfWeek[date.getDay()]; // Get day of the week

// 		return { day, month, year, dayOfWeek };
// 	};

// 	const handleCellClick = (date: string, time: string) => {
// 		console.log(`Selected date: ${date}, time: ${time}`);
// 	};

// 	return (
// 		<div className={styles.week}>
// 			<div className={styles.header}>
// 				<div className={styles.timeHeader}></div>
// 				<div className={styles.weekdays}>
// 					<div>Mon</div>
// 					<div>Tue</div>
// 					<div>Wed</div>
// 					<div>Thu</div>
// 					<div>Fri</div>
// 					<div>Sat</div>
// 					<div>Sun</div>
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

// // import React from 'react';
// // import styles from './DayOrWeekView.module.css';
// // import { ViewType } from '../../../context/ViewContext';

// // import useDatesAndViewInField from '../../../hooks/useDatesAndViewInField';

// // interface DayOrWeekProps {
// // 	currentView: ViewType;
// // 	datesForDisplay: string[];
// // }

// // const timeSlots = [
// // 	'00:00-01:00',
// // 	'01:00-02:00',
// // 	'02:00-03:00',
// // 	'03:00-04:00',
// // 	'04:00-05:00',
// // 	'05:00-06:00',
// // 	'06:00-07:00',
// // 	'07:00-08:00',
// // 	'08:00-09:00',
// // 	'09:00-10:00',
// // 	'10:00-11:00',
// // 	'11:00-12:00',
// // 	'12:00-13:00',
// // 	'13:00-14:00',
// // 	'14:00-15:00',
// // 	'15:00-16:00',
// // 	'16:00-17:00',
// // 	'17:00-18:00',
// // 	'18:00-19:00',
// // 	'19:00-20:00',
// // 	'20:00-21:00',
// // 	'21:00-22:00',
// // 	'22:00-23:00',
// // 	'23:00-00:00',
// // ];

// // // const DayOrWeekView: React.FC<DayOrWeekProps> = ({
// // // 	currentView,
// // // 	datesForDisplay,
// // // }) => {

// // const DayOrWeekView: React.FC = () => {
// // 	const { currentDate, setCurrentDate, view, setView } =
// // 		useDatesAndViewInField();

// // 	console.log(currentDate);
// // 	// function getDayOfWeek(date: string): string {
// // 	// 	const daysOfWeek = [
// // 	// 		'Sunday',
// // 	// 		'Monday',
// // 	// 		'Tuesday',
// // 	// 		'Wednesday',
// // 	// 		'Thursday',
// // 	// 		'Friday',
// // 	// 		'Saturday',
// // 	// 	];
// // 	// 	const dateObj = new Date(date);
// // 	// 	const dayIndex = dateObj.getDay();
// // 	// 	return daysOfWeek[dayIndex];
// // 	// }

// // 	// let weekDays = getDayOfWeek(datesForDisplay);

// // 	let datesForDisplay = [];
// // 	if (view === 'day') {
// // 	}

// // 	function getDayMonthYear(date: Date) {
// // 		const day = date.getDate();
// // 		const month = date.getMonth() + 1;
// // 		const year = date.getFullYear();

// // 		const daysOfWeek = [
// // 			'Sunday',
// // 			'Monday',
// // 			'Tuesday',
// // 			'Wednesday',
// // 			'Thursday',
// // 			'Friday',
// // 			'Saturday',
// // 		];
// // 		const dayOfWeek = daysOfWeek[date.getDay()]; // Получаем день недели

// // 		return { day, month, year, dayOfWeek };
// // 	}

// // 	// console.log(datesForDisplay);

// // 	const handleCellClick = (date: any, time: any) => {
// // 		console.log(`Выбранная дата: ${date}, время: ${time}`);
// // 	};

// // 	return (
// // 		<div className={styles.week}>
// // 			<div className={styles.header}>
// // 				<div className={styles.timeHeader}></div>
// // 				<div className={styles.weekdays}>
// // 					<div>Mon</div>
// // 					<div>Tue</div>
// // 					<div>Wed</div>
// // 					<div>Thu</div>
// // 					<div>Fri</div>
// // 					<div>Sat</div>
// // 					<div>Sun</div>
// // 				</div>
// // 			</div>
// // 			<div className={styles.body}>
// // 				{timeSlots.map((timeSlot, rowIndex) => (
// // 					<div key={rowIndex} className={styles.row}>
// // 						<div className={styles.time}>{timeSlot}</div>
// // 						<div className={styles.cells}>
// // 							{/* {currentDate.map((dateStr: any, colIndex: any) => { */}
// // 							//{' '}
// // 							{datesForDisplay.map((dateStr, colIndex) => {
// // 								const date = new Date(dateStr);
// // 								const formattedDate = date.toLocaleDateString();

// // 								return (
// // 									<div
// // 										key={colIndex}
// // 										className={styles.cell}
// // 										onClick={() =>
// // 											handleCellClick(
// // 												formattedDate,
// // 												timeSlot
// // 											)
// // 										}
// // 									>
// // 										cell
// // 									</div>
// // 								);
// // 							})}
// // 						</div>
// // 					</div>
// // 				))}
// // 			</div>
// // 		</div>
// // 	);
// // };

// // export default DayOrWeekView;
