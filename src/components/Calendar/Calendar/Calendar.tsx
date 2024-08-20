import styles from './Calendar.module.css';
import { useDaysToShowInCalendar } from '../../../hooks/useDaysToShowInCalendar';
// import MonthFilter from '../MonthFilter/MonthFilter';

import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDate } from './../../../store';
import { RootState } from '../../../store';

const Calendar = () => {
	const dispatch = useDispatch();
	const currentDate = new Date(
		useSelector((state: RootState) => state.currentDate)
	);
	// console.log(`currend date in calendar component: ${currentDate}`);
	const daysToDisplay = useDaysToShowInCalendar(currentDate);
	// console.log(daysToDisplay);
	const handleDayClick = (day: Date) => {
		dispatch(setCurrentDate(day));
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
