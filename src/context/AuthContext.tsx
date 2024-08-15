import { createContext } from 'react';

interface AuthContextType {
	isSignedIn: boolean;
	userInfo: gapi.auth2.BasicProfile | null;
	signIn: () => void;
	signOut: () => void;
}

// Создаем контекст с начальным значением undefined
export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);
