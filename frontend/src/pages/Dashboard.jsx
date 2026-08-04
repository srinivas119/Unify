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
import DashboardSkeleton from "../components/DashboardSkeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";

const DashboardPage = () => {
  const { dashboard, loading, error, refetch } = useDashboard();

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <>
        <Navbar />
        <main className={`${styles.dashboard} flex items-center justify-center min-h-[calc(100vh-80px)]`}>
          <div className="bg-slate-900 border border-red-500/50 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full animate-slide-up">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
               <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-3">Dashboard Failed to Load</h2>
            <p className="text-slate-400 mb-8">{error}</p>
            <button 
              onClick={refetch}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" /> Try Again
            </button>
          </div>
        </main>
      </>
    );
  }

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
        <ContributionGraph
          username={dashboard.platforms?.github?.username}
          githubData={dashboard.github}
        />
      </main>
    </>
  );
};

export default DashboardPage;
