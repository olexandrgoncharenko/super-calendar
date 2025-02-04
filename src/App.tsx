import Header from './components/Layout/Header/Header';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import Field from './components/Field/Field/Field';
import { GoogleAuthProvider } from './context/GoogleAuthProvider';

function App() {
	return (
		<GoogleAuthProvider>
			<Header />
			<div className='container'>
				<Sidebar />
				<Field />
			</div>
		</GoogleAuthProvider>
	);
}

export default App;
