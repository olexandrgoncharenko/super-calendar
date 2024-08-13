import Calendar from '../../../Calendar/Calendar/Calendar';
import styles from './Sidebar.module.css';

const Sidebar = (props) => {
    return (
        <aside className={styles.sidebar}>
            <Calendar />
        </aside>
    );
};

export default Sidebar;
