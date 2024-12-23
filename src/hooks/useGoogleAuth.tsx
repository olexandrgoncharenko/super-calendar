import { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import ApiCalendar from 'react-google-calendar-api';

import { DateTime } from 'luxon';

import { formatEventToLocalTime } from '../utils/formatEventToLocalTime';
import { FetchedEvent } from '../types/FetchedEvent';
import { CalendarEvent } from './../types/CalendarEvent';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const DISCOVERY_DOCS = [
	'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
	'https://people.googleapis.com/$discovery/rest',
	'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
];
const SCOPES = process.env.REACT_APP_SCOPES;

const staticCalendarColors: Record<string, string> = {
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
};

export interface UnifiedListItem {
	// kind: string; // "kind": "tasks#taskList",
	id: string;
	title?: string;
	summary?: string;
}

interface Task {
	id: string;
	title: string;
	// kind: string;
	// notes?: string;
	status?: 'needsAction' | 'completed';
	due?: string;
	// updated?: string;
	completed?: string;
	// position?: string;
	// parent?: string;
	// links?: Array<{
	// 	type: string;
	// 	description: string;
	// 	link: string;
	// }>;
}

// interface Event {
// 	id: string;
// 	summary: string;
// 	start: { dateTime?: string; date?: string };
// 	end: { dateTime?: string; date?: string };
// 	[key: string]: any;
// }
export interface TaskListWithTasks {
	id: string;
	title: string | undefined; //?
	tasks: Task[];
}

export interface CalendarListWithEvents {
	id: string;
	title: string | undefined; //?
	// tasks: Task[];
	// events: Event[];
	events: CalendarEvent[];
}

export const useGoogleAuth = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [userInfo, setUserInfo] = useState<gapi.auth2.BasicProfile | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const [gapiClientInited, setGapiClientInited] = useState(false);
	const [userTaskLists, setUserTaskLists] = useState<UnifiedListItem[]>([]);
	const [userCalendarLists, setUserCalendarLists] = useState<
		UnifiedListItem[]
	>([]);
	const [allTasks, setAllTasks] = useState<TaskListWithTasks[]>([]);
	const [allEvents, setAllEvents] = useState<CalendarListWithEvents[]>([]);

	console.log(`allEvents: ${JSON.stringify(allEvents)}`);
	// console.log(`userCalendarLists: ${JSON.stringify(userCalendarLists)}`);

	if (!CLIENT_ID || !API_KEY) {
		throw new Error(
			'Google API credentials are not set properly in the environment variables.'
		);
	}

	const config = {
		clientId: CLIENT_ID,
		apiKey: API_KEY,
		scope: 'https://www.googleapis.com/auth/calendar',
		discoveryDocs: [
			'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
		],
	};

	const apiCalendar = new ApiCalendar(config);
	// console.log(userTaskLists);
	// console.log(userCalendarLists);
	const loadGapi = async () => {
		return new Promise<void>((resolve, reject) => {
			window.gapi.load('client:auth2', {
				callback: resolve,
				onerror: reject,
			});
		});
	};

	const initGapiClient = async () => {
		try {
			await loadGapi();
			await window.gapi.client.init({
				apiKey: API_KEY,
				clientId: CLIENT_ID,
				discoveryDocs: DISCOVERY_DOCS,
				scope: SCOPES,
			});
			setGapiClientInited(true);

			const authInstance = gapi.auth2.getAuthInstance();
			setIsSignedIn(authInstance.isSignedIn.get());
			authInstance.isSignedIn.listen(setIsSignedIn);
			if (authInstance.isSignedIn.get()) {
				setUserInfo(authInstance.currentUser.get().getBasicProfile());
			}
		} catch (error) {
			console.error('Error initializing GAPI client:', error);
			setError('Failed to initialize GAPI client.');
			setGapiClientInited(false);
		}
	};

	useEffect(() => {
		initGapiClient();
	}, []);

	const signIn = async () => {
		try {
			const authInstance = gapi.auth2.getAuthInstance();
			await authInstance.signIn();
			setIsSignedIn(true);
			setUserInfo(authInstance.currentUser.get().getBasicProfile());
		} catch (error) {
			console.error('Error signing in:', error);
			setError('Failed to sign in. Please try again.');
		}
	};

	const signOut = async () => {
		try {
			const authInstance = gapi.auth2.getAuthInstance();
			await authInstance.signOut();
			setIsSignedIn(false);
			setUserInfo(null);
		} catch (error) {
			console.error('Error signing out:', error);
			setError('Failed to sign out. Please try again.');
		}
	};

	const fetchTaskLists = async () => {
		try {
			if (gapiClientInited && isSignedIn) {
				const response = await (
					window.gapi.client as any
				).tasks.tasklists.list();
				if (response.result.items) {
					const taskLists = response.result.items.map(
						(item: any) => ({
							// kind: 'tasks#taskList',
							id: item.id,
							title: item.title,
						})
					);
					setUserTaskLists(taskLists);
				}
			}
		} catch (err) {
			console.error('Error fetching task lists:', err);
		}
	};

	const fetchCalendarLists = async () => {
		try {
			if (gapiClientInited && isSignedIn) {
				const response = await (
					window.gapi.client as any
				).calendar.calendarList.list();
				if (response.result.items) {
					const calendarLists = response.result.items.map(
						(item: any) => ({
							id: item.id,
							title: item.summary,
							color:
								staticCalendarColors[item.colorId] ||
								staticCalendarColors['default'],
						})
					);
					setUserCalendarLists(calendarLists);
				}
			}
		} catch (err) {
			console.error('Error fetching calendar lists:', err);
		}
	};

	useEffect(() => {
		if (isSignedIn) {
			fetchTaskLists();
			fetchCalendarLists();
		}
	}, [isSignedIn]);

	// const formatEventToLocalTime = (event: any) => {
	// 	let startDateTime, endDateTime;

	// 	// Обрабатываем начало события
	// 	if (event.start.dateTime) {
	// 		startDateTime = DateTime.fromISO(
	// 			event.start.dateTime,
	// 			// { zone: 'UTC' }
	// 			{ zone: event.start.timeZone || 'UTC' } // Если timeZone отсутствует, используем UTC
	// 		).toLocal();
	// 	} else if (event.start.date) {
	// 		// startDateTime = DateTime.fromISO(
	// 		// 	event.start.date,
	// 		// 	{ zone: 'UTC' }
	// 		// ).toLocal();

	// 		startDateTime = DateTime.fromISO(event.start.date).toLocal();
	// 	}

	// 	// Обрабатываем конец события
	// 	if (event.end.dateTime) {
	// 		endDateTime = DateTime.fromISO(
	// 			event.end.dateTime,
	// 			// { zone: 'UTC' }
	// 			{ zone: event.end.timeZone || 'UTC' }
	// 		).toLocal();
	// 	} else if (event.end.date) {
	// 		// endDateTime = DateTime.fromISO(event.end.date, {
	// 		// 	zone: 'UTC',
	// 		// }).toLocal();
	// 		endDateTime = DateTime.fromISO(event.end.date).toLocal();
	// 	}

	// 	// Возвращаем объект события с локальными датами
	// 	return {
	// 		id: event.id,
	// 		summary: event.summary || 'Без названия',
	// 		start: startDateTime
	// 			? startDateTime.toFormat('yyyy-MM-dd HH:mm:ss') // Преобразование в строку
	// 			: event.start,
	// 		end: endDateTime
	// 			? endDateTime.toFormat('yyyy-MM-dd HH:mm:ss') // Преобразование в строку
	// 			: event.end,
	// 	};
	// };

	const fetchTasksForAllLists = async () => {
		// setLoading(true);
		setError(null);
		const taskListWithTasks: TaskListWithTasks[] = [];

		try {
			for (const taskList of userTaskLists) {
				const response = await (gapi.client.tasks as any).tasks.list({
					tasklist: taskList.id,
				});

				if (response.result.items) {
					taskListWithTasks.push({
						//https://developers.google.com/tasks/reference/rest/v1/tasks?hl=ru+
						id: taskList.id,
						title: taskList.title,
						tasks: response.result.items.map((item: any) => ({
							id: item.id,
							title: item.title,
							// notes: item.notes,
							status: item.status,
							due: item.due,
							// updated: item.updated,
							completed: item.completed,
							// position: item.position,
							// parent: item.parent,
							// links: item.links,
						})),
					});
				} else {
					taskListWithTasks.push({
						id: taskList.id,
						title: taskList.title,
						tasks: [],
					});
				}
			}
			setAllTasks(taskListWithTasks);
		} catch (err: any) {
			console.error('Error fetching tasks for all lists:', err);
			setError('Failed to load tasks. Please try again later.');
		} finally {
			// setLoading(false);
		}
	};

	const fetchEventsForAllCalendarLists = async () => {
		try {
			const calendarListWithEvents: CalendarListWithEvents[] = [];

			// Встановлюємо обмеження часу для завершених подій
			const now = new Date();
			const oneYearAgo = new Date();
			oneYearAgo.setFullYear(now.getFullYear() - 1); // Отримуємо події за останній рік

			for (const calendarList of userCalendarLists) {
				// Отримуємо майбутні події
				const upcomingResponse = await apiCalendar.listUpcomingEvents(
					999,
					calendarList.id
				);
				// console.log(JSON.stringify(upcomingResponse));

				// Отримуємо завершені події (за останній рік або будь-який інший період)
				const completedResponse = await apiCalendar.listEvents({
					calendarId: calendarList.id,
					maxResults: 999,
					timeMax: now.toISOString(), // Поточний час
					timeMin: oneYearAgo.toISOString(), // Один рік тому
					orderBy: 'startTime',
					singleEvents: true,
				});

				const allEvents = [];
				// Додаємо майбутні події, якщо вони є
				if (
					upcomingResponse &&
					upcomingResponse.result &&
					upcomingResponse.result.items
				) {
					// console.log(JSON.stringify(upcomingResponse));
					allEvents.push(
						// ...upcomingResponse.result.items.map((event: any) => {
						...upcomingResponse.result.items.map(
							(event: FetchedEvent) => {
								return formatEventToLocalTime(event);
							}
						)
					);
				} else {
					console.warn(
						`No upcoming events found for calendar ID: ${calendarList.id}`
					);
				}
				// Додаємо завершені події, якщо вони є
				if (
					completedResponse &&
					completedResponse.result &&
					completedResponse.result.items
				) {
					allEvents.push(
						...completedResponse.result.items.map(
							(event: FetchedEvent) => {
								return formatEventToLocalTime(event);
							}
						)
					);
				} else {
					console.warn(
						`No completed events found for calendar ID: ${calendarList.id}`
					);
				}

				// Конвертация времени всех событий в локальное время

				// const eventsWithLocalTimes = allEvents.map((event: any) => {
				// 	let startDateTime;
				// 	let endDateTime; // Исправлено, теперь отдельная переменная для endDateTime

				// 	// Преобразуем дату и время начала события в локальное время
				// 	if (event.start.dateTime) {
				// 		startDateTime = DateTime.fromISO(event.start.dateTime, {
				// 			zone: 'UTC',
				// 		}).toLocal();
				// 	} else if (event.start.date) {
				// 		startDateTime = DateTime.fromISO(event.start.date, {
				// 			zone: 'UTC',
				// 		}).toLocal();
				// 	}

				// 	// Преобразуем дату и время конца события в локальное время
				// 	if (event.end.dateTime) {
				// 		endDateTime = DateTime.fromISO(event.end.dateTime, {
				// 			zone: 'UTC',
				// 		}).toLocal();
				// 	} else if (event.end.date) {
				// 		endDateTime = DateTime.fromISO(event.end.date, {
				// 			zone: 'UTC',
				// 		}).toLocal();
				// 	}

				// 	return {
				// 		...event,
				// 		start: startDateTime
				// 			? startDateTime.toFormat('yyyy-MM-dd HH:mm:ss') // Форматируем в строку с датой и временем
				// 			: event.start,
				// 		end: endDateTime
				// 			? endDateTime.toFormat('yyyy-MM-dd HH:mm:ss') // Форматируем в строку с датой и временем
				// 			: event.end,
				// 	};
				// });

				// Зберігаємо всі події для конкретного календаря

				// if (eventsWithLocalTimes.length > 0) {
				// 	calendarListWithEvents.push({
				// 		id: calendarList.id,
				// 		title: calendarList.title,
				// 		events: eventsWithLocalTimes,
				// 	});
				// }
				if (allEvents.length > 0) {
					calendarListWithEvents.push({
						id: calendarList.id,
						title: calendarList.title,
						events: allEvents,
					});
				}
			}

			// Оновлюємо стан з усіма подіями
			setAllEvents(calendarListWithEvents);
		} catch (err) {
			console.error('Error fetching events for all calendar lists:', err);
			setError('Failed to load calendar events. Please try again later.');
		}
	};

	useEffect(() => {
		if (isSignedIn && userTaskLists.length > 0) {
			fetchTasksForAllLists();
		}
	}, [isSignedIn, userTaskLists]);

	useEffect(() => {
		if (isSignedIn && userCalendarLists.length > 0) {
			fetchEventsForAllCalendarLists();
		}
	}, [isSignedIn, userTaskLists]);

	return {
		isSignedIn,
		userInfo,
		signIn,
		signOut,
		error,
		gapiClientInited,
		userTaskLists,
		userCalendarLists,
		allTasks,
		allEvents,
	};
};

