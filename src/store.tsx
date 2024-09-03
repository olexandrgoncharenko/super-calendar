import { configureStore } from '@reduxjs/toolkit';

export type ViewType = 'day' | 'week' | 'month' | 'year';

type State = {
	currentDate: string;
	view: ViewType;
};
type SetCurrentDate = {
	type: 'SET_CURRENT_DATE';
	payload: string;
};

type SetView = {
	type: 'SET_VIEW';
	payload: ViewType;
};

type Action = SetCurrentDate | SetView;

let initialCurrentDate = new Date();
// initialCurrentDate.setUTCHours(0, 0, 0, 0);
initialCurrentDate.setUTCHours(0, 0, 0, 0);

// console.log(`initialCurrentDate: ${initialCurrentDate}`);
const finalInitialDate = initialCurrentDate.toISOString();

// console.log(`finalInitialDate: ${finalInitialDate}`);

const initialState: State = {
	currentDate: finalInitialDate,
	view: 'week',
};

// export const setCurrentDate = (date: Date) => ({
// 	type: 'SET_CURRENT_DATE',
// 	payload: date.toISOString(),
// });
export const setCurrentDate = (date: string) => ({
	type: 'SET_CURRENT_DATE',
	payload: date,
});

export const setView = (view: ViewType) => ({
	type: 'SET_VIEW',
	payload: view,
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
		default:
			return state;
	}
};

export const store = configureStore({
	reducer: reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
