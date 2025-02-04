import { createContext } from 'react';
import { UserInfo } from '../types/UserInfo';

interface GoogleAuthContextType {
	isSignedIn: boolean;
	isGoogleApiLoaded: boolean;
	user: UserInfo | null;
	signIn: () => void;
	handleLogout: () => void;
}

export const GoogleAuthContext = createContext<
	GoogleAuthContextType | undefined
>(undefined);
