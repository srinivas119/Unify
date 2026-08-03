import styles from "../pages/Dashboard.module.css";

const ConnectedPlatformsCard = ({ platforms }) => {
  const connected = [
    {
      name: "GitHub",
      data: platforms?.github,
    },
    {
      name: "LeetCode",
      data: platforms?.leetcode,
    },
    {
      name: "Codeforces",
      data: platforms?.codeforces,
    },
    {
      name: "CodeChef",
      data: platforms?.codechef,
    },
    {
      name: "GeeksforGeeks",
      data: platforms?.gfg,
    },
  ];

  const totalConnected = connected.filter(
    (platform) => platform.data?.connected
  ).length;

  return (
    <div className={styles.summaryCard}>
      <h3>🔗 Connected Platforms</h3>

      <p>
        {totalConnected} / {connected.length} Connected
      </p>

      <div className={styles.platformStatusList}>
        {connected.map((platform) => (
          <div
            key={platform.name}
            className={styles.platformStatusItem}
          >
            <div>
              <strong>{platform.name}</strong>

              {platform.data?.connected && (
                <p className={styles.username}>
                  @{platform.data.username}
                </p>
              )}
            </div>

            <span
              className={
                platform.data?.connected
                  ? styles.connected
                  : styles.notConnected
              }
            >
              {platform.data?.connected
                ? "🟢 Connected"
                : "🔴 Not Connected"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedPlatformsCard;
