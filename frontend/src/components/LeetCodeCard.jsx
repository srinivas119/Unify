import styles from "../pages/Dashboard.module.css";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const LeetCodeCard = ({ data }) => {
  const totalQuestions = 3600;
  const solved = data.total;

  return (
    <div className={styles.leetcodeCard}>
      <div className={styles.leetcodeHeader}>
        <h2>🟡 LeetCode</h2>
      </div>

      <div className={styles.circleContainer}>
        <div className={styles.circle}>
          <CircularProgressbar
            value={(solved / totalQuestions) * 100}
            text={`${solved}`}
            styles={buildStyles({
              textColor: "#000",
              pathColor: "#FFA116",
              trailColor: "#ECECEC",
              textSize: "18px",
            })}
          />
        </div>

        <p className={styles.totalText}>
          {solved} / {totalQuestions}
        </p>
      </div>

      {/* Easy */}

      <div className={styles.progressItem}>
        <div className={styles.progressLabel}>
          <span className={styles.easy}>Easy</span>
          <span>{data.easy}</span>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.easyFill}
            style={{
              width: `${(data.easy / 890) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Medium */}

      <div className={styles.progressItem}>
        <div className={styles.progressLabel}>
          <span className={styles.medium}>Medium</span>
          <span>{data.medium}</span>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.mediumFill}
            style={{
              width: `${(data.medium / 1880) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Hard */}

      <div className={styles.progressItem}>
        <div className={styles.progressLabel}>
          <span className={styles.hard}>Hard</span>
          <span>{data.hard}</span>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.hardFill}
            style={{
              width: `${(data.hard / 830) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className={styles.leetcodeFooter}>
        <div>
          <h4>Acceptance</h4>
          <p>{data.acceptance}</p>
        </div>

        

        <div>
          <h4>Ranking</h4>
          <p>{data.ranking}</p>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeCard;
