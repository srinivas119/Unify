import { useState, useEffect, useMemo } from "react";
import styles from "../pages/Dashboard.module.css";
import { GitCommit, GitPullRequest, BookOpen, Users, AlertCircle, Palette, ExternalLink, Calendar } from "lucide-react";

// Theme definitions matching GitHub dark mode and popular custom palettes
const THEMES = {
  green: {
    name: "GitHub Green",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    levels: {
      0: { fill: "#161b22", border: "#21262d" },
      1: { fill: "#0e4429", border: "#165c36" },
      2: { fill: "#006d32", border: "#008a3f" },
      3: { fill: "#26a641", border: "#2cc14d" },
      4: { fill: "#39d353", border: "#46e962" },
    },
  },
  blue: {
    name: "Electric Blue",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    levels: {
      0: { fill: "#161b22", border: "#21262d" },
      1: { fill: "#0c2d6b", border: "#123c8a" },
      2: { fill: "#0050b3", border: "#0066e0" },
      3: { fill: "#1890ff", border: "#40a9ff" },
      4: { fill: "#69c0ff", border: "#91d5ff" },
    },
  },
  purple: {
    name: "Neon Purple",
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    levels: {
      0: { fill: "#161b22", border: "#21262d" },
      1: { fill: "#3b0764", border: "#581c87" },
      2: { fill: "#6b21a8", border: "#7e22ce" },
      3: { fill: "#a855f7", border: "#c084fc" },
      4: { fill: "#e879f9", border: "#f0abfc" },
    },
  },
  teal: {
    name: "Cyber Teal",
    badge: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    levels: {
      0: { fill: "#161b22", border: "#21262d" },
      1: { fill: "#064e3b", border: "#047857" },
      2: { fill: "#0d9488", border: "#14b8a6" },
      3: { fill: "#06b6d4", border: "#22d3ee" },
      4: { fill: "#67e8f9", border: "#a5f3fc" },
    },
  },
};

