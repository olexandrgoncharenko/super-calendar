// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/useAuth';
// import ApiCalendar from 'react-google-calendar-api';

// import { gapi } from 'gapi-script';

// interface Task {
// 	id: string;
// 	title: string;
// 	// kind: string;
// 	// notes?: string;
// 	// status?: 'needsAction' | 'completed';
// 	// due?: string;
// 	// updated?: string;
// 	// completed?: string;
// 	// position?: string;
// 	// parent?: string;
// 	// links?: Array<{
// 	// 	type: string;
// 	// 	description: string;
// 	// 	link: string;
// 	// }>;
// }

// export interface TaskListWithTasks {
// 	id: string;
// 	title: string;
// 	kind: string;
// 	tasks: Task[];
// }

// // interface Task {
// // 	id: string;
// // 	title: string;
// // 	kind: string;
// // 	// notes?: string;
// // 	// status?: 'needsAction' | 'completed';
// // 	// due?: string;
// // 	// updated?: string;
// // 	// completed?: string;
// // 	// position?: string;
// // 	// parent?: string;
// // 	// links?: Array<{
// // 	// 	type: string;
// // 	// 	description: string;
// // 	// 	link: string;
// // 	// }>;
// // }
// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const API_KEY = process.env.REACT_APP_API_KEY;
// // const DISCOVERY_DOCS = [
// // 	'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
// // 	'https://people.googleapis.com/$discovery/rest',
// // 	'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
// // ];
// // const SCOPES = process.env.REACT_APP_SCOPES;

// if (!CLIENT_ID || !API_KEY) {
// 	throw new Error(
// 		'Google API credentials are not set properly in the environment variables.'
// 	);
// }

// export const useFetchCalendarLists = () => {
// 	const [userTasklists, setUserTasklists] = useState<UnifiedListItem[]>([]);
// 	const [error, setError] = useState<string | null>(null);
// 	// --- //
// 	const [loading, setLoading] = useState<boolean | null>(null);
// 	const [allTasks, setAllTasks] = useState<TaskListWithTasks[]>([]);

// 	// const [gapiClientInited, setGapiClientInited] = useState<boolean>(false);

// 	console.log(allTasks);

// 	const { isSignedIn, gapiClientInited } = useAuth();

// 	console.log(`gapiClientInited: ${gapiClientInited}`);

// 	useEffect(() => {
// 		console.log(gapiClientInited);
// 	}, [gapiClientInited]);

// 	// const initGapiClient = async () => {
// 	// 	try {
// 	// 		await new Promise<void>((resolve, reject) => {
// 	// 			gapi.load('client:auth2', {
// 	// 				callback: resolve,
// 	// 				onerror: reject,
// 	// 			});
// 	// 		});
// 	// 		await gapi.client.init({
// 	// 			apiKey: API_KEY,
// 	// 			clientId: CLIENT_ID,
// 	// 			scope: 'https://www.googleapis.com/auth/calendar',
// 	// 			discoveryDocs: [
// 	// 				'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
// 	// 			],
// 	// 		});
// 	// 		setGapiClientInited(true);
// 	// 		console.log('GAPI client initialized.');
// 	// 	} catch (error) {
// 	// 		console.error('Error initializing GAPI client:', error);
// 	// 		setError('Failed to initialize GAPI client.');
// 	// 	}
// 	// };

// 	// useEffect(() => {
// 	// 	if (isSignedIn) {
// 	// 		initGapiClient();
// 	// 	}
// 	// }, [isSignedIn]);

// 	// const loadGapi = async () => {
// 	// 	return new Promise((resolve, reject) => {
// 	// 		window.gapi.load('client:auth2', {
// 	// 			callback: resolve,
// 	// 			onerror: reject,
// 	// 		});
// 	// 	});
// 	// };

