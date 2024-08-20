import { useSelector, useDispatch } from 'react-redux';
import styles from './FieldFilter.module.css';
import FilterButton from '../../UI/FilterButton/FilterButton';
import { RootState } from '../../../store';
import { setView, ViewType } from '../../../store';

const FieldFilter: React.FC = () => {
	const currentView = useSelector((state: RootState) => state.view);
	console.log(`current view: ${currentView}`);
	const dispatch = useDispatch();

	const handleClick = (view: ViewType) => {
		dispatch(setView(view));
	};

	return (
		<div className={styles.filter}>
			<FilterButton
				onClick={() => handleClick('day')}
				isActive={currentView === 'day'}
			>
				День
			</FilterButton>
			<FilterButton
				onClick={() => handleClick('week')}
				isActive={currentView === 'week'}
			>
				Неделя
			</FilterButton>
			<FilterButton
				onClick={() => handleClick('month')}
				isActive={currentView === 'month'}
			>
				Месяц
			</FilterButton>
			<FilterButton
				onClick={() => handleClick('year')}
				isActive={currentView === 'year'}
			>
				Год
			</FilterButton>
		</div>
	);
};

export default FieldFilter;
