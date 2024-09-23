import Calendar from '../../Calendar/Calendar/Calendar';
import styles from './Sidebar.module.css';
import CalendarList from '../../CalendarList/CalendarList';

const Sidebar = () => {
	return (
		<aside className={styles.sidebar}>
			<Calendar />
			<CalendarList />
		</aside>
	);
};
export default Sidebar;
