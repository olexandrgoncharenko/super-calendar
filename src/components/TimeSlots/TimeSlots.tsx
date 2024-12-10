import styles from './TimeSlots.module.css';

const timeSlots = [
	'01:00',
	'02:00',
	'03:00',
	'04:00',
	'05:00',
	'06:00',
	'07:00',
	'08:00',
	'09:00',
	'10:00',
	'11:00',
	'12:00',
	'13:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
	'18:00',
	'19:00',
	'20:00',
	'21:00',
	'22:00',
	'23:00',
	'00:00',
];

export const TimeSlots: React.FC = () => {
	return (
		<div className={styles.timeslots}>
			{timeSlots.map((time) => {
				return (
					<div key={time} className={styles.timeslots__cell}>
						<span className={styles['timeslots__cell-text']}>
							{time}
						</span>
					</div>
				);
			})}
		</div>
	);
};
