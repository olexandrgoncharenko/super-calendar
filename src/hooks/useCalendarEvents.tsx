import { useEffect, useState } from 'react';
import ApiCalendar from 'react-google-calendar-api';
import { useAuth } from '../context/useAuth';
// import { google } from 'googleapis';

const config = {
	clientId:
		'710183932569-jg572k9e26fgcvhgr7hi62lu8rfu65ct.apps.googleusercontent.com',
	apiKey: 'AIzaSyCSLPpvAP79PnbiQHzc7dv_G0DUOKh4UZA',
	scope: 'https://www.googleapis.com/auth/calendar',
	discoveryDocs: [
		'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
	],
};

const apiCalendar = new ApiCalendar(config);

interface Event {
	id: string;
	summary: string;
	start: { dateTime?: string; date?: string };
	end: { dateTime?: string; date?: string };
	[key: string]: any;
}

export const useCalendarEvents = (start: string, end: string) => {
	const { isSignedIn } = useAuth();
	const [events, setEvents] = useState<Event[]>([]);

	// console.log(isSignedIn);

	if (isSignedIn) {
		try {
			apiCalendar.listCalendars().then(({ result }: any) => {
				console.log(result);
			});
		} catch (err: any) {
			// console.error('Помилка завантаження подій:', err);
			// setError('Не вдалося завантажити події. Спробуйте пізніше.');
		}
	}

	// const [loading, setLoading] = useState<boolean>(false);
	// const [error, setError] = useState<string | null>(null);

	// const fetchEvents = async () => {
	// 	setLoading(true);
	// 	setError(null);

	// 	try {
	// 		console.log(
	// 			'Starting fetchEvents with start:',
	// 			start,
	// 			'and end:',
	// 			end
	// 		);

	// 		const timeMin = new Date(start).toISOString();
	// 		const timeMax = new Date(end).toISOString();

	// 		console.log('Formatted timeMin:', timeMin);
	// 		console.log('Formatted timeMax:', timeMax);

	// 		const response = await apiCalendar.listEvents({
	// 			timeMin,
	// 			timeMax,
	// 			showDeleted: false,
	// 			singleEvents: true,
	// 			orderBy: 'startTime',
	// 		});

	// 		console.log('API response:', response);

	// 		if (response?.result?.items) {
	// 			console.log(
	// 				'Events fetched successfully:',
	// 				response.result.items
	// 			);
	// 			setEvents(response.result.items as Event[]);
	// 		} else {
	// 			console.warn('No events found in the response');
	// 			throw new Error('Не вдалося отримати події з Google Calendar.');
	// 		}
	// 	} catch (err: any) {
	// 		console.error('Помилка завантаження подій:', err);
	// 		setError('Не вдалося завантажити події. Спробуйте пізніше.');
	// 	} finally {
	// 		setLoading(false);
	// 		console.log('fetchEvents completed');
	// 	}
	// };

	// const listCalendars = async () => {
	// 	try {
	// 		const calendarList = await apiCalendar.listCalendars();
	// 		console.log('Available calendars:', calendarList);
	// 	} catch (err) {
	// 		console.error('Error fetching calendar list:', err);
	// 	}
	// };

	// Виклик listCalendars та fetchEvents після підтвердження авторизації
	// useEffect(() => {
	// 	if (isSignedIn) {
	// 		console.log('User is signed in, proceeding to fetch events');
	// 		// listCalendars(); // Викликається для перевірки наявних календарів
	// 		fetchEvents(); // Викликається для отримання подій
	// 	} else {
	// 		console.log('User is not signed in, skipping fetchEvents');
	// 	}
	// }, [isSignedIn]);

	return {
		events,
		// , loading, error
	};
};

// const tasks = google.tasks('v1');

// export const useTasks = (tasklistId: string) => {
// 	const { isSignedIn } = useAuth();
// 	// const { auth } = useAuth(); // Предполагаем, что у вас есть объект auth для авторизации
// 	const [tasksList, setTasksList] = useState<any[]>([]);
// 	const [loading, setLoading] = useState<boolean>(false);
// 	const [error, setError] = useState<string | null>(null);

// 	console.log(tasksList);

