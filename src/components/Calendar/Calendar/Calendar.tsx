import styles from './Calendar.module.css';
import { useDaysToShowInCalendar } from '../../../hooks/useDaysToShowInCalendar';
// import MonthFilter from '../MonthFilter/MonthFilter';

import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDate } from './../../../store';
import { RootState } from '../../../store';

const Calendar = () => {
	const dispatch = useDispatch();
	// let currentDate = new Date(
	// 	useSelector((state: RootState) => state.currentDate)
	// );

	// currentDate.setUTCHours(0, 0, 0, 0);
	// let incomeDate = useSelector((state: RootState) => state.currentDate);
	// let incomeDateNew = new Date(incomeDate);

	let currentDate = new Date(
		useSelector((state: RootState) => state.currentDate)
	);

	// incomeDateNew.setHours(0, 0, 0, 0);
	// console.log(`currentDate: ${currentDate}`);

	// let currentDate = new Date(
	// 	useSelector((state: RootState) => state.currentDate)
	// );

	// Преобразование даты в UTC
	// currentDate = new Date(
	// 	Date.UTC(
	// 		currentDate.getUTCFullYear(),
	// 		currentDate.getUTCMonth(),
	// 		currentDate.getUTCDate(),
	// 		0,
	// 		0,
	// 		0
	// 	)
	// );

	// const utcDate = new Date(
	// 	Date.UTC(
	// 		currentDate.getUTCFullYear(),
	// 		currentDate.getUTCMonth(),
	// 		currentDate.getUTCDate(),
	// 		0,
	// 		0,
	// 		0
	// 	)
	// );

	// console.log(`utcDate: ${utcDate}`);

	// console.log(`currend date in calendar component: ${currentDate}`);
	// const daysToDisplay = useDaysToShowInCalendar(currentDate);
	// const daysToDisplay = useDaysToShowInCalendar(utcDate);
	const daysToDisplay = useDaysToShowInCalendar(currentDate);

	// console.log(daysToDisplay);
	// const handleDayClick = (day: Date) => {
	// 	const formattedDay = new Date(day);
	// 	formattedDay.setUTCHours(0, 0, 0, 0);

	// 	dispatch(setCurrentDate(formattedDay));
	// };

	// const handleDayClick = (day: Date) => {
	// 	// const date = day.setUTCHours(0, 0, 0, 0);

	// 	// /let incomeDate = new Date(day);

	// 	let year = day.getFullYear();
	// 	let month = day.getMonth();
	// 	let incomeDay = day.getDate();

	// 	console.log(`incomeDay: ${incomeDay}`);

	// 	let incomeDate = new Date(year, month, incomeDay, 0, 0, 0, 0);

	// 	console.log(`click day: ${day}`);
	// 	// incomeDate.setHours(0, 0, 0, 0);

	// 	// const finishDate = incomeDate.toISOString();

	// 	console.log(`date click: ${incomeDate.toISOString()}`);

	// 	// const finishDate = new Date(day.setUTCHours(0, 0, 0, 0));

	// 	// console.log(`finishDate: ${finishDate}`);
	// 	// const utcDay = new Date(
	// 	// 	Date.UTC(
	// 	// 		day.getUTCFullYear(),
	// 	// 		day.getUTCMonth(),
	// 	// 		day.getUTCDate(),
	// 	// 		0,
	// 	// 		0,
	// 	// 		0
	// 	// 	)
	// 	// );
	// 	// const newDay = new day.setUTCHours(0, 0, 0, 0);
	// 	// const formatedDate = newDay;
	// 	// dispatch(setCurrentDate(date));
	// };

	// const handleDayClick = (day: Date) => {
	// 	let year = day.getUTCFullYear();
	// 	let month = day.getUTCMonth();
	// 	let incomeDay = day.getUTCDate();

	// 	let incomeDate = new Date(Date.UTC(year, month, incomeDay, 0, 0, 0));

	// 	console.log(`incomeDay: ${incomeDay}`);
	// 	console.log(`click day: ${day}`);
	// 	console.log(`date click (UTC): ${incomeDate.toISOString()}`);

	// 	// dispatch(setCurrentDate(incomeDate));
	// };

	// const handleDayClick = (day: Date) => {
	// 	// Получаем год, месяц и день из локального времени
	// 	let year = day.getFullYear();
	// 	let month = day.getMonth();
	// 	let incomeDay = day.getDate();

	// 	// Создаем дату с учетом локального времени
	// 	let incomeDate = new Date(year, month, incomeDay);
	// 	incomeDate.setHours(0, 0, 0, 0); // Устанавливаем время на 00:00 локально

	// 	console.log(`incomeDay: ${incomeDay}`);
	// 	console.log(`click day: ${day}`);
	// 	console.log(`date click (local 00:00): ${incomeDate.toISOString()}`);

	// 	// dispatch(setCurrentDate(incomeDate));
	// };

	// const handleDayClick = (day: Date) => {
	// 	// Создаем дату в UTC с помощью Date.UTC
	// 	let utcDate = new Date(
	// 		Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0)
	// 	);

	// 	// Преобразуем дату в локальное время
	// 	let localDate = new Date(
	// 		utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
	// 	);

	// 	console.log(`incomeDay: ${day.getDate()}`);
	// 	console.log(`click day: ${day}`);
	// 	console.log(`date click (UTC): ${utcDate.toISOString()}`);
	// 	console.log(`date click (local): ${localDate.toISOString()}`);

	// 	// dispatch(setCurrentDate(localDate));
	// };

	// const handleDayClick = (day: Date) => {
	// 	// Получаем локальные год, месяц и день
	// 	let year = day.getFullYear();
	// 	let month = day.getMonth();
	// 	let incomeDay = day.getDate();

	// 	// Создаем новую дату на основе локального времени
	// 	let localDate = new Date(year, month, incomeDay, 0, 0, 0);

	// 	console.log(`incomeDay: ${incomeDay}`);
	// 	console.log(`click day: ${day}`);
	// 	console.log(`date click (local): ${localDate.toISOString()}`);

	// 	// dispatch(setCurrentDate(localDate));
	// };

	const handleDayClick = (day: Date) => {
		// Получаем локальные год, месяц и день
		let year = day.getFullYear();
		let month = day.getMonth();
		let incomeDay = day.getDate();

		// Создаем дату в UTC
		let utcDate = new Date(Date.UTC(year, month, incomeDay, 0, 0, 0));

		let utcDateInString = utcDate.toISOString();

		// console.log(`incomeDay: ${incomeDay}`);
		// console.log(`click day: ${day}`);
		// console.log(`date click (UTC): ${utcDate.toISOString()}`);
		// console.log(`finish date: ${utcDateInString}`);
		// Используйте UTC дату для сохранения или других операций
		dispatch(setCurrentDate(utcDateInString));
	};

	return (
		<>
			{/* <MonthFilter dateNow={dateNow} currentYear={currentYear} /> */}
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
							} ${
								day.day === currentDate.getDate() &&
								day.date.getMonth() === currentDate.getMonth()
									? styles.activeDay
									: styles.currentMonth
							}`}
							onClick={() => handleDayClick(day.date)}
						>
							{day.day}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Calendar;
