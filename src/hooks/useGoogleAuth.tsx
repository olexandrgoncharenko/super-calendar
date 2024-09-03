import { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID =
	'710183932569-jg572k9e26fgcvhgr7hi62lu8rfu65ct.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCSLPpvAP79PnbiQHzc7dv_G0DUOKh4UZA';
const DISCOVERY_DOCS = [
	'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
	'https://people.googleapis.com/$discovery/rest',
	'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
];
const SCOPES =
	'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/contacts.readonly profile https://www.googleapis.com/auth/tasks.readonly';

export interface TaskList {
	id: string;
	title: string;
}

interface Task {
	id: string;
	title: string;
}

export const useGoogleAuth = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [userInfo, setUserInfo] = useState<gapi.auth2.BasicProfile | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const [userTasklists, setUserTasklists] = useState<TaskList[]>([]);

	// console.log(`userTasklists: ${userTasklists}`);
	console.log(`userTasklists: ${JSON.stringify(userTasklists)}`);

	useEffect(() => {
		const initClient = () => {
			gapi.client
				.init({
					apiKey: API_KEY,
					clientId: CLIENT_ID,
					discoveryDocs: DISCOVERY_DOCS,
					scope: SCOPES,
				})
				.then(() => {
					const authInstance = gapi.auth2.getAuthInstance();
					setIsSignedIn(authInstance.isSignedIn.get());
					authInstance.isSignedIn.listen(setIsSignedIn);
					if (authInstance.isSignedIn.get()) {
						setUserInfo(
							authInstance.currentUser.get().getBasicProfile()
						);
					}
				})
				.catch((err) => {
					console.error('Error initializing Google API client:', err);
					setError('Failed to initialize Google API client.');
				});
		};

		gapi.load('client:auth2', initClient);
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

	useEffect(() => {
		const fetchTaskLists = async () => {
			try {
				await new Promise<void>((resolve, reject) => {
					if (window.gapi && window.gapi.client) {
						resolve();
					} else {
						reject(new Error('gapi.client is not loaded'));
					}
				});

				const response = await (
					window.gapi.client as any
				).tasks.tasklists.list();
				if (response.result.items && response.result.items.length > 0) {
					const taskLists: TaskList[] = response.result.items.map(
						(item: Task) => ({
							id: item.id,
							title: item.title,
						})
					);
					setUserTasklists(taskLists);
				} else {
					console.log('No task lists found.');
					setUserTasklists([]);
				}
			} catch (err) {
				console.error('Error fetching task lists:', err);
				setError('Failed to fetch task lists.');
			}
		};

		if (isSignedIn) {
			fetchTaskLists();
		}
	}, [isSignedIn]);

	return { isSignedIn, userInfo, signIn, signOut, userTasklists, error };
};