// 	// const initGapiClient = async () => {
// 	// 	try {
// 	// 		await loadGapi();
// 	// 		await window.gapi.client.init({
// 	// 			apiKey: API_KEY,
// 	// 			clientId: CLIENT_ID,
// 	// 			scope: 'https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/calendar',
// 	// 			discoveryDocs: [
// 	// 				'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
// 	// 				'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
// 	// 			],
// 	// 		});
// 	// 		console.log('GAPI client initialized.');
// 	// 	} catch (error) {
// 	// 		console.error('Error initializing GAPI client:', error);
// 	// 	}
// 	// };

// 	// useEffect(() => {
// 	// 	if (isSignedIn) {
// 	// 		const initializeAndFetch = async () => {
// 	// 			await initGapiClient();
// 	// 			// fetchCalendarLists();
// 	// 			// fetchTaskLists();
// 	// 		};
// 	// 		initializeAndFetch();
// 	// 	}
// 	// }, [isSignedIn]);

// 	// //

// 	//

// 	// useEffect(() => {
// 	// 	// if (isSignedIn && gapiClientInited) {
// 	// 	fetchTaskLists();
// 	// 	// }
// 	// }, [isSignedIn, gapiClientInited]);

// 	// useEffect(() => {
// 	// 	const fetchLists = async () => {
// 	// 		if (gapiClientInited) {
// 	// 			setLoading(true);
// 	// 			try {
// 	// 				const response = await (
// 	// 					gapi.client as any
// 	// 				).calendar.calendarList.list();
// 	// 				setUserTasklists(response.result.items || []);
// 	// 			} catch (error) {
// 	// 				console.error('Error fetching calendar lists:', error);
// 	// 				setError('Failed to fetch calendar lists.');
// 	// 			} finally {
// 	// 				setLoading(false);
// 	// 			}
// 	// 		}
// 	// 	};
// 	// 	fetchLists();
// 	// }, [gapiClientInited]);

// 	return { userTasklists, error, loading };
// };

// const config = {
// 	clientId: CLIENT_ID,
// 	apiKey: API_KEY,
// 	scope: 'https://www.googleapis.com/auth/calendar',
// 	discoveryDocs: [
// 		'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
// 	],
// };

// const apiCalendar = new ApiCalendar(config);

// // const fetchCalendarLists = async () => {
// // 	try {
// // 		const response = await apiCalendar.listCalendars();
// // 		// console.log(response);

// // 		if (response.result.items && response.result.items.length > 0) {
// // 			// console.log(response);
// // 			const newTaskLists: UnifiedListItem[] =
// // 				response.result.items.map((item: UnifiedListItem) => ({
// // 					kind: item.kind,
// // 					id: item.id,
// // 					title: item.summary,
// // 				}));
// // 			setUserTasklists((prevTasklists) => [
// // 				...prevTasklists,
// // 				...newTaskLists,
// // 			]);
// // 		}
// // 	} catch (error) {
// // 		console.error('Error fetching calendar lists:', error);
// // 	}
// // };
// // useEffect(() => {
// // 	if (isSignedIn) {
// // 		// fetchCalendarLists();
// // 		fetchTaskLists();
// // 	}
// // }, [isSignedIn]);

// // useEffect(() => {
// // 	const fetchLists = async () => {
// // 		await fetchTaskLists();
// // 		// await fetchCalendarLists();
// // 		// setLoading(false);
// // 	};
// // 	fetchLists();
// // }, [isSignedIn, gapiClientInited]);

// // const fetchTasksForAllLists = async () => {
// // 	setLoading(true);
// // 	setError(null);
// // 	const taskListWithTasks: TaskListWithTasks[] = [];

// // 	try {
// // 		for (const taskList of userTasklists) {
// // 			const response = await (gapi.client.tasks as any).tasks.list({
// // 				tasklist: taskList.id,
// // 			});

