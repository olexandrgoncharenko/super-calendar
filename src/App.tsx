import { AuthProvider } from './context/AuthProvider';
import Header from './components/Layout/Header/Header';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import Field from './components/Field/Field/Field';

// import { useAuth } from './context/useAuth';

function App() {
	// const { isSignedIn, userTasklists } = useAuth();
	// console.log(`APP isSignedIn: ${isSignedIn}`);
	// console.log(`APP userTasklists: ${JSON.stringify(userTasklists)}`);

	return (
		<AuthProvider>
			<Header />
			<div className='container'>
				<Sidebar />
				<Field />
			</div>
		</AuthProvider>
	);
}

export default App;
