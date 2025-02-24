import React from 'react';
import DayOrWeekView from '../DayOrWeekView/DayOrWeekView';
import FieldFilter from '../FieldFilter/FieldFilter';
import MonthView from '../MonthView/MonthViev';

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

import styles from './Field.module.css';

const Field: React.FC = () => {
	const view = useSelector((state: RootState) => state.view);
	// console.log(`view: ${view}`);

	return (
		<div className={styles.field}>
			<FieldFilter />
			{(view === 'day' || view === 'week') && <DayOrWeekView />}
			{view === 'month' && <MonthView />}

			{/* <DayOrWeekView /> */}
		</div>
	);
};

export default Field;
