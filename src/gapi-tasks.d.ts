// gapi-tasks.d.ts
declare namespace gapi.client {
	namespace tasks {
		interface Tasklists {
			items: Tasklist[];
		}

		interface Tasklist {
			id: string;
			title: string;
		}

		// Исправляем объявление tasklists
		const tasklists: {
			list(): Promise<{ result: Tasklists }>;
		};
	}
}
