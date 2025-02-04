import { useContext } from 'react';
import { GoogleAuthContext } from './GoogleAuthContext';

export const useGoogleAuth = () => {
	const context = useContext(GoogleAuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an GSIauthProvider');
	}

	return context;
};
