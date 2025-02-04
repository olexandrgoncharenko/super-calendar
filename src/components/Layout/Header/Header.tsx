import React from 'react';
import styles from './Header.module.css';
import GoogleAuthButton from '../../UI/GoogleAuthButton/GoogleAuthButton';
import { useGoogleAuth } from '../../../context/useGoogleAuth';

const Header: React.FC = () => {
	const { isSignedIn, handleLogout, isGoogleApiLoaded, signIn, user } =
		useGoogleAuth();

	return (
		<header className={styles.header}>
			{isGoogleApiLoaded && (
				<GoogleAuthButton
					isSignedIn={isSignedIn}
					onClick={isSignedIn ? handleLogout : signIn}
				/>
			)}

			{isSignedIn && user && (
				<div className={styles.header__user}>
					<h3 className={styles['header__user-name']}>{user.name}</h3>
					<h3 className={styles['header__user-email']}>
						{user.email}
					</h3>
				</div>
			)}
		</header>
	);
};

export default Header;