const getContributionLevel = (count) => {
  if (count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

const ContributionGraph = ({ username, githubData }) => {
  const [contributionDays, setContributionDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [themeKey, setThemeKey] = useState("green");
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const activeTheme = THEMES[themeKey] || THEMES.green;

  // Fetch & parse GitHub contribution calendar
  useEffect(() => {
    if (!username) return;

    let isMounted = true;
    setLoading(true);

    const fetchContributions = async () => {
      try {
        const response = await fetch(`https://ghchart.rshah.org/26a641/${username}`);
        if (!response.ok) throw new Error("Failed to fetch SVG chart");
        const svgText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const rects = doc.querySelectorAll("rect");

        const parsedDays = [];
        rects.forEach((rect) => {
          const date = rect.getAttribute("data-date");
          const score = parseInt(rect.getAttribute("data-score") || "0", 10);
          if (date) {
            parsedDays.push({ date, count: score });
          }
        });

        // Sort chronologically
        parsedDays.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (isMounted && parsedDays.length > 0) {
          setContributionDays(parsedDays);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Could not parse ghchart SVG, falling back to calendar generator:", err);
      }

      // Fallback: Generate past 365 days
      if (isMounted) {
        const days = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
          const d = new Date();
          d.setDate(today.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          days.push({ date: dateStr, count: 0 });
        }
        setContributionDays(days);
        setLoading(false);
      }
    };

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, [username]);

  // Transform flat array into 52+ weeks matrix (7 days per column: Sun=0..Sat=6)
  const { weeks, monthLabels, computedTotal } = useMemo(() => {
    if (!contributionDays || contributionDays.length === 0) {
      return { weeks: [], monthLabels: [], computedTotal: 0 };
    }

    const weeksList = [];
    let currentWeek = [];
    let totalSum = 0;

    // Pad first week if starting day is not Sunday
    const firstDate = new Date(contributionDays[0].date + "T00:00:00");
    const firstDayOfWeek = firstDate.getDay(); // 0 = Sun
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    contributionDays.forEach((item) => {
      totalSum += item.count;
      currentWeek.push(item);
      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksList.push(currentWeek);
    }

    // Extract Month Labels positioning
    const months = [];
    let lastMonth = -1;

    weeksList.forEach((week, weekIdx) => {
      // Find first non-null day in week
      const dayObj = week.find((d) => d !== null);
      if (dayObj) {
        const d = new Date(dayObj.date + "T00:00:00");
        const monthIdx = d.getMonth();
        if (monthIdx !== lastMonth) {
          const monthName = d.toLocaleDateString(undefined, { month: "short" });
          // Ensure at least 2 columns gap between labels
          if (months.length === 0 || weekIdx - months[months.length - 1].colIdx >= 3) {
            months.push({ name: monthName, colIdx: weekIdx });
            lastMonth = monthIdx;
          }
        }
      }
    });

    return { weeks: weeksList, monthLabels: months, computedTotal: totalSum };
  }, [contributionDays]);

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
            gap: "10px",
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

  // Grid SVG dimensions calculation
  const CELL_SIZE = 13;
  const CELL_GAP = 3.5;
  const STEP = CELL_SIZE + CELL_GAP;
  const LEFT_OFFSET = 34;
  const TOP_OFFSET = 26;

  const svgWidth = Math.max(840, LEFT_OFFSET + weeks.length * STEP + 10);
  const svgHeight = TOP_OFFSET + 7 * STEP + 10;

  const totalContributions = githubData?.contributions || computedTotal;

  return (
    <div className={styles.card}>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <GitCommit className="text-emerald-400 animate-pulse" size={26} />
              GitHub Contributions
            </h3>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2.5 py-1 rounded-full transition-all"
            >
              @{username}
              <ExternalLink size={12} />
            </a>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-500" />
            Showing activity over the past year
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex flex-wrap gap-2.5 text-xs">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl px-3.5 py-2 flex items-center gap-2 shadow-inner">
            <GitPullRequest size={15} className="text-emerald-400" />
            <span className="text-slate-400">Total:</span>
            <strong className="text-white font-bold text-sm">{totalContributions}</strong>
          </div>
          {githubData && (
            <>
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl px-3.5 py-2 flex items-center gap-2 shadow-inner">
                <BookOpen size={15} className="text-purple-400" />
                <span className="text-slate-400">Repos:</span>
                <strong className="text-white font-bold text-sm">{githubData.repositories || 0}</strong>
              </div>
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl px-3.5 py-2 flex items-center gap-2 shadow-inner">
                <Users size={15} className="text-blue-400" />
                <span className="text-slate-400">Followers:</span>
                <strong className="text-white font-bold text-sm">{githubData.followers || 0}</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Graph Grid Container */}
      <div className="w-full bg-[#0d1117] border border-slate-800/90 rounded-2xl p-4 sm:p-5 overflow-x-auto relative shadow-2xl">
        {loading ? (
          <div className="h-[140px] flex flex-col items-center justify-center gap-2 text-slate-400">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Loading contribution activity...</span>
          </div>
        ) : (
          <div className="min-w-[800px] flex justify-center">
            <svg
              width="100%"
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="max-w-full overflow-visible"
            >
              {/* Month Labels */}
              {monthLabels.map((m, idx) => (
                <text
                  key={`month-${idx}`}
                  x={LEFT_OFFSET + m.colIdx * STEP}
                  y={14}
                  fill="#8b949e"
                  fontSize="11"
                  fontFamily="sans-serif"
                  fontWeight="500"
                >
                  {m.name}
                </text>
              ))}

              {/* Day Labels */}
              <text x={18} y={TOP_OFFSET + 1 * STEP + 9} fill="#8b949e" fontSize="10" fontFamily="sans-serif" textAnchor="end">
                Mon
              </text>
              <text x={18} y={TOP_OFFSET + 3 * STEP + 9} fill="#8b949e" fontSize="10" fontFamily="sans-serif" textAnchor="end">
                Wed
              </text>
              <text x={18} y={TOP_OFFSET + 5 * STEP + 9} fill="#8b949e" fontSize="10" fontFamily="sans-serif" textAnchor="end">
                Fri
              </text>

              {/* Contribution Squares Grid */}
              {weeks.map((week, weekIdx) =>
                week.map((day, dayIdx) => {
                  if (!day) return null;
                  const level = getContributionLevel(day.count);
                  const styleConfig = activeTheme.levels[level];
                  const xPos = LEFT_OFFSET + weekIdx * STEP;
                  const yPos = TOP_OFFSET + dayIdx * STEP;

                  return (
                    <rect
                      key={`rect-${weekIdx}-${dayIdx}`}
                      x={xPos}
                      y={yPos}
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      rx={2.5}
                      ry={2.5}
                      fill={styleConfig.fill}
                      stroke={styleConfig.border}
                      strokeWidth={1}
                      className="transition-all duration-150 cursor-pointer hover:scale-125 hover:z-20 origin-center"
                      style={{ transformOrigin: `${xPos + CELL_SIZE / 2}px ${yPos + CELL_SIZE / 2}px` }}
                      onMouseEnter={(e) => {
                        const rect = e.target.getBoundingClientRect();
                        setHoveredDay(day);
                        setTooltipPos({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  );
                })
              )}
            </svg>
          </div>
        )}

        {/* Footer / Controls Section */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          {/* Theme Palette Switcher */}
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-slate-500" />
            <span className="text-[11px] text-slate-400 font-medium">Theme:</span>
            <div className="flex gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg">
              {Object.keys(THEMES).map((key) => (
                <button
                  key={key}
                  onClick={() => setThemeKey(key)}
                  title={THEMES[key].name}
                  className={`w-4 h-4 rounded-full transition-all ${
                    themeKey === key ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: THEMES[key].levels[3].fill }}
                />
              ))}
            </div>
          </div>

          {/* GitHub Legend */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  key={`legend-${level}`}
                  className="w-3 h-3 rounded-[2.5px] border"
                  style={{
                    backgroundColor: activeTheme.levels[level].fill,
                    borderColor: activeTheme.levels[level].border,
                  }}
                />
              ))}
            </div>
            <span className="text-slate-400">More</span>
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none bg-slate-900/95 border border-slate-700/80 text-xs text-white px-3 py-1.5 rounded-lg shadow-2xl backdrop-blur-md transform -translate-x-1/2 -translate-y-full -mt-2 transition-all duration-75"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="font-semibold text-emerald-400">
            {hoveredDay.count > 0
              ? `${hoveredDay.count} contribution${hoveredDay.count > 1 ? "s" : ""}`
              : "No contributions"}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {new Date(hoveredDay.date + "T00:00:00").toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionGraph;