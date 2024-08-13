import React from 'react';
import './App.css';
import Sidebar from './components/Layout/Sidebar/Sidebar/Sidebar';
import Header from './components/Layout/Header/Header';
import Field from './components/Field/Field';
import { AuthProvider, AuthContext } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <AuthConsumer />
        </AuthProvider>
    );
}

const AuthConsumer = () => {
    const {
        gapiInited,
        gisInited,
        isSignedIn,
        userInfo,
        handleAuthClick,
        handleSignoutClick,
    } = React.useContext(AuthContext);

    return (
        <div className="App">
            <Header
                handleAuthClick={handleAuthClick}
                handleSignoutClick={handleSignoutClick}
                gisInited={gisInited}
                isSignedIn={isSignedIn}
                userInfo={userInfo}
            />
            <div className="container">
                <Sidebar />
                <Field />
            </div>
        </div>
    );
};

export default App;

// import React, { useEffect, useState } from 'react';
// import './App.css';
// import Sidebar from './components/Layout/Sidebar/Sidebar/Sidebar';
// import Header from './components/Layout/Header/Header';
// import Field from './components/Field/Field';

// function App() {
//   const gapi = window.gapi;
//   const google = window.google;
//   const CLIENT_ID =
//     '710183932569-jg572k9e26fgcvhgr7hi62lu8rfu65ct.apps.googleusercontent.com';
//   const API_KEY = 'AIzaSyCSLPpvAP79PnbiQHzc7dv_G0DUOKh4UZA';
//   const DISCOVERY_DOCS = [
//     'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
//     'https://people.googleapis.com/$discovery/rest',
//   ];
//   const SCOPES =
//     'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/contacts.readonly profile';

//   const [tokenClient, setTokenClient] = useState(null);
//   const [gapiInited, setGapiInited] = useState(false);
//   const [gisInited, setGisInited] = useState(false);
//   const [isSignedIn, setIsSignedIn] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);

//   const gapiLoaded = () => {
//     gapi.load('client', initializeGapiClient);
//   };

//   const gisLoaded = () => {
//     const tokenClientInstance = google.accounts.oauth2.initTokenClient({
//       client_id: CLIENT_ID,
//       scope: SCOPES,
//       callback: '', // Set later
//     });
//     setTokenClient(tokenClientInstance);
//     setGisInited(true);
//   };

//   async function initializeGapiClient() {
//     try {
//       await gapi.client.init({
//         apiKey: API_KEY,
//         discoveryDocs: DISCOVERY_DOCS,
//       });

//       const storedToken = localStorage.getItem('access_token');
//       if (storedToken) {
//         gapi.client.setToken({ access_token: storedToken });
//         try {
//           await getUserInfo();
//           setIsSignedIn(true);
//         } catch (error) {
//           console.error('Stored token is invalid or expired:', error);
//           localStorage.removeItem('access_token');
//         }
//       }

//       setGapiInited(true);
//       console.log('Gapi client initialized');
//     } catch (error) {
//       console.error('Error initializing gapi client:', error);
//     }
//   }

//   useEffect(() => {
//     if (gapi && google) {
//       gapiLoaded();
//       gisLoaded();
//     }
//   }, []);

//   async function handleAuthClick() {
//     if (!tokenClient) {
//       console.error('Token client is not initialized');
//       return;
//     }

//     tokenClient.callback = async (resp) => {
//       if (resp.error !== undefined) {
//         console.error(resp);
//         throw resp;
//       }
//       console.log('Authorized', resp);
//       setIsSignedIn(true);
//       localStorage.setItem('access_token', resp.access_token);
//       await getUserInfo();
//     };

//     if (gapi.client.getToken() === null) {
//       tokenClient.requestAccessToken({ prompt: 'consent' });
//     } else {
//       tokenClient.requestAccessToken({ prompt: '' });
//     }
//   }

//   async function getUserInfo() {
//     try {
//       const response = await gapi.client.people.people.get({
//         resourceName: 'people/me',
//         personFields: 'names,emailAddresses',
//       });
//       const user = response.result;
//       const name = user.names?.[0]?.displayName || 'No name found';
//       const email = user.emailAddresses?.[0]?.value || 'No email found';

//       setUserInfo({
//         name,
//         email,
//       });

//       console.log(`Name: ${name}, Email: ${email}`);
//     } catch (error) {
//       console.error('Error making API call:', error);
//       throw error;
//     }
//   }

//   function handleSignoutClick() {
//     const token = gapi.client.getToken();
//     if (token !== null) {
//       google.accounts.oauth2.revoke(token.access_token, () => {
//         gapi.client.setToken(null);
//         console.log('User signed out.');
//         setIsSignedIn(false);
//         setUserInfo(null);
//         localStorage.removeItem('access_token');
//       });
//     }
//   }

//   return (
//     <div className="App">
//       <Header
//         handleAuthClick={handleAuthClick}
//         handleSignoutClick={handleSignoutClick}
//         gisInited={gisInited}
//         isSignedIn={isSignedIn}
//         userInfo={userInfo}
//       />
//       <div className="container">
//         <Sidebar />
//         <Field />
//       </div>
//     </div>
//   );
// }

// export default App;
