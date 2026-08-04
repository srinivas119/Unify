import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { Edit2, CheckCircle, XCircle, Loader2 } from "lucide-react";

const platformConfig = [
  { id: "leetcode", name: "LeetCode", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  { id: "github", name: "GitHub", color: "text-slate-100", bg: "bg-slate-800", border: "border-slate-600" },
  { id: "codeforces", name: "Codeforces", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
  { id: "codechef", name: "CodeChef", color: "text-orange-600", bg: "bg-orange-600/10", border: "border-orange-600/30" },
  { id: "gfg", name: "GeeksforGeeks", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" }
];

const PlatformCard = ({ platform, connectionData, statsData, onUpdate }) => {
  const isConnected = !!connectionData[`${platform.id}_connected`];
  const currentUsername = connectionData[`${platform.id}_username`] || "";
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentUsername);
  const [isSaving, setIsSaving] = useState(false);
  
  const { success, error } = useToast();

  const handleSave = async () => {
    if (!editValue.trim()) {
      error("Invalid Input", "Username cannot be empty.");
      return;
    }
    
    setIsSaving(true);
    try {
      await onUpdate(platform.id, editValue.trim());
      success("Platform Connected", `Successfully verified ${platform.name} account.`);
      setIsEditing(false);
    } catch (err) {
      error("Connection Failed", err.response?.data?.message || "Invalid Username or Server Error");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStats = () => {
    if (!isConnected || !statsData) return null;
    
    // Extract generic stats for display
    let solved = 0;
    let rank = "-";
    
    if (platform.id === "leetcode") {
      solved = statsData.leetcode_solved || 0;
      rank = statsData.leetcode_ranking || "-";
    } else if (platform.id === "codeforces") {
      solved = statsData.codeforces_total || 0;
      rank = statsData.codeforces_rating || "-";
    } else if (platform.id === "codechef") {
      solved = statsData.codechef_total || 0;
      rank = statsData.codechef_rating || "-";
    } else if (platform.id === "gfg") {
      solved = statsData.gfg_total || 0;
      rank = statsData.gfg_score || "-";
    } else if (platform.id === "github") {
      solved = statsData.github_repositories || 0; // use repos for "solved" generic spot
      rank = statsData.github_followers || "-"; // use followers
    }

    return (
      <div className="flex justify-between text-sm mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider">{platform.id === 'github' ? 'Repositories' : 'Problems Solved'}</p>
          <p className="font-semibold text-slate-200 mt-1">{solved}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs uppercase tracking-wider">{platform.id === 'github' ? 'Followers' : 'Ranking / Rating'}</p>
          <p className="font-semibold text-slate-200 mt-1">{rank}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col transition-all hover:border-slate-600">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-3 px-3 py-1.5 rounded-full border ${platform.bg} ${platform.border}`}>
          <span className={`font-bold text-sm ${platform.color}`}>{platform.name}</span>
        </div>
        
        {isConnected ? (
          <div className="flex items-center gap-1.5 text-green-500 text-sm font-semibold">
            <CheckCircle className="w-4 h-4" /> Connected
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
            <XCircle className="w-4 h-4" /> Not Connected
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1">
        {!isEditing ? (
          <div>
            <p className="text-slate-400 text-sm mb-1">Username</p>
            <p className="text-lg font-medium text-slate-200 truncate">{isConnected ? currentUsername : "---"}</p>
            {renderStats()}
          </div>
        ) : (
          <div className="mt-2">
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder={`Enter ${platform.name} username`}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-slate-700 flex justify-end gap-2">
        {!isEditing ? (
          <button 
            onClick={() => {
              setEditValue(currentUsername);
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
             {isConnected ? <><Edit2 className="w-4 h-4" /> Edit Username</> : "Connect Account"}
          </button>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Save"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const PlatformConnection = () => {
  const [connections, setConnections] = useState({});
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { error } = useToast();

  const fetchPlatforms = async () => {
    try {
      const res = await api.get("/platforms");
      if (res.data.success) {
        setConnections(res.data.data || {});
        setStats(res.data.stats || {});
      }
    } catch (err) {
      error("Data Load Failed", "Could not fetch platform connections.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handlePlatformUpdate = async (platformId, username) => {
    // Calling the new singular update API
    const res = await api.post("/platforms/update", { platform: platformId, username });
    if (res.data.success) {
      // Refresh all stats
      await fetchPlatforms();
      return true;
    }
    throw new Error("Update failed");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Platform Connections</h1>
          <p className="text-slate-400 mt-2 text-lg">Connect your coding profiles to aggregate your statistics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformConfig.map((p) => (
            <PlatformCard 
              key={p.id}
              platform={p}
              connectionData={connections}
              statsData={stats}
              onUpdate={handlePlatformUpdate}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default PlatformConnection;
