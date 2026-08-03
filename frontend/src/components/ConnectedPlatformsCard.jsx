import styles from "../pages/Dashboard.module.css";

const ConnectedPlatformsCard = ({ platforms }) => {
  const connected = [
    { name: "GitHub", value: platforms?.github },
    { name: "LeetCode", value: platforms?.leetcode },
    { name: "Codeforces", value: platforms?.codeforces },
    { name: "CodeChef", value: platforms?.codechef },
    { name: "GeeksforGeeks", value: platforms?.gfg },
  ];

  const totalConnected = connected.filter(
    (platform) => platform.value
  ).length;

  return (
    <div className={styles.summaryCard}>
      <h3>🔗 Connected Platforms</h3>

      <p>
        {totalConnected} / {connected.length} Connected
      </p>

      <div className={styles.platformStatusList}>
        {connected.map((platform) => (
          <div key={platform.name} className={styles.platformStatusItem}>
            <div>
              <strong>{platform.name}</strong>

              {platform.value && (
                <p className={styles.username}>
                  @{platform.value}
                </p>
              )}
            </div>

            <span
              className={
                platform.value
                  ? styles.connected
                  : styles.notConnected
              }
            >
              {platform.value ? "Connected" : "Not Connected"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedPlatformsCard;