// import { useState, useEffect } from 'react';
// import { gapi } from 'gapi-script';

// // import ApiCalendar from 'react-google-calendar-api';

// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const API_KEY = process.env.REACT_APP_API_KEY;

// // if (!CLIENT_ID || !API_KEY) {
// // 	throw new Error(
// // 		'Google API credentials are not set properly in the environment variables.'
// // 	);
// // }

// const DISCOVERY_DOCS = [
// 	'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
// 	'https://people.googleapis.com/$discovery/rest',
// 	'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
// ];
// const SCOPES = process.env.REACT_APP_SCOPES;
// // export interface TaskList {
// // 	kind: string; // "kind": "tasks#taskList",
// // 	id: string;
// // 	title: string;
// // }

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

// // export interface TaskListWithTasks {
// // 	id: string;
// // 	title: string;
// // 	tasks: Task[];
// // }

// export const useGoogleAuth = () => {
// 	const [isSignedIn, setIsSignedIn] = useState(false);
// 	const [userInfo, setUserInfo] = useState<gapi.auth2.BasicProfile | null>(
// 		null
// 	);
// 	const [error, setError] = useState<string | null>(null);
// 	// const [userTasklists, setUserTasklists] = useState<TaskList[]>([]);
// 	// const [allTasks, setAllTasks] = useState<TaskListWithTasks[]>([]);
// 	// const [loading, setLoading] = useState<boolean>(false);

