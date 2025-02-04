import React from 'react';
import { GoogleAuthContext } from './GoogleAuthContext';
import useGAuth from '../hooks/useAuth';

interface GoogleAuthuthProviderProps {
	children: React.ReactNode;
}

export const GoogleAuthProvider: React.FC<GoogleAuthuthProviderProps> = ({
	children,
}) => {
	const auth = useGAuth();
	return (
		<GoogleAuthContext.Provider value={auth}>
			{children}
		</GoogleAuthContext.Provider>
	);
};
