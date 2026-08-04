import styles from "../pages/Dashboard.module.css";
import { Trophy, Star, BarChart3, Flag } from "lucide-react";

const CodeforcesCard = ({ data }) => {
  return (
    <div className={styles.leetcodeCard}>
      <div className={styles.leetcodeHeader}>
        <h2>🔵 Codeforces</h2>
      </div>

      {/* Total Solved */}
      <div
        style={{
          textAlign: "center",
          margin: "25px 0",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            color: "#3B82F6",
            marginBottom: "8px",
          }}
        >
          {data.total}
        </h1>

        <p style={{ color: "#94A3B8" }}>
          Problems Solved
        </p>
      </div>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <Star
            size={22}
            color="#FACC15"
          />
          <h4>Rating</h4>
          <h2>{data.rating}</h2>
        </div>

        <div className={styles.statBox}>
          <BarChart3
            size={22}
            color="#22C55E"
          />
          <h4>Max Rating</h4>
          <h2>{data.maxRating}</h2>
        </div>

        <div className={styles.statBox}>
          <Flag
            size={22}
            color="#8B5CF6"
          />
          <h4>Rank</h4>
          <h2>{data.rank}</h2>
        </div>

        <div className={styles.statBox}>
          <Trophy
            size={22}
            color="#EF4444"
          />
          <h4>Contests</h4>
          <h2>{data.contests}</h2>
        </div>
      </div>
    </div>
  );
};

export default CodeforcesCard;
