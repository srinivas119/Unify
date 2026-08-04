import styles from "../pages/Dashboard.module.css";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const GeeksforGeeksCard = ({ data }) => {
  return (
    <div className={styles.leetcodeCard}>
      <div className={styles.leetcodeHeader}>
        <h2>🟢 GeeksforGeeks</h2>
      </div>

      <div className={styles.circleContainer}>
        <div className={styles.circle}>
          <CircularProgressbar
            value={(data.total / 700) * 100}
            text={`${data.total}`}
            styles={buildStyles({
              pathColor: "#16a34a",
              trailColor: "#e5e7eb",
              textColor: "#111827",
            })}
          />
        </div>

        <p className={styles.totalText}>{data.total} / 700</p>
      </div>

      <div className={styles.progressItem}>
        <div className={styles.progressLabel}>
          <span className={styles.easy}>Easy</span>
          <span>{data.easy}</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.easyFill}
            style={{ width: `${(data.easy / data.total) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.progressItem}>
        <div className={styles.progressLabel}>
          <span className={styles.medium}>Medium</span>
          <span>{data.medium}</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.mediumFill}
            style={{ width: `${(data.medium / data.total) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.progressItem}>
        <div className={styles.progressLabel}>
          <span className={styles.hard}>Hard</span>
          <span>{data.hard}</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.hardFill}
            style={{ width: `${(data.hard / data.total) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.leetcodeFooter}>
       

        <div>
          <h4>Total</h4>
          <p>{data.total}</p>
        </div>
      </div>
    </div>
  );
};

export default GeeksforGeeksCard;
