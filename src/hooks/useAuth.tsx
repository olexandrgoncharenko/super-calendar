import { useEffect, useState } from 'react';
import { UserInfo } from '../types/UserInfo';

const CLIENT_ID =
	'710183932569-jg572k9e26fgcvhgr7hi62lu8rfu65ct.apps.googleusercontent.com';
const SCOPES =
	'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile';

const useAuth = () => {
	const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [user, setUser] = useState<UserInfo | null>(null);

	useEffect(() => {
		checkToken();
	}, []);

	useEffect(() => {
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		script.onload = () => setIsGoogleApiLoaded(true);
		script.onerror = () => console.error('Failed to load Google API.');
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const checkToken = () => {
		const token = localStorage.getItem('google_token');
		const tokenExpirationTime = localStorage.getItem(
			'google_token_expiration_time'
		);

		if (token && tokenExpirationTime) {
			const expiresIn = parseInt(tokenExpirationTime) - Date.now();

			if (expiresIn > 0) {
				setIsSignedIn(true);
				getUserInfo(token);
			}
		} else {
			handleLogout();
			console.error('Token is missing or expired');
		}
	};

	const initializeTokenClient = () => {
		if (window.google?.accounts?.oauth2) {
			const tokenClient = window.google.accounts.oauth2.initTokenClient({
				client_id: CLIENT_ID,
				scope: SCOPES,
				prompt: 'consent',
				callback: (tokenResponse) => {
					if (tokenResponse.error) {
						console.error(
							'Error obtaining token:',
							tokenResponse.error
						);
						return;
					}
					if (tokenResponse.access_token) {
						saveToken(tokenResponse);
					} else {
						console.error('Failed to obtain access_token');
					}
				},
			});

			tokenClient.requestAccessToken();
		} else {
			console.error('Google OAuth2 client is not available.');
		}
	};

	const saveToken = (tokenData: {
		access_token: string;
		expires_in: number;
	}) => {
		const expirationTime = Date.now() + tokenData.expires_in * 1000;
		localStorage.setItem('google_token', tokenData.access_token);
		localStorage.setItem(
			'google_token_expiration_time',
			expirationTime.toString()
		);
		setIsSignedIn(true);
		getUserInfo(tokenData.access_token);
	};

	const getUserInfo = async (accessToken: string) => {
		try {
			const response = await fetch(
				'https://www.googleapis.com/oauth2/v2/userinfo',
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);
			if (!response.ok) throw new Error('Error fetching user data');

			const userInfo = await response.json();
			setUser({ name: userInfo.name, email: userInfo.email });
		} catch (error) {
			console.error('Error fetching user information:', error);
			handleLogout();
		}
	};

	const signIn = () => {
		initializeTokenClient();
	};

	const handleLogout = () => {
		localStorage.removeItem('google_token');
		localStorage.removeItem('google_token_expiration_time');
		setUser(null);
		setIsSignedIn(false);
		console.log('👋 User logged out.');
	};

	return { user, isSignedIn, isGoogleApiLoaded, signIn, handleLogout };
};

export default useAuth;
