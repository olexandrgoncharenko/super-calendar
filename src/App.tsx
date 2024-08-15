import React from 'react';
import { AuthProvider } from './context/AuthProvider';
import Header from './components/Layout/Header/Header';

function App() {
	return (
		<AuthProvider>
			<Header />
			{/* Другие компоненты */}
		</AuthProvider>
	);
}

export default App;
