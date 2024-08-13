import styles from './Header.module.css';

const Header = ({
  handleAuthClick,
  handleSignoutClick,
  gisInited,
  isSignedIn,
  userInfo,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.header__actions}>
        <button onClick={handleAuthClick} disabled={!gisInited || isSignedIn}>
          signIn
        </button>
        <button onClick={handleSignoutClick} disabled={!isSignedIn}>
          signOut
        </button>
      </div>
      {userInfo && (
        <div>
          <h3>{userInfo.name}</h3>
          <h3>{userInfo.email}</h3>
        </div>
      )}
    </header>
  );
};

export default Header;
