import styles from './FieldHeader.module.css';
import { CalendarEvent } from './../../types/CalendarEvent';
import FieldHeaderPresentation from '../FieldHeaderPresentation/FieldHeaderPresentation';

type FieldHeaderProps = {
	dates: string[];
	fullDayEvents: CalendarEvent[];
};

const FieldHeader: React.FC<FieldHeaderProps> = ({ dates, fullDayEvents }) => {
	const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Устанавливаем время в 00:00 для сравнения только даты

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className='timeColumn'></div>
				<div
					className={styles['header__weekdays']}
					style={{
						gridTemplateColumns: `repeat(${dates.length}, 1fr)`,
					}}
				>
					{dates.map((dateStr, index) => {
						const date = new Date(dateStr);

						date.setHours(0, 0, 0, 0); // Устанавливаем время в 00:00 для сравнения только даты
						const isToday = date.getTime() === today.getTime();
						const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7];
						const dayOfMonth = date.getDate();

						return (
							<div key={index} className={styles.day}>
								<div
									className={`${styles['day__inner']} ${
										isToday ? styles.today : ''
									}`}
								>
									<div className={styles['day__week']}>
										{dayOfWeek}
									</div>
									<div className={styles['day__date']}>
										{dayOfMonth}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			{fullDayEvents.length > 0 && (
				<FieldHeaderPresentation
					fullDayEvents={fullDayEvents}
					dates={dates}
				/>
			)}
		</div>
	);
};

export default FieldHeader;