// 	// console.log(`tasks: ${JSON.stringify(allTasks)}`);

// 	// console.log(`user tasklists: ${JSON.stringify(userTasklists)}`);

// 	const [gapiClientInited, setGapiClientInited] = useState(false); // добавил

// 	useEffect(() => {
// 		const initClient = () => {
// 			gapi.client
// 				.init({
// 					apiKey: API_KEY,
// 					clientId: CLIENT_ID,
// 					discoveryDocs: DISCOVERY_DOCS,
// 					scope: SCOPES,
// 				})
// 				.then(() => {
// 					setGapiClientInited(true); // добавил

// 					const authInstance = gapi.auth2.getAuthInstance();
// 					setIsSignedIn(authInstance.isSignedIn.get());
// 					authInstance.isSignedIn.listen(setIsSignedIn);
// 					if (authInstance.isSignedIn.get()) {
// 						setUserInfo(
// 							authInstance.currentUser.get().getBasicProfile()
// 						);
// 					}
// 				})
// 				.catch((err) => {
// 					console.error('Error initializing Google API client:', err);
// 					setError('Failed to initialize Google API client.');
// 					setGapiClientInited(false); // добавил
// 				});
// 		};

// 		gapi.load('client:auth2', initClient);
// 	}, []);

// 	const signIn = async () => {
// 		try {
// 			const authInstance = gapi.auth2.getAuthInstance();
// 			await authInstance.signIn();
// 			setIsSignedIn(true);
// 			setUserInfo(authInstance.currentUser.get().getBasicProfile());
// 		} catch (error) {
// 			console.error('Error signing in:', error);
// 			setError('Failed to sign in. Please try again.');
// 		}
// 	};

