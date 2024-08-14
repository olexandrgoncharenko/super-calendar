import { useAuth } from './context/auth'; // Используем ваш хук для получения контекста
import './App.css';

function App() {
	const { isSignedIn, userInfo, signIn, signOut } = useAuth(); // Получаем значения из контекста

	return (
		<div>
			{isSignedIn ? (
				<>
					<h1>Welcome, {userInfo?.getName()}</h1>
					<button onClick={signOut}>Logout</button>
				</>
			) : (
				<button onClick={signIn}>Login with Google</button>
			)}
		</div>
	);
}

export default App;
