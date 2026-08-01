import styles from "./Dashboard.module.css";

import useDashboard from "../hooks/useDashboard";
import ConnectedPlatformsCard from "../components/ConnectedPlatformsCard";
import WelcomeCard from "../components/WelcomeCard";
import ScoreCard from "../components/ScoreCard";
import QuickStats from "../components/QuickStats";
import LeetCodeCard from "../components/LeetCodeCard";
import CodeChefCard from "../components/CodeChefCard";
import CodeforcesCard from "../components/CodeforcesCard";
import GeeksforGeeksCard from "../components/GeeksforGeeksCard";
import ContributionGraph from "../components/ContributionGraph";

const DashboardPage = () => {
  const { dashboard, loading } = useDashboard();

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.topSection}>
        <WelcomeCard user={dashboard} />

        <ScoreCard score={dashboard.score} />
      
  <ConnectedPlatformsCard
    platforms={dashboard.platforms}
/>
      </div>

      <QuickStats codingScore={dashboard.codingScore} />

    <div className={styles.platformGrid}>
  <LeetCodeCard data={dashboard.leetcode} />

  <CodeChefCard data={dashboard.codechef} />

  <CodeforcesCard data={dashboard.codeforces} />

  <GeeksforGeeksCard data={dashboard.geeksforgeeks} />
</div>

      <ContributionGraph />
    </div>
  );
};

export default DashboardPage;