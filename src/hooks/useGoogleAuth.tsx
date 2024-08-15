import { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID =
	'710183932569-jg572k9e26fgcvhgr7hi62lu8rfu65ct.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCSLPpvAP79PnbiQHzc7dv_G0DUOKh4UZA';
const DISCOVERY_DOCS = [
	'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
	'https://people.googleapis.com/$discovery/rest',
];
const SCOPES =
	'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/contacts.readonly profile';

export const useGoogleAuth = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [userInfo, setUserInfo] = useState<gapi.auth2.BasicProfile | null>(
		null
	);

	useEffect(() => {
		const initClient = () => {
			gapi.client
				.init({
					apiKey: API_KEY,
					clientId: CLIENT_ID,
					discoveryDocs: DISCOVERY_DOCS,
					scope: SCOPES,
				})
				.then(() => {
					const authInstance = gapi.auth2.getAuthInstance();
					setIsSignedIn(authInstance.isSignedIn.get());
					authInstance.isSignedIn.listen(setIsSignedIn);
					if (authInstance.isSignedIn.get()) {
						setUserInfo(
							authInstance.currentUser.get().getBasicProfile()
						);
					}
				});
		};
		gapi.load('client:auth2', initClient);
	}, []);

	// const signIn = () => {
	// 	const authInstance = gapi.auth2.getAuthInstance();
	// 	authInstance.signIn().then(() => {
	// 		setIsSignedIn(true);
	// 		setUserInfo(authInstance.currentUser.get().getBasicProfile());
	// 	});
	// };
	const signIn = async () => {
		try {
			const authInstance = gapi.auth2.getAuthInstance();
			await authInstance.signIn(); // Это аутентификация
			setIsSignedIn(true);
			setUserInfo(authInstance.currentUser.get().getBasicProfile());
		} catch (error) {
			console.error('Error signing in:', error);
		}
	};

	// const signOut = () => {
	// 	const authInstance = gapi.auth2.getAuthInstance();
	// 	authInstance.signOut().then(() => {
	// 		setIsSignedIn(false);
	// 		setUserInfo(null);
	// 	});
	// };
	const signOut = async () => {
		try {
			const authInstance = gapi.auth2.getAuthInstance();
			await authInstance.signOut(); // Это аутентификация
			setIsSignedIn(false);
			setUserInfo(null);
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	return { isSignedIn, userInfo, signIn, signOut };
};
