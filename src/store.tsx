import { configureStore } from '@reduxjs/toolkit';

export type ViewType = 'day' | 'week' | 'month' | 'year';

type ActiveCalendarMonthAndYear = {
	year: number;
	month: number;
};

type State = {
	currentDate: string;
	view: ViewType;
	selectedTaskLists: string[];
	selectedCalendarLists: string[];
	activeCalendarViewMonthAndYear: ActiveCalendarMonthAndYear; // Отображаемый месяц и год
	staticCalendarColors: Record<string, string>;
};
type SetCurrentDate = {
	type: 'SET_CURRENT_DATE';
	payload: string;
};

type SetView = {
	type: 'SET_VIEW';
	payload: ViewType;
};

type ToggleTaskList = {
	type: 'TOGGLE_TASK_LIST';
	payload: string;
};

type ToggleCalendarList = {
	type: 'TOGGLE_CALENDAR_LIST';
	payload: string;
};

type InitializeSelectedTaskLists = {
	type: 'INITIALIZE_SELECTED_TASK_LISTS';
	payload: string[];
};
type InitializeSelectedCalendarLists = {
	type: 'INITIALIZE_SELECTED_CALENDAR_LISTS';
	payload: string[];
};

type SetActiveCalendarMonthAndYear = {
	type: 'SET_ACTIVE_CALENDAR_MONTH_AND_YEAR';
	payload: ActiveCalendarMonthAndYear;
};

type Action =
	| SetCurrentDate
	| SetView
	| ToggleTaskList
	| ToggleCalendarList
	| InitializeSelectedTaskLists
	| InitializeSelectedCalendarLists
	| SetActiveCalendarMonthAndYear;

let initialCurrentDate = new Date();
initialCurrentDate.setUTCHours(0, 0, 0, 0);
const finalInitialDate = initialCurrentDate.toISOString();

const initialState: State = {
	currentDate: finalInitialDate,
	view: 'week',
	selectedTaskLists: [],
	selectedCalendarLists: [],
	activeCalendarViewMonthAndYear: {
		year: new Date().getFullYear(),
		month: new Date().getMonth(),
	},
	staticCalendarColors: {
		'1': '#ac725e',
		'2': '#d06b64',
		'3': '#f83a22',
		'4': '#fa573c',
		'5': '#ff7537',
		'6': '#ffad46',
		'7': '#42d692',
		'8': '#16a765',
		'9': '#7bd148',
		'10': '#b3dc6c',
		'11': '#fbe983',
		'12': '#fad165',
		'13': '#92e1c0',
		'14': '#9fe1e7',
		'15': '#9fc6e7',
		'16': '#4986e7',
		'17': '#9a9cff',
		'18': '#b99aff',
		'19': '#c2c2c2',
		'20': '#cabdbf',
		'21': '#cca6ac',
		'22': '#f691b2',
		'23': '#cd74e6',
		'24': '#a47ae2',
	},
};

export const setCurrentDate = (date: string) => ({
	type: 'SET_CURRENT_DATE',
	payload: date,
});

export const setView = (view: ViewType) => ({
	type: 'SET_VIEW',
	payload: view,
});

export const initializeSelectedTaskLists = (taskLists: string[]) => ({
	type: 'INITIALIZE_SELECTED_TASK_LISTS',
	payload: taskLists,
});

export const initializeSelectedCalendarLists = (calendarLists: string[]) => ({
	type: 'INITIALIZE_SELECTED_CALENDAR_LISTS',
	payload: calendarLists,
});

export const toggleTaskList = (taskListId: string) => ({
	type: 'TOGGLE_TASK_LIST',
	payload: taskListId,
});

export const toggleCalendarList = (calendarListId: string) => ({
	type: 'TOGGLE_CALENDAR_LIST',
	payload: calendarListId,
});

export const setActiveCalendarMonthAndYear = (
	date: ActiveCalendarMonthAndYear
) => ({
	type: 'SET_ACTIVE_CALENDAR_MONTH_AND_YEAR',
	payload: date,
});

const reducer = (state = initialState, action: Action): State => {
	switch (action.type) {
		case 'SET_CURRENT_DATE':
			return {
				...state,
				currentDate: action.payload,
			};
		case 'SET_VIEW':
			return {
				...state,
				view: action.payload,
			};
		case 'TOGGLE_TASK_LIST':
			return {
				...state,
				selectedTaskLists: state.selectedTaskLists.includes(
					action.payload
				)
					? state.selectedTaskLists.filter(
							(id) => id !== action.payload
					  )
					: [...state.selectedTaskLists, action.payload],
			};

		case 'TOGGLE_CALENDAR_LIST':
			return {
				...state,
				selectedCalendarLists: state.selectedCalendarLists.includes(
					action.payload
				)
					? state.selectedCalendarLists.filter(
							(id) => id !== action.payload
					  )
					: [...state.selectedCalendarLists, action.payload],
			};

		case 'INITIALIZE_SELECTED_TASK_LISTS':
			return {
				...state,
				selectedTaskLists: action.payload,
			};

		case 'INITIALIZE_SELECTED_CALENDAR_LISTS':
			return {
				...state,
				selectedCalendarLists: action.payload,
			};

		case 'SET_ACTIVE_CALENDAR_MONTH_AND_YEAR':
			return { ...state, activeCalendarViewMonthAndYear: action.payload };
		default:
			return state;
	}
};

export const store = configureStore({
	reducer: reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
