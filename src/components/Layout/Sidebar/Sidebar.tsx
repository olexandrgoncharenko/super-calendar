// import Calendar from './../../Calendar/Calendar/Calendar';
import CalendarNew from '../../CalendarNew/CalendarNew/CalendarNew';
import styles from './Sidebar.module.css';

const Sidebar = () => {
	// const Sidebar = (props) => {
	return <aside className={styles.sidebar}>{<CalendarNew />}</aside>;
};

export default Sidebar;