// 	const signOut = async () => {
// 		try {
// 			const authInstance = gapi.auth2.getAuthInstance();
// 			await authInstance.signOut();
// 			setIsSignedIn(false);
// 			setUserInfo(null);
// 		} catch (error) {
// 			console.error('Error signing out:', error);
// 			setError('Failed to sign out. Please try again.');
// 		}
// 	};

// 	// const fetchTaskLists = async () => {
// 	// 	try {
// 	// 		await new Promise<void>((resolve, reject) => {
// 	// 			if (window.gapi && window.gapi.client) {
// 	// 				resolve();
// 	// 			} else {
// 	// 				reject(new Error('gapi.client is not loaded'));
// 	// 			}
// 	// 		});

// 	// 		const response = await (
// 	// 			window.gapi.client as any
// 	// 		).tasks.tasklists.list();
// 	// 		if (response.result.items && response.result.items.length > 0) {
// 	// 			const taskLists: TaskList[] = response.result.items.map(
// 	// 				(item: Task) => ({
// 	// 					kind: item.kind,
// 	// 					id: item.id,
// 	// 					title: item.title,
// 	// 				})
// 	// 			);
// 	// 			setUserTasklists(taskLists);

// 	// 			// console.log(response);
// 	// 		} else {
// 	// 			console.log('No task lists found.');
// 	// 			setUserTasklists([]);
// 	// 		}
// 	// 	} catch (err) {
// 	// 		console.error('Error fetching task lists:', err);
// 	// 		setError('Failed to fetch task lists.');
// 	// 	}
// 	// };

