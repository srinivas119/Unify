import styles from "./Dashboard.module.css";
import Navbar from "../components/Navbar";
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
    <>
      <Navbar />

      <main className={styles.dashboard}>
        {/* ===== Top Cards ===== */}
        <section className={styles.topSection}>
          <WelcomeCard user={dashboard} />

          <ScoreCard score={dashboard.score} />

          <ConnectedPlatformsCard
            platforms={dashboard.platforms}
          />
        </section>

        {/* ===== Total Coding Score ===== */}
        <QuickStats
          codingScore={dashboard.codingScore}
        />

        {/* ===== Platform Cards ===== */}
        <section className={styles.platformGrid}>
          <LeetCodeCard data={dashboard.leetcode} />

          <CodeChefCard data={dashboard.codechef} />

          <CodeforcesCard data={dashboard.codeforces} />

          <GeeksforGeeksCard
            data={dashboard.geeksforgeeks}
          />
        </section>

        {/* ===== Contribution Graph ===== */}
        <ContributionGraph />
      </main>
    </>
  );
};

export default DashboardPage;
