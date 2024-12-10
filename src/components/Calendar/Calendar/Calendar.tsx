import styles from './Calendar.module.css';
import { useDaysToShowInCalendar } from '../../../hooks/useDaysToShowInCalendar';
import { useSelector, useDispatch } from 'react-redux';
import {
	setCurrentDate,
	setActiveCalendarMonthAndYear,
} from './../../../store';
import { RootState } from '../../../store';

const Calendar = () => {
	const dispatch = useDispatch();
	let currentDate = new Date(
		useSelector((state: RootState) => state.currentDate)
	); // Выбраная дата при клике на день календаря
	console.log(`currentDate: ${currentDate}`);

	let activeCalendarViewMonthAndYear = useSelector(
		(state: RootState) => state.activeCalendarViewMonthAndYear
	);

	// console.log(`calendarViewDate: ${JSON.stringify(calendarViewDate)}`);

	// const allDaysToDisplay = useDaysToShowInCalendar(currentDate);
	const daysToDisplay = useDaysToShowInCalendar(
		// const allDaysToDisplay = useDaysToShowInCalendar(
		activeCalendarViewMonthAndYear.year,
		activeCalendarViewMonthAndYear.month
	);

	const dateNow = new Date();
	console.log(`dateNow: ${dateNow}`);

	// console.log(allDaysToDisplay);

	// const daysToDisplay = allDaysToDisplay;
	// currentDate.getMonth() === calendarViewDate.month
	// 	? allDaysToDisplay
	// 	: [];
	// const daysToDisplay = useDaysToShowInCalendar(currentDate);

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
		dispatch(setActiveCalendarMonthAndYear({ year, month }));
	};

	return (
		<>
			<div className={styles.calendar}>
				<div className={styles.weekdays}>
					<div>Пн</div>
					<div>Вт</div>
					<div>Ср</div>
					<div>Чт</div>
					<div>Пт</div>
					<div>Сб</div>
					<div>Нд</div>
				</div>
				<div className={styles.days}>
					{/* {daysToDisplay.map((day: any, index: any) => (
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
					))} */}

					{daysToDisplay.map((day: any, index: any) => {
						// Проверяем, является ли день сегодняшним
						const isToday =
							day.date.getFullYear() === dateNow.getFullYear() &&
							day.date.getMonth() === dateNow.getMonth() &&
							day.date.getDate() === dateNow.getDate();

						return (
							<div
								key={index}
								className={`${styles.day} ${
									day.isCurrentMonth
										? styles.currentMonth
										: styles.otherMonth
								} ${
									day.day === currentDate.getDate() &&
									day.date.getMonth() ===
										currentDate.getMonth()
										? styles.activeDay
										: ''
								} ${isToday ? styles.today : ''}`}
								onClick={() => handleDayClick(day.date)}
							>
								{day.day}
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default Calendar;
