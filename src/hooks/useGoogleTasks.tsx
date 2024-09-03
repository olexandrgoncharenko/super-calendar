import { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const TASKS_API_DISCOVERY_DOC =
	'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest';
const TASKS_SCOPES = 'https://www.googleapis.com/auth/tasks.readonly';

export const useGoogleTasks = (tasklistId: string) => {
	const [tasks, setTasks] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// const [taskLists, setTaskLists] = useState<any[]>([]);

	// useEffect(() => {
	// 	const fetchTasks = async () => {
	// 		setLoading(true);
	// 		setError(null);

	// 		try {
	// 			await gapi.client.load(TASKS_API_DISCOVERY_DOC); // Загрузка API Tasks

	// 			const response = await gapi.client.tasks.tasks.list({
	// 				tasklist: tasklistId,
	// 			});

	// 			if (response.result.items) {
	// 				setTasks(response.result.items);
	// 			} else {
	// 				setTasks([]);
	// 			}
	// 		} catch (err: any) {
	// 			console.error('Error fetching tasks:', err);
	// 			setError('Failed to load tasks. Please try again later.');
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};

	// 	if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
	// 		fetchTasks();
	// 	}
	// }, [tasklistId]);

	return { tasks, loading, error };
};
