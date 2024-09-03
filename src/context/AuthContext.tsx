import { createContext } from 'react';
import { TaskList } from '../hooks/useGoogleAuth';

interface AuthContextType {
	isSignedIn: boolean;
	userInfo: gapi.auth2.BasicProfile | null;
	signIn: () => void;
	signOut: () => void;
	error: string | null;
	userTasklists: TaskList[];
}

// Создаем контекст с начальным значением undefined
export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);
