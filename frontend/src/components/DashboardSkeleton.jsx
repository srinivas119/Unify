import React from "react";
import styles from "../pages/Dashboard.module.css";
import Navbar from "./Navbar";

const DashboardSkeleton = () => {
  return (
    <>
      <Navbar />
      <main className={styles.dashboard}>
        {/* ===== Top Cards ===== */}
        <section className={styles.topSection}>
          <div className={`${styles.card} animate-pulse min-h-[300px]`}>
            <div className="h-8 bg-slate-700 rounded w-1/2 mb-6"></div>
            <div className="h-6 bg-slate-800 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-slate-800 rounded w-2/3"></div>
          </div>

          <div className={`${styles.card} animate-pulse min-h-[300px] flex flex-col justify-center items-center`}>
            <div className="h-10 bg-slate-700 rounded-full w-24 mb-6"></div>
            <div className="h-8 bg-slate-800 rounded w-1/2"></div>
          </div>

          <div className={`${styles.card} animate-pulse min-h-[300px]`}>
            <div className="h-8 bg-slate-700 rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 bg-slate-800 rounded-lg w-full"></div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Total Coding Score ===== */}
        <div className={`${styles.card} animate-pulse py-12`}>
           <div className="flex flex-col items-center justify-center">
              <div className="h-16 bg-slate-700 rounded-full w-32 mb-4"></div>
              <div className="h-6 bg-slate-800 rounded w-48"></div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-12 px-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-slate-800 rounded-lg w-full"></div>
              ))}
           </div>
        </div>

        {/* ===== Platform Cards ===== */}
        <section className={styles.platformGrid}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`${styles.card} animate-pulse min-h-[350px]`}>
              <div className="flex justify-between items-center mb-8">
                 <div className="h-8 bg-slate-700 rounded w-1/3"></div>
                 <div className="h-8 w-8 bg-slate-800 rounded-full"></div>
              </div>
              <div className="space-y-6">
                <div className="h-6 bg-slate-800 rounded w-1/2"></div>
                <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                <div className="h-6 bg-slate-800 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </section>

        {/* ===== Contribution Graph ===== */}
        <div className={`${styles.card} animate-pulse h-[220px]`}>
           <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
           <div className="h-32 bg-slate-800 rounded-lg w-full"></div>
        </div>
      </main>
    </>
  );
};

export default DashboardSkeleton;
