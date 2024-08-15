import React from 'react';
import { AuthContext } from './AuthContext';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const auth = useGoogleAuth();

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
