import React from 'react';
import DayOrWeekView from '../DayOrWeekView/DayOrWeekView';
import FieldFilter from '../FieldFilter/FieldFilter';

const Field: React.FC = () => {
	return (
		<div>
			<FieldFilter />
			<DayOrWeekView />
		</div>
	);
};

export default Field;
