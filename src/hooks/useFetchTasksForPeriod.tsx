import { useState, useEffect } from 'react';

interface Task {
	id: string;
	title: string;
	due?: string;
}

export const useFetchTasksForPeriod = (
	tasklistId: string,
	startDate: string,
	endDate: string
) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				await gapi.client.load('tasks', 'v1');
				const response = await (gapi.client as any).tasks.tasks.list({
					tasklist: tasklistId,
				});

				if (response.result.items && response.result.items.length > 0) {
					const tasks = response.result.items as Task[];

					// Фільтрація завдань за періодом
					const filteredTasks = tasks.filter((task) => {
						if (task.due) {
							const dueDate = new Date(task.due);
							return (
								dueDate >= new Date(startDate) &&
								dueDate <= new Date(endDate)
							);
						}
						return false;
					});

					setTasks(filteredTasks);
				} else {
					console.log('No tasks found.');
					setTasks([]);
				}
			} catch (err) {
				console.error('Error fetching tasks:', err);
				setError('Failed to load tasks. Please try again later.');
			}
		};

		fetchTasks();
	}, [tasklistId, startDate, endDate]);

	return { tasks, error };
};
