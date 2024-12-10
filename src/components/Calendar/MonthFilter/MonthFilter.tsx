import { useSelector, useDispatch } from 'react-redux';
import { RootState, setActiveCalendarMonthAndYear } from '../../../store';
import styles from './MonthFilter.module.css';

const MonthFilter = () => {
	const dispatch = useDispatch();
	const { year, month } = useSelector(
		(state: RootState) => state.activeCalendarViewMonthAndYear
	);

	const handleNextMonth = () => {
		const newMonth = month + 1;
		if (newMonth > 11) {
			dispatch(
				setActiveCalendarMonthAndYear({ year: year + 1, month: 0 })
			);
		} else {
			dispatch(setActiveCalendarMonthAndYear({ year, month: newMonth }));
		}
	};

	const handlePreviousMonth = () => {
		const newMonth = month - 1;
		if (newMonth < 0) {
			dispatch(
				setActiveCalendarMonthAndYear({ year: year - 1, month: 11 })
			);
		} else {
			dispatch(setActiveCalendarMonthAndYear({ year, month: newMonth }));
		}
	};

	return (
		<div className={styles.month}>
			<h2 className={styles.month__title}>
				{new Date(year, month).toLocaleString('default', {
					month: 'long',
				})}{' '}
				<span>{year}</span>
			</h2>
			<div className={styles.month__actions}>
				<button
					className={styles['month__actions-btn']}
					// style={{ backgroundImage: 'url(/images/arrow-prev.svg)' }}
					onClick={handlePreviousMonth}
				>
					<svg
						width='14'
						height='22'
						viewBox='0 0 7.19949 11.985'
						fill='none'
					>
						<desc>Created with Pixso.</desc>
						<defs />
						<path
							id='Vector'
							d='M6.84 0.35C7.07 0.57 7.19 0.88 7.19 1.19C7.19 1.51 7.07 1.82 6.84 2.04L2.89 5.99L6.84 9.95C7.06 10.17 7.18 10.48 7.18 10.79C7.18 11.11 7.05 11.41 6.83 11.63C6.61 11.85 6.31 11.98 5.99 11.98C5.68 11.98 5.37 11.86 5.15 11.64L0.35 6.84C0.12 6.62 0 6.31 0 5.99C0 5.68 0.12 5.37 0.35 5.15L5.15 0.35C5.37 0.12 5.68 0 5.99 0C6.31 0 6.62 0.12 6.84 0.35Z'
							fill='#FFFFFF'
							fill-opacity='1.000000'
							fill-rule='evenodd'
						/>
					</svg>
				</button>
				<button
					className={styles['month__actions-btn']}
					// style={{ backgroundImage: 'url(/images/arrow-next.svg)' }}
					onClick={handleNextMonth}
				>
					<svg
						width='14'
						height='22'
						viewBox='0 0 7.19949 11.985'
						fill='none'
					>
						<desc>Created with Pixso.</desc>
						<defs />
						<path
							id='Vector'
							d='M0.35 11.63C0.12 11.4 0 11.1 0 10.78C0 10.46 0.12 10.16 0.35 9.93L4.3 5.98L0.35 2.03C0.13 1.8 0.01 1.5 0.01 1.18C0.01 0.87 0.14 0.57 0.36 0.35C0.58 0.12 0.88 0 1.2 3.05e-5C1.51 -0.01 1.82 0.11 2.04 0.33L6.84 5.13C7.07 5.36 7.19 5.66 7.19 5.98C7.19 6.3 7.07 6.6 6.84 6.83L2.04 11.63C1.82 11.85 1.51 11.98 1.19 11.98C0.88 11.98 0.57 11.85 0.35 11.63Z'
							fill='#FFFFFF'
							fill-opacity='1.000000'
							fill-rule='evenodd'
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default MonthFilter;
