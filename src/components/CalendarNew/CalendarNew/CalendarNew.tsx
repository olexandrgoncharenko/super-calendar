// import React, { useState } from 'react';
import styles from './Calendar.module.css';
import { useDaysToShowInCalendar } from '../../../hooks/useDaysToShowInCalendar';
// import MonthFilter from '../MonthFilter/MonthFilter';

const CalendarNew = () => {
	const dateNow = new Date(); // Текущая дата

	const daysToDisplay = useDaysToShowInCalendar(dateNow);
	// const currentYear = dateNow.getFullYear(); // Текущий год
	// const currentMonth = dateNow.getMonth(); // Текущий месяц (0-11)
	// const currentDate = dateNow.getDate(); // Текущая дата месяца

	// // Функция для получения количества дней в месяце
	// const getDaysInMonth = (year, month) => {
	// 	return new Date(year, month + 1, 0).getDate(); // Возвращает количество дней в месяце
	// };

	// // Функция для получения дня недели первого дня месяца
	// const getFirstDayOfMonth = (year, month) => {
	// 	return new Date(year, month, 1).getDay(); // Возвращает день недели (0 - воскресенье)
	// };

	// const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth); // Количество дней в текущем месяце
	// const firstDayOfCurrentMonth = getFirstDayOfMonth(
	// 	currentYear,
	// 	currentMonth
	// ); // День недели первого дня текущего месяца

	// // Вычисляем стартовый день для отображения календаря
	// const startDay = (firstDayOfCurrentMonth + 6) % 7; // Сдвигаем день недели, чтобы календарь начинался с понедельника
	// const daysInPreviousMonth = getDaysInMonth(currentYear, currentMonth - 1); // Количество дней в предыдущем месяце

	// const [selectedDate, setSelectedDate] = useState(null); // Состояние для выбранной даты

	// const handleDayClick = (date) => {
	// 	setSelectedDate(new Date(date)); // Обновление состояния при выборе даты
	// };

	// const calendarDays = []; // Массив для хранения дней календаря

	// console.log(calendarDays); // Для отладки: проверяем массив дней календаря

	// // Заполняем дни предыдущего месяца
	// for (let i = startDay; i > 0; i--) {
	// 	const date = new Date(
	// 		currentYear,
	// 		currentMonth - 1,
	// 		daysInPreviousMonth - i + 1
	// 	);
	// 	calendarDays.push({
	// 		date,
	// 		day: daysInPreviousMonth - i + 1,
	// 		isCurrentMonth: false,
	// 	});
	// }

	// // Заполняем дни текущего месяца
	// for (let i = 1; i <= daysInCurrentMonth; i++) {
	// 	const date = new Date(currentYear, currentMonth, i);
	// 	calendarDays.push({
	// 		date,
	// 		day: i,
	// 		isCurrentMonth: true,
	// 	});
	// }

	// // Заполняем дни следующего месяца, чтобы календарь был полностью заполнен
	// const remainingDays = 42 - calendarDays.length; // Поскольку 6 недель по 7 дней = 42 дня
	// for (let i = 1; i <= remainingDays; i++) {
	// 	const date = new Date(currentYear, currentMonth + 1, i);
	// 	calendarDays.push({
	// 		date,
	// 		day: i,
	// 		isCurrentMonth: false,
	// 	});
	// }

	return (
		<>
			{/* <MonthFilter dateNow={dateNow} currentYear={currentYear} /> */}
			{/* Компонент для фильтрации месяцев (закомментирован) */}

			{/* <h2 className={styles.title}>
                {dateNow.toLocaleString('default', { month: 'long' })}{' '}
                <span>{currentYear}</span>
            </h2> */}
			{/* Заголовок с текущим месяцем и годом (закомментирован) */}

			<div className={styles.calendar}>
				<div className={styles.weekdays}>
					<div>Mon</div>
					<div>Tue</div>
					<div>Wed</div>
					<div>Thu</div>
					<div>Fri</div>
					<div>Sat</div>
					<div>Sun</div>
				</div>
				<div className={styles.days}>
					{daysToDisplay.map((day: any, index: any) => (
						<div
							key={index}
							className={`${styles.day} ${
								day.isCurrentMonth
									? styles.currentMonth
									: styles.otherMonth
							}`}
							// onClick={() => handleDayClick(day.date)}
							// Функция для выбора даты (закомментирована)
						>
							{day.day}
						</div>
					))}
				</div>
			</div>
			{/* {selectedDate && (
				<p style={{ color: '#fff' }}>
					Выбранная дата: {selectedDate.toLocaleDateString()}
				</p>
			)} */}
			{/* Отображение выбранной даты (закомментировано) */}
		</>
	);
};

