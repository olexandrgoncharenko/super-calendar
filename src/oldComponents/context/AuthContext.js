import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const gapi = window.gapi;
    const google = window.google;
    const CLIENT_ID =
        '710183932569-jg572k9e26fgcvhgr7hi62lu8rfu65ct.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyCSLPpvAP79PnbiQHzc7dv_G0DUOKh4UZA';
    const DISCOVERY_DOCS = [
        'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        'https://people.googleapis.com/$discovery/rest',
    ];
    const SCOPES =
        'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/contacts.readonly profile';

    const [tokenClient, setTokenClient] = useState(null);
    const [gapiInited, setGapiInited] = useState(false);
    const [gisInited, setGisInited] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (gapi && google) {
            gapi.load('client', initializeGapiClient);
            const tokenClientInstance = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '', // Set later
            });
            setTokenClient(tokenClientInstance);
            setGisInited(true);
        }
    }, [gapi, google]);

    async function initializeGapiClient() {
        try {
            await gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: DISCOVERY_DOCS,
            });

            const storedToken = localStorage.getItem('access_token');
            if (storedToken) {
                gapi.client.setToken({ access_token: storedToken });
                try {
                    await getUserInfo();
                    setIsSignedIn(true);
                } catch (error) {
                    console.error('Stored token is invalid or expired:', error);
                    localStorage.removeItem('access_token');
                }
            }

            setGapiInited(true);
            console.log('Gapi client initialized');
        } catch (error) {
            console.error('Error initializing gapi client:', error);
        }
    }

    async function handleAuthClick() {
        if (!tokenClient) {
            console.error('Token client is not initialized');
            return;
        }

        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                console.error(resp);
                throw resp;
            }
            console.log('Authorized', resp);
            setIsSignedIn(true);
            localStorage.setItem('access_token', resp.access_token);
            await getUserInfo();
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            tokenClient.requestAccessToken({ prompt: '' });
        }
    }

    async function getUserInfo() {
        try {
            const response = await gapi.client.people.people.get({
                resourceName: 'people/me',
                personFields: 'names,emailAddresses',
            });
            const user = response.result;
            const name = user.names?.[0]?.displayName || 'No name found';
            const email = user.emailAddresses?.[0]?.value || 'No email found';

            setUserInfo({
                name,
                email,
            });

            console.log(`Name: ${name}, Email: ${email}`);
        } catch (error) {
            console.error('Error making API call:', error);
            throw error;
        }
    }

    function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token, () => {
                gapi.client.setToken(null);
                console.log('User signed out.');
                setIsSignedIn(false);
                setUserInfo(null);
                localStorage.removeItem('access_token');
            });
        }
    }

    return (
        <AuthContext.Provider
            value={{
                gapiInited,
                gisInited,
                isSignedIn,
                userInfo,
                handleAuthClick,
                handleSignoutClick,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