// // 			if (response.result.items) {
// // 				taskListWithTasks.push({
// // 					//https://developers.google.com/tasks/reference/rest/v1/tasks?hl=ru+
// // 					id: taskList.id,
// // 					title: taskList.title,
// // 					kind: taskList.kind,
// // 					tasks: response.result.items.map((item: any) => ({
// // 						id: item.id,
// // 						title: item.title,
// // 						// notes: item.notes,
// // 						// status: item.status,
// // 						// due: item.due,
// // 						// updated: item.updated,
// // 						// completed: item.completed,
// // 						// position: item.position,
// // 						// parent: item.parent,
// // 						// links: item.links,
// // 					})),
// // 				});
// // 			} else {
// // 				taskListWithTasks.push({
// // 					id: taskList.id,
// // 					title: taskList.title,
// // 					kind: taskList.kind,
// // 					tasks: [],
// // 				});
// // 			}
// // 		}
// // 		setAllTasks(taskListWithTasks);
// // 	} catch (err: any) {
// // 		console.error('Error fetching tasks for all lists:', err);
// // 		setError('Failed to load tasks. Please try again later.');
// // 	} finally {
// // 		setLoading(false);
// // 	}
// // };
// // const fetchTasksForAllLists = async () => {
// // 	setLoading(true);
// // 	setError(null);
// // 	const taskListWithTasks: TaskListWithTasks[] = [];

// // 	try {
// // 		for (const taskList of userTasklists) {
// // 			if (taskList.kind === 'tasks#taskList') {
// // 				// Запрос к Tasks API, если это taskList
// // 				const response = await (
// // 					gapi.client.tasks as any
// // 				).tasks.list({
// // 					tasklist: taskList.id,
// // 				});

// // 				if (response && response.result && response.result.items) {
// // 					taskListWithTasks.push({
// // 						id: taskList.id,
// // 						title: taskList.title,
// // 						kind: taskList.kind,
// // 						tasks: response.result.items.map((item: any) => ({
// // 							id: item.id,
// // 							title: item.title,
// // 						})),
// // 					});
// // 				} else {
// // 					taskListWithTasks.push({
// // 						id: taskList.id,
// // 						title: taskList.title,
// // 						kind: taskList.kind,
// // 						tasks: [],
// // 					});
// // 				}
// // 			} else if (taskList.kind === 'calendar#calendarListEntry') {
// // 				const response = await apiCalendar.listEvents(
// // 					{},
// // 					taskList.id
// // 				);

// // 				if (response && response.result && response.result.items) {
// // 					taskListWithTasks.push({
// // 						id: taskList.id,
// // 						title: taskList.title,
// // 						kind: taskList.kind,
// // 						tasks: response.result.items.map((item: any) => ({
// // 							id: item.id,
// // 							title: item.title,
// // 						})),
// // 					});
// // 				} else {
// // 					taskListWithTasks.push({
// // 						id: taskList.id,
// // 						title: taskList.title,
// // 						kind: taskList.kind,
// // 						tasks: [],
// // 					});
// // 				}
// // 				// Запрос к Calendar API, если это calendarList
// // 				// await fetchCalendarDetails(taskList.id); // вызов функции для обработки календарей
// // 				// console.log('fetch for calendars');
// // 			}
// // 		}
// // 		setAllTasks(taskListWithTasks);
// // 	} catch (err: any) {
// // 		console.error('Error fetching tasks or calendar details:', err);
// // 		setError('Failed to load data. Please try again later.');
// // 	} finally {
// // 		setLoading(false);
// // 	}
// // };

// // Функция для работы с календарями
// // const fetchCalendarDetails = async (calendarId: string) => {
// // 	console.log(`fetch calendar`);

// // 	const response = await apiCalendar.listEvents({}, calendarId);
// // 	console.log(response);
// // 	// try {
// // 	// 	const response = await gapi.client.calendar.calendars.get({
// // 	// 		calendarId,
// // 	// 	});
// // 	// 	console.log('Calendar details:', response);
// // 	// 	// Обработайте данные календаря здесь
// // 	// } catch (error) {
// // 	// 	console.error('Error fetching calendar details:', error);
// // 	// 	setError('Failed to load calendar details.');
// // 	// }
// // };

// // useEffect(() => {
// // 	fetchTasksForAllLists();
// // }, [isSignedIn, , userTasklists]);

// // 	return { userTasklists, error };
// // };
