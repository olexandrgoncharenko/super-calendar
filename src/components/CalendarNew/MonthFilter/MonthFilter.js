import styles from './MonthFilter.module.css';
// import arrowPrev from './../../../assets/arrow-prev.svg';
// import arrowNext from './../../../assets/arrow-next.svg';

const MonthFilter = ({ dateNow, currentYear }) => {
	return (
		<div className={styles.month}>
			<h2 className={styles.month__title}>
				{dateNow.toLocaleString('default', { month: 'long' })}{' '}
				<span>{currentYear}</span>
			</h2>
			<div className={styles.month__actions}>
				<button
					className={styles['month__actions-btn']}
					// style={{ backgroundImage: `url('${arrowPrev}')` }}
					style={{ backgroundImage: 'url(/images/arrow-prev.svg)' }}
				>
					{' '}
				</button>
				<button
					className={styles['month__actions-btn']}
					style={{ backgroundImage: 'url(/images/arrow-next.svg)' }}
				></button>
			</div>
		</div>
	);
};

export default MonthFilter;
