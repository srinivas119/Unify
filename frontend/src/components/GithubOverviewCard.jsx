import React from "react";
import styles from "../pages/Dashboard.module.css";
import { Github, GitCommit, Code, LayoutList } from "lucide-react";

const GithubOverviewCard = ({ github, platform }) => {
  const isConnected = platform?.connected;
  const username = platform?.username || "Not Connected";

  // If we have languages, let's pick the top 3
  let topLanguages = [];
  if (github?.languages && typeof github.languages === "object") {
    topLanguages = Object.entries(github.languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([lang]) => lang);
  }

  return (
    <div className={`${styles.card} flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 m-0">
            <Github className="w-6 h-6 text-slate-100" /> GitHub
          </h2>
          <p className="text-slate-400 text-sm mt-1">{username}</p>
        </div>
        {isConnected && (
          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30">
            Active
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
          <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1 uppercase tracking-wider">
            <LayoutList className="w-3.5 h-3.5" /> Repos
          </p>
          <p className="text-xl font-semibold text-slate-200">
            {github?.repositories || 0}
          </p>
        </div>
        
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
          <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-1 uppercase tracking-wider">
            <GitCommit className="w-3.5 h-3.5" /> Commits
          </p>
          <p className="text-xl font-semibold text-slate-200">
            {github?.commits || 0}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-2 uppercase tracking-wider">
          <Code className="w-3.5 h-3.5" /> Top Languages
        </p>
        <div className="flex flex-wrap gap-2">
          {topLanguages.length > 0 ? (
            topLanguages.map((lang, idx) => (
              <span key={idx} className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-500/20">
                {lang}
              </span>
            ))
          ) : (
            <span className="text-slate-500 text-xs italic">No data</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GithubOverviewCard;
