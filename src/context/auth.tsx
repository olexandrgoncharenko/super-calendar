import React, { createContext, ReactNode, useContext } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

// Описываем интерфейс для данных контекста
interface AuthContextType {
	isSignedIn: boolean;
	userInfo: gapi.auth2.BasicProfile | null;
	signIn: () => void;
	signOut: () => void;
}

// Создаем контекст с начальным значением null
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const { isSignedIn, userInfo, signIn, signOut } = useGoogleAuth();

	return (
		<AuthContext.Provider value={{ isSignedIn, userInfo, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

// Дополнительно: создаем хук для доступа к контексту
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
