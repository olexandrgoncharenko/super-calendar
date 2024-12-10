import { AuthProvider } from './context/AuthProvider';
import Header from './components/Layout/Header/Header';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import Field from './components/Field/Field/Field';

function App() {
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