// 	// const fetchTaskLists = async () => {
// 	// 	try {
// 	// 		await new Promise<void>((resolve, reject) => {
// 	// 			if (window.gapi && window.gapi.client) {
// 	// 				resolve();
// 	// 			} else {
// 	// 				reject(new Error('gapi.client is not loaded'));
// 	// 			}
// 	// 		});

// 	// 		const response = await (
// 	// 			window.gapi.client as any
// 	// 		).tasks.tasklists.list();
// 	// 		if (response.result.items && response.result.items.length > 0) {
// 	// 			const newTaskLists: TaskList[] = response.result.items.map(
// 	// 				(item: Task) => ({
// 	// 					kind: item.kind,
// 	// 					id: item.id,
// 	// 					title: item.title,
// 	// 				})
// 	// 			);

// 	// 			// Добавляем новые task lists к существующим
// 	// 			setUserTasklists((prevTasklists) => [
// 	// 				...prevTasklists,
// 	// 				...newTaskLists,
// 	// 			]);
// 	// 		} else {
// 	// 			console.log('No task lists found.');
// 	// 			setUserTasklists([]);
// 	// 		}
// 	// 	} catch (err) {
// 	// 		console.error('Error fetching task lists:', err);
// 	// 		setError('Failed to fetch task lists.');
// 	// 	}
// 	// };

// 	// const config = {
// 	// 	clientId: CLIENT_ID,
// 	// 	apiKey: API_KEY,
// 	// 	scope: 'https://www.googleapis.com/auth/calendar',
// 	// 	discoveryDocs: [
// 	// 		'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
// 	// 	],
// 	// };

// 	// const apiCalendar = new ApiCalendar(config);
// 	// const fetchCalendarLists = async () => {
// 	// 	try {
// 	// 		const response = await apiCalendar.listCalendars();
// 	// 		console.log(response);

// 	// 		if (response.result.items && response.result.items.length > 0) {
// 	// 			const newTaskLists: TaskList[] = response.result.items.map(
// 	// 				(item: Task) => ({
// 	// 					kind: item.kind,
// 	// 					id: item.id,
// 	// 					title: item.title,
// 	// 				})
// 	// 			);
// 	// 			setUserTasklists((prevTasklists) => [
// 	// 				...prevTasklists,
// 	// 				...newTaskLists,
// 	// 			]);
// 	// 		}
// 	// 	} catch (error) {
// 	// 		console.error('Error fetching calendar lists:', error);
// 	// 	}
// 	// };
// 	// useEffect(() => {
// 	// 	if (isSignedIn) {
// 	// 		fetchCalendarLists();
// 	// 		fetchTaskLists();
// 	// 	}
// 	// }, [isSignedIn]);

// 	// const fetchTasksForAllLists = async () => {
// 	// 	setLoading(true);
// 	// 	setError(null);
// 	// 	const taskListWithTasks: TaskListWithTasks[] = [];

