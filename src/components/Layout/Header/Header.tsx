import React from 'react';
import styles from './Header.module.css';
import { useAuth } from '../../../context/useAuth';

const Header: React.FC = () => {
	const { isSignedIn, userInfo, signIn, signOut } = useAuth();

	return (
		<header className={styles.header}>
			<div className={styles.header__actions}>
				{!isSignedIn ? (
					<button onClick={signIn} disabled={isSignedIn}>
						Sign In
					</button>
				) : (
					<button onClick={signOut} disabled={!isSignedIn}>
						Sign Out
					</button>
				)}
			</div>
			{isSignedIn && userInfo && (
				<div className={styles.userInfo}>
					<h3>{userInfo.getName()}</h3>
					<h3>{userInfo.getEmail()}</h3>
				</div>
			)}
		</header>
	);
};

export default Header;
