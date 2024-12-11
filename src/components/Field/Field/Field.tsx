import React from 'react';
import DayOrWeekView from '../DayOrWeekView/DayOrWeekView';
import FieldFilter from '../FieldFilter/FieldFilter';

import styles from './Field.module.css';

const Field: React.FC = () => {
	return (
		<div className={styles.field}>
			<FieldFilter />
			<DayOrWeekView />
		</div>
	);
};

export default Field;