// 	// 	try {
// 	// 		for (const taskList of userTasklists) {
// 	// 			const response = await (gapi.client.tasks as any).tasks.list({
// 	// 				tasklist: taskList.id,
// 	// 			});

// 	// 			if (response.result.items) {
// 	// 				taskListWithTasks.push({
// 	// 					//https://developers.google.com/tasks/reference/rest/v1/tasks?hl=ru+
// 	// 					id: taskList.id,
// 	// 					title: taskList.title,
// 	// 					tasks: response.result.items.map((item: any) => ({
// 	// 						id: item.id,
// 	// 						title: item.title,
// 	// 						notes: item.notes,
// 	// 						status: item.status,
// 	// 						due: item.due,
// 	// 						updated: item.updated,
// 	// 						completed: item.completed,
// 	// 						position: item.position,
// 	// 						parent: item.parent,
// 	// 						links: item.links,
// 	// 					})),
// 	// 				});
// 	// 			} else {
// 	// 				taskListWithTasks.push({
// 	// 					id: taskList.id,
// 	// 					title: taskList.title,
// 	// 					tasks: [],
// 	// 				});
// 	// 			}
// 	// 		}
// 	// 		setAllTasks(taskListWithTasks);
// 	// 	} catch (err: any) {
// 	// 		console.error('Error fetching tasks for all lists:', err);
// 	// 		setError('Failed to load tasks. Please try again later.');
// 	// 	} finally {
// 	// 		setLoading(false);
// 	// 	}
// 	// };

// 	// useEffect(() => {
// 	// 	if (isSignedIn && userTasklists.length > 0) {
// 	// 		fetchTasksForAllLists();
// 	// 	}
// 	// }, [isSignedIn, userTasklists]);

// 	// const fetchCalendarList = async () => {};

// 	return {
// 		isSignedIn,
// 		userInfo,
// 		signIn,
// 		signOut,
// 		// userTasklists,
// 		error,
// 		// allTasks,
// 		// loading,

// 		gapiClientInited,
// 	};
// };

// // import { useState, useEffect } from 'react';
// // import { gapi } from 'gapi-script';

// // const CLIENT_ID =
// // 	'710183932569-jg572k9e26fgcvhgr7hi62lu8rfu65ct.apps.googleusercontent.com';
// // const API_KEY = 'AIzaSyCSLPpvAP79PnbiQHzc7dv_G0DUOKh4UZA';
// // const DISCOVERY_DOCS = [
// // 	'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
// // 	'https://people.googleapis.com/$discovery/rest',
// // 	'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
// // ];
// // const SCOPES =
// // 	'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/contacts.readonly profile https://www.googleapis.com/auth/tasks.readonly';

// // export interface TaskList {
// // 	id: string;
// // 	title: string;
// // }

// // interface Task {
// // 	id: string;
// // 	title: string;
// // 	notes?: string;
// // 	status?: 'needsAction' | 'completed';
// // 	due?: string;
// // 	updated?: string;
// // 	completed?: string;
// // 	position?: string;
// // 	parent?: string;
// // 	links?: Array<{
// // 		type: string;
// // 		description: string;
// // 		link: string;
// // 	}>;
// // }

// // export const useGoogleAuth = () => {
// // 	const [isSignedIn, setIsSignedIn] = useState(false);
// // 	const [userInfo, setUserInfo] = useState<gapi.auth2.BasicProfile | null>(
// // 		null
// // 	);
// // 	const [error, setError] = useState<string | null>(null);
// // 	const [userTasklists, setUserTasklists] = useState<TaskList[]>([]);
// // 	const [tasks, setTasks] = useState<any[]>([]);
// // 	const [loading, setLoading] = useState<boolean>(false);

// // 	const [allTasks, setAllTasks] = useState<{ [key: string]: Task[] }>({});

// // 	console.log(`tasks: ${JSON.stringify(allTasks)}`);
// // 	// console.log(`userTasklists: ${JSON.stringify(userTasklists)}`);