export default CalendarNew;

// import React, { useState } from 'react';
// import styles from './Calendar.module.css';
// import MonthFilter from '../MonthFilter/MonthFilter';

// const CalendarNew = () => {
// 	const dateNow = new Date();
// 	const currentYear = dateNow.getFullYear();
// 	const currentMonth = dateNow.getMonth();
// 	const currentDate = dateNow.getDate();

// 	const getDaysInMonth = (year, month) => {
// 		return new Date(year, month + 1, 0).getDate();
// 	};

// 	const getFirstDayOfMonth = (year, month) => {
// 		return new Date(year, month, 1).getDay();
// 	};

// 	const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
// 	const firstDayOfCurrentMonth = getFirstDayOfMonth(
// 		currentYear,
// 		currentMonth
// 	);

// 	const startDay = (firstDayOfCurrentMonth + 6) % 7;
// 	const daysInPreviousMonth = getDaysInMonth(currentYear, currentMonth - 1);

// 	const [selectedDate, setSelectedDate] = useState(null);

// 	const handleDayClick = (date) => {
// 		setSelectedDate(new Date(date));
// 	};

// 	const calendarDays = [];

// 	console.log(calendarDays);

// 	for (let i = startDay; i > 0; i--) {
// 		const date = new Date(
// 			currentYear,
// 			currentMonth - 1,
// 			daysInPreviousMonth - i + 1
// 		);
// 		calendarDays.push({
// 			date,
// 			day: daysInPreviousMonth - i + 1,
// 			isCurrentMonth: false,
// 		});
// 	}
// 	for (let i = 1; i <= daysInCurrentMonth; i++) {
// 		const date = new Date(currentYear, currentMonth, i);
// 		calendarDays.push({
// 			date,
// 			day: i,
// 			isCurrentMonth: true,
// 		});
// 	}
// 	const remainingDays = 42 - calendarDays.length;
// 	for (let i = 1; i <= remainingDays; i++) {
// 		const date = new Date(currentYear, currentMonth + 1, i);
// 		calendarDays.push({
// 			date,
// 			day: i,
// 			isCurrentMonth: false,
// 		});
// 	}

// 	return (
// 		<>
// 			{/* <MonthFilter dateNow={dateNow} currentYear={currentYear} /> */}

// 			{/* <h2 className={styles.title}>
//                 {dateNow.toLocaleString('default', { month: 'long' })}{' '}
//                 <span>{currentYear}</span>
//             </h2> */}
// 			<div className={styles.calendar}>
// 				<div className={styles.weekdays}>
// 					<div>Mon</div>
// 					<div>Tue</div>
// 					<div>Wed</div>
// 					<div>Thu</div>
// 					<div>Fri</div>
// 					<div>Sat</div>
// 					<div>Sun</div>
// 				</div>
// 				<div className={styles.days}>
// 					{calendarDays.map((day, index) => (
// 						<div
// 							key={index}
// 							className={`${styles.day} ${
// 								day.isCurrentMonth
// 									? styles.currentMonth
// 									: styles.otherMonth
// 							}`}
// 							// onClick={() => handleDayClick(day.date)}
// 						>
// 							{day.day}
// 						</div>
// 					))}
// 				</div>
// 			</div>
// 			{/* {selectedDate && (
// 				<p style={{ color: '#fff' }}>
// 					Выбранная дата: {selectedDate.toLocaleDateString()}
// 				</p>
// 			)} */}
// 		</>
// 	);
// };

// export default CalendarNew;
