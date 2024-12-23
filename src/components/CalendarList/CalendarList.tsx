import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	RootState,
	AppDispatch,
	toggleTaskList,
	toggleCalendarList,
	initializeSelectedTaskLists,
	initializeSelectedCalendarLists,
} from './../../store'; // Підключаємо типи
import { useAuth } from '../../context/useAuth';

// import { useFetchCalendarLists } from '../../hooks/useFetchCalendarLists';

const CalendarList = () => {
	const { isSignedIn, userTaskLists, userCalendarLists } = useAuth(); // Беремо дані з контексту

	// console.log(`userCalendarLists: ${JSON.stringify(userCalendarLists)}`);

	const selectedTaskLists = useSelector(
		(state: RootState) => state.selectedTaskLists
	); // Вибрані списки з Redux

	const selectedCalendarLists = useSelector(
		(state: RootState) => state.selectedCalendarLists
	);

	// console.log(`selectedCalendarLists CL: ${selectedCalendarLists}`);

	const dispatch = useDispatch<AppDispatch>(); // Диспетчер для Redux

	useEffect(() => {
		if (isSignedIn && userTaskLists.length > 0) {
			const initialSelectedLists = userTaskLists.map(
				(list: any) => list.id
			);
			dispatch(initializeSelectedTaskLists(initialSelectedLists));
		}
	}, [isSignedIn, userTaskLists, dispatch]);

	useEffect(() => {
		if (isSignedIn && userCalendarLists.length > 0) {
			const initialSelectedLists = userCalendarLists.map(
				(list: any) => list.id
			);
			dispatch(initializeSelectedCalendarLists(initialSelectedLists));
		}
	}, [isSignedIn, userCalendarLists, dispatch]);

	const handleToggleTaskList = (listId: string) => {
		dispatch(toggleTaskList(listId)); // Додаємо або прибираємо список з вибраних
	};

	const handleToggleCalendarList = (listId: string) => {
		dispatch(toggleCalendarList(listId)); // Додаємо або прибираємо список з вибраних
	};

	let tasklistsToShow;

	if (isSignedIn && userTaskLists.length > 0) {
		tasklistsToShow = userTaskLists.map((list: any) => (
			<div key={list.id}>
				<input
					id={list.id}
					type='checkbox'
					checked={selectedTaskLists.includes(list.id)}
					onChange={() => handleToggleTaskList(list.id)}
				/>
				<label style={{ color: 'white' }} htmlFor={list.id}>
					{list.title}
				</label>
			</div>
		));
	}

	let calendarListsToShow;

	if (isSignedIn && userCalendarLists.length > 0) {
		calendarListsToShow = userCalendarLists.map((list: any) => (
			<div
				key={list.id}
				style={{
					backgroundColor: list.color || 'transparent', // Использовать 'transparent', если цвет не задан
				}}
			>
				<input
					id={list.id}
					type='checkbox'
					checked={selectedCalendarLists.includes(list.id)}
					onChange={() => handleToggleCalendarList(list.id)}
				/>
				<label style={{ color: 'white' }} htmlFor={list.id}>
					{list.title}
				</label>
			</div>
		));
	}

	return (
		<div>
			<h2 style={{ color: 'white' }}>Списки задач:</h2>
			{tasklistsToShow}
			<h2 style={{ color: 'white' }}>Списки календарей:</h2>
			{calendarListsToShow}
		</div>
	);
};

export default CalendarList;