// // 	useEffect(() => {
// // 		const initClient = () => {
// // 			gapi.client
// // 				.init({
// // 					apiKey: API_KEY,
// // 					clientId: CLIENT_ID,
// // 					discoveryDocs: DISCOVERY_DOCS,
// // 					scope: SCOPES,
// // 				})
// // 				.then(() => {
// // 					const authInstance = gapi.auth2.getAuthInstance();
// // 					setIsSignedIn(authInstance.isSignedIn.get());
// // 					authInstance.isSignedIn.listen(setIsSignedIn);
// // 					if (authInstance.isSignedIn.get()) {
// // 						setUserInfo(
// // 							authInstance.currentUser.get().getBasicProfile()
// // 						);
// // 					}
// // 				})
// // 				.catch((err) => {
// // 					console.error('Error initializing Google API client:', err);
// // 					setError('Failed to initialize Google API client.');
// // 				});
// // 		};

// // 		gapi.load('client:auth2', initClient);
// // 	}, []);

// // 	const signIn = async () => {
// // 		try {
// // 			const authInstance = gapi.auth2.getAuthInstance();
// // 			await authInstance.signIn();
// // 			setIsSignedIn(true);
// // 			setUserInfo(authInstance.currentUser.get().getBasicProfile());
// // 		} catch (error) {
// // 			console.error('Error signing in:', error);
// // 			setError('Failed to sign in. Please try again.');
// // 		}
// // 	};

// // 	const signOut = async () => {
// // 		try {
// // 			const authInstance = gapi.auth2.getAuthInstance();
// // 			await authInstance.signOut();
// // 			setIsSignedIn(false);
// // 			setUserInfo(null);
// // 		} catch (error) {
// // 			console.error('Error signing out:', error);
// // 			setError('Failed to sign out. Please try again.');
// // 		}
// // 	};

// // 	useEffect(() => {
// // 		const fetchTaskLists = async () => {
// // 			try {
// // 				await new Promise<void>((resolve, reject) => {
// // 					if (window.gapi && window.gapi.client) {
// // 						resolve();
// // 					} else {
// // 						reject(new Error('gapi.client is not loaded'));
// // 					}
// // 				});

// // 				const response = await (
// // 					window.gapi.client as any
// // 				).tasks.tasklists.list();
// // 				if (response.result.items && response.result.items.length > 0) {
// // 					const taskLists: TaskList[] = response.result.items.map(
// // 						(item: Task) => ({
// // 							id: item.id,
// // 							title: item.title,
// // 						})
// // 					);
// // 					setUserTasklists(taskLists);
// // 				} else {
// // 					console.log('No task lists found.');
// // 					setUserTasklists([]);
// // 				}
// // 			} catch (err) {
// // 				console.error('Error fetching task lists:', err);
// // 				setError('Failed to fetch task lists.');
// // 			}
// // 		};

// // 		if (isSignedIn) {
// // 			fetchTaskLists();
// // 		}
// // 	}, [isSignedIn]);

// // 	const fetchTasksForAllLists = async () => {
// // 		setLoading(true);
// // 		setError(null);
// // 		const tasksByList: { [key: string]: Task[] } = {};

// // 		try {
// // 			for (const taskList of userTasklists) {
// // 				const response = await (gapi.client.tasks as any).tasks.list({
// // 					tasklist: taskList.id,
// // 				});

// // 				if (response.result.items) {
// // 					tasksByList[taskList.id] = response.result.items.map(
// // 						(item: any) => ({
// // 							id: item.id,
// // 							title: item.title,
// // 							notes: item.notes,
// // 							status: item.status,
// // 							due: item.due,
// // 							updated: item.updated,
// // 							completed: item.completed,
// // 							position: item.position,
// // 							parent: item.parent,
// // 							links: item.links,
// // 						})
// // 					);
// // 				} else {
// // 					tasksByList[taskList.id] = [];
// // 				}
// // 			}
// // 			setAllTasks(tasksByList);
// // 		} catch (err: any) {
// // 			console.error('Error fetching tasks for all lists:', err);
// // 			setError('Failed to load tasks. Please try again later.');
// // 		} finally {
// // 			setLoading(false);
// // 		}
// // 	};

// // 	useEffect(() => {
// // 		if (isSignedIn && userTasklists.length > 0) {
// // 			fetchTasksForAllLists();
// // 		}
// // 	}, [isSignedIn, userTasklists]);

// // 	return {
// // 		isSignedIn,
// // 		userInfo,
// // 		signIn,
// // 		signOut,
// // 		userTasklists,
// // 		error,
// // 		allTasks,
// // 	};
// // };
