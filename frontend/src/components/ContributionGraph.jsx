import { useState } from "react";
import styles from "../pages/Dashboard.module.css";
import { GitCommit, GitPullRequest, BookOpen, Users, AlertCircle } from "lucide-react";

const ContributionGraph = ({ username, githubData }) => {
  const [imageError, setImageError] = useState(false);

  if (!username) {
    return (
      <div className={styles.card}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <GitCommit className="text-blue-500" size={24} />
            GitHub Contribution Graph
          </h3>
        </div>
        <div
          className={styles.graph}
          style={{
            height: "auto",
            minHeight: "180px",
            padding: "30px",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          <AlertCircle className="text-slate-400" size={36} />
          <p className="text-slate-400 text-center font-medium">
            GitHub not connected yet.
          </p>
          <span className="text-xs text-slate-500 text-center">
            Connect your GitHub username in the Connected Platforms section above to view your contribution graph.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitCommit className="text-blue-500" size={26} />
            GitHub Contributions
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Activity for <span className="text-blue-400 font-semibold">@{username}</span>
          </p>
        </div>

        {githubData && (
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-2 flex items-center gap-2">
              <GitPullRequest size={14} className="text-blue-400" />
              <span className="text-slate-300">Contributions:</span>
              <strong className="text-white">{githubData.contributions || 0}</strong>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-2 flex items-center gap-2">
              <BookOpen size={14} className="text-purple-400" />
              <span className="text-slate-300">Repos:</span>
              <strong className="text-white">{githubData.repositories || 0}</strong>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-2 flex items-center gap-2">
              <Users size={14} className="text-green-400" />
              <span className="text-slate-300">Followers:</span>
              <strong className="text-white">{githubData.followers || 0}</strong>
            </div>
          </div>
        )}
      </div>

      <div
        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-x-auto flex justify-center items-center"
        style={{ minHeight: "200px" }}
      >
        {!imageError ? (
          <img
            src={`https://ghchart.rshah.org/3b82f6/${username}`}
            alt={`${username}'s GitHub Contribution Chart`}
            className="max-w-full h-auto min-w-[650px] filter drop-shadow"
            onError={() => setImageError(true)}
          />
        ) : (
          <iframe
            src={`https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=github-dark`}
            title={`${username}'s GitHub Activity Graph`}
            className="w-full h-[220px] border-0 rounded-xl"
          />
        )}
      </div>
    </div>
  );
};

export default ContributionGraph;