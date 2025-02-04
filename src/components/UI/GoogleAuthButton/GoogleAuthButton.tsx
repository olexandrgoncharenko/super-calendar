import React from 'react';
import styles from './GoogleAuthButton.module.css';

interface GoogleAuthButtonProps {
	isSignedIn: boolean;
	onClick: () => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
	isSignedIn,
	onClick,
}) => (
	<button onClick={onClick} className={styles.button}>
		<div className={styles.button__inner}>
			<div
				className={styles.button__logo}
				style={{ backgroundImage: `url(/images/google.svg)` }}
			></div>
			<div className={styles.button__text}>
				{isSignedIn ? 'Выйти с Google' : 'Войти через Google'}
			</div>
		</div>
	</button>
);

export default GoogleAuthButton;
// import React from 'react';
// import styles from './GoogleAuthButton.module.css';

// // import useGAuth from '../../../hooks/useAuth';

// interface GoogleAuthButtonProps {
// 	isSignedIn: boolean;
// 	onClick: () => void;
// 	// onClick: () => void;
// }

// const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = (props) => {
// 	const { isSignedIn, onClick } = props;

// 	const handleAuth = () => {
// 		onClick();
// 	};

// 	return (
// 		<button onClick={handleAuth} className={styles.button}>
// 			<div className={styles.button__inner}>
// 				<div
// 					className={styles.button__logo}
// 					style={{ backgroundImage: `url(/images/google.svg)` }}
// 				></div>
// 				<div className={styles.button__text}>
// 					{isSignedIn ? 'Выйти с Google' : 'Войти через Google'}
// 				</div>
// 			</div>
// 		</button>
// 	);
// };

// export default GoogleAuthButton;