// 	const fetchTasks = async () => {
// 		setLoading(true);
// 		setError(null);

// 		try {
// 			// const authClient = await auth.getClient();
// 			const tasksResponse = await tasks.tasks.list({
// 				// auth: authClient,
// 				tasklist: tasklistId,
// 			});

// 			if (tasksResponse.data.items) {
// 				setTasksList(tasksResponse.data.items);
// 			} else {
// 				throw new Error('No tasks found');
// 			}
// 		} catch (err: any) {
// 			console.error('Error fetching tasks:', err);
// 			setError('Failed to load tasks. Please try again later.');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	if (isSignedIn) {
// 		fetchTasks();
// 	}

// 	// useEffect(() => {
// 	// 	if (auth.isSignedIn) {
// 	// 		fetchTasks();
// 	// 	}
// 	// }, [auth.isSignedIn, tasklistId]);

// 	return { tasksList, loading, error };
// };

// import { useEffect, useState } from 'react';
// import ApiCalendar from 'react-google-calendar-api';
// import { useAuth } from '../context/useAuth';

// const config = {
// 	clientId:
// 		'710183932569-jg572k9e26fgcvhgr7hi62lu8rfu65ct.apps.googleusercontent.com',
// 	apiKey: 'AIzaSyCSLPpvAP79PnbiQHzc7dv_G0DUOKh4UZA',
// 	scope: 'https://www.googleapis.com/auth/calendar',
// 	discoveryDocs: [
// 		'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
// 	],
// };

// const apiCalendar = new ApiCalendar(config);

// interface Event {
// 	id: string;
// 	summary: string;
// 	start: { dateTime?: string; date?: string };
// 	end: { dateTime?: string; date?: string };
// 	[key: string]: any;
// }

// export const useCalendarEvents = (start: string, end: string) => {
// 	const { isSignedIn } = useAuth();
// 	const [events, setEvents] = useState<Event[]>([]);
// 	const [loading, setLoading] = useState<boolean>(false);
// 	const [error, setError] = useState<string | null>(null);

// 	const fetchEvents = async () => {
// 		setLoading(true);
// 		setError(null);

// 		try {
// 			console.log(
// 				'Starting fetchEvents with start:',
// 				start,
// 				'and end:',
// 				end
// 			);

// 			const timeMin = new Date(start).toISOString();
// 			const timeMax = new Date(end).toISOString();

// 			console.log('Formatted timeMin:', timeMin);
// 			console.log('Formatted timeMax:', timeMax);

// 			const response = await apiCalendar.listEvents({
// 				timeMin,
// 				timeMax,
// 				showDeleted: false,
// 				singleEvents: true,
// 				orderBy: 'startTime',
// 			});

// 			console.log('API response:', response);

// 			if (response?.result?.items) {
// 				console.log(
// 					'Events fetched successfully:',
// 					response.result.items
// 				);
// 				setEvents(response.result.items as Event[]);
// 			} else {
// 				console.warn('No events found in the response');
// 				throw new Error('Не вдалося отримати події з Google Calendar.');
// 			}
// 		} catch (err: any) {
// 			console.error('Помилка завантаження подій:', err);
// 			setError('Не вдалося завантажити події. Спробуйте пізніше.');
// 		} finally {
// 			setLoading(false);
// 			console.log('fetchEvents completed');
// 		}
// 	};

// 	// const listCalendars = async () => {
// 	// 	try {
// 	// 		const calendarList = await apiCalendar.listCalendars();
// 	// 		console.log('Available calendars:', calendarList);
// 	// 	} catch (err) {
// 	// 		console.error('Error fetching calendar list:', err);
// 	// 	}
// 	// };

// 	// Виклик listCalendars та fetchEvents після підтвердження авторизації
// 	useEffect(() => {
// 		if (isSignedIn) {
// 			console.log('User is signed in, proceeding to fetch events');
// 			// listCalendars(); // Викликається для перевірки наявних календарів
// 			fetchEvents(); // Викликається для отримання подій
// 		} else {
// 			console.log('User is not signed in, skipping fetchEvents');
// 		}
// 	}, [isSignedIn]);

// 	return { events, loading, error };
// };
