import { createContext } from 'react';
// import { TaskList } from '../hooks/useGoogleAuth';
import { TaskListWithTasks } from '../hooks/useGoogleAuth';
import { CalendarListWithEvents } from '../hooks/useGoogleAuth';

import { UnifiedListItem } from '../hooks/useGoogleAuth';

interface AuthContextType {
	isSignedIn: boolean;
	userInfo: gapi.auth2.BasicProfile | null;
	signIn: () => void;
	signOut: () => void;
	error: string | null;
	userTaskLists: UnifiedListItem[];
	userCalendarLists: UnifiedListItem[];
	allTasks: TaskListWithTasks[];
	allEvents: CalendarListWithEvents[];
	gapiClientInited: boolean;
}

// Создаем контекст с начальным значением undefined
export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);
