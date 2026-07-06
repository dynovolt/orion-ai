"use client";

import { Info, Clock, Users, Activity } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export function MissionStatusCard() {
  const { missionStatus, missionPlan } = useMission();

  let statusColor = "text-zinc-400";
  let statusBadgeColor = "bg-zinc-800/50 border-zinc-700/50";
  
  if (missionStatus === "Planning" || missionStatus === "Executing") {
    statusColor = "text-blue-400";
    statusBadgeColor = "bg-blue-500/10 border-blue-500/20";
  } else if (missionStatus === "Completed") {
    statusColor = "text-emerald-400";
    statusBadgeColor = "bg-emerald-500/10 border-emerald-500/20";
  } else if (missionStatus === "Failed") {
    statusColor = "text-red-400";
    statusBadgeColor = "bg-red-500/10 border-red-500/20";
  }

  const stats = [
    { 
      label: "Mission Status", 
      value: missionStatus, 
      icon: Activity, 
      badgeClass: `${statusColor} ${statusBadgeColor}`
    },
    { 
      label: "Active Objective", 
      value: missionPlan ? (missionPlan.objective.length > 25 ? missionPlan.objective.substring(0, 25) + "..." : missionPlan.objective) : "System Idle", 
      icon: Info, 
      badgeClass: "text-zinc-200 bg-white/5 border-white/5" 
    },
    { 
      label: "Est. Runtime", 
      value: missionPlan ? missionPlan.estimated_time : "---", 
      icon: Clock, 
      badgeClass: "text-zinc-300 bg-white/5 border-white/5" 
    },
    { 
      label: "Orion Workforce", 
      value: "4 Agents Ready", 
      icon: Users, 
      badgeClass: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10" 
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden shadow-lg border-white/[0.08] z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col justify-between gap-3 p-4 bg-black/20 border border-white/[0.04] rounded-xl hover:border-white/[0.08] hover:bg-black/30 transition-all duration-300">
            <div className="flex items-center gap-2 text-zinc-500">
              <stat.icon className="size-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-semibold self-start tracking-wide truncate max-w-full ${stat.badgeClass}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
