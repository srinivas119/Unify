// src/features/dashboard/components/ScoreCard.jsx

import styles from "../pages/Dashboard.module.css";

const ScoreCard = ({ score }) => {
  return (
    <div className={styles.card}>
      <h3>Universal Score</h3>

      <p>
  <strong>Status:</strong> Active
</p>

<p>
  <strong>Rank:</strong> Beginner
</p>
    </div>
  );
};

export default ScoreCard;