import React, { useEffect, useState } from 'react';
import styles from './DayOrWeekView.module.css';
// import { ViewType } from '../../../store';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { getDatesForWeek } from './../../../utils/getDatesForWeek';

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
	const [datesForDisplay, setDatesForDisplay] = useState<string[]>([]);

	useEffect(() => {
		if (view === 'day') {
			setDatesForDisplay([currentDate]);
		} else if (view === 'week') {
			const dates = getDatesForWeek(currentDate);
			setDatesForDisplay(dates);
		}
	}, [view, currentDate]);

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
							'Пн',
							'Вт',
							'Ср',
							'Чт',
							'Пт',
							'Сб',
							'Вс',
						];
						const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7]; // Чтобы начать неделю с понедельника
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
