import Calendar from '../../Calendar/Calendar/Calendar';
import styles from './Sidebar.module.css';
import CalendarList from '../../CalendarList/CalendarList';

import MonthFilter from '../../Calendar/MonthFilter/MonthFilter';

const Sidebar = () => {
	return (
		<aside className={styles.sidebar}>
			<MonthFilter />
			<Calendar />
			<CalendarList />
		</aside>
	);
};
export default Sidebar;
