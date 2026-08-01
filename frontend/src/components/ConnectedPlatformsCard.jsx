import styles from "../pages/Dashboard.module.css";

const ConnectedPlatformsCard = ({ platforms }) => {

  const connected = [
    { name: "GitHub", connected: platforms?.github },
    { name: "LeetCode", connected: platforms?.leetcode },
    { name: "Codeforces", connected: platforms?.codeforces },
    { name: "CodeChef", connected: platforms?.codechef },
    { name: "GeeksforGeeks", connected: platforms?.gfg },
  ];

  const totalConnected = connected.filter(
    (platform) => platform.connected
  ).length;

  return (
    <div className={styles.summaryCard}>
      <h3>🔗 Connected Platforms</h3>

      <p>
        {totalConnected} / {connected.length} Connected
      </p>

      <ul className={styles.platformList}>
        {connected.map((platform) => (
          <li key={platform.name}>
            {platform.connected ? "✅" : "❌"} {platform.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectedPlatformsCard;