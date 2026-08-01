import styles from "../pages/Dashboard.module.css";

const WelcomeCard = ({ user }) => {

  if (!user) {
    return (
      <div className={styles.card}>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h4>Welcome Back 👋</h4>

      <h2>{user.username}</h2>

      <p>Keep coding, keep growing! 🚀</p>
    </div>
  );
};

export default WelcomeCard;