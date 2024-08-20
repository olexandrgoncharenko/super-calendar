import React from 'react';
import styles from './Header.module.css';
import { useAuth } from '../../../context/useAuth';
import GoogleAuthButton from '../../UI/GoogleAuthButton/GoogleAuthButton';

const Header: React.FC = () => {
	const { isSignedIn, userInfo, signIn, signOut } = useAuth();

	return (
		<header className={styles.header}>
			<GoogleAuthButton
				isSignedIn={isSignedIn}
				onClick={isSignedIn ? signOut : signIn} // Передача нужной функции в зависимости от состояния
			></GoogleAuthButton>
			{isSignedIn && userInfo && (
				<div className={styles.header__user}>
					<h3 className={styles['header__user-name']}>
						{userInfo.getName()}
					</h3>
					<h3 className={styles['header__user-email']}>
						{userInfo.getEmail()}
					</h3>
				</div>
			)}
		</header>
	);
};

export default Header;
