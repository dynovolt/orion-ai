"use client";

import { CheckCircle2, CircleDashed, Loader2, XCircle, AlertTriangle } from "lucide-react";

interface AgentCardProps {
  name: string;
  role: string;
  status: string;
  icon: React.ReactNode;
}

export function AgentCard({ name, role, status, icon }: AgentCardProps) {
  let StatusIcon = CircleDashed;
  let statusBadgeStyles = "bg-zinc-800/80 text-zinc-400 border-zinc-700/50";
  let bgBorderGlow = "border-white/[0.08]";
  let pulseIcon = "";

  if (status === "Running") {
    StatusIcon = Loader2;
    statusBadgeStyles = "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.1)]";
    bgBorderGlow = "border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.08)] bg-blue-500/[0.02]";
    pulseIcon = "animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.3)] border-blue-500/30";
  } else if (status === "Completed") {
    StatusIcon = CheckCircle2;
    statusBadgeStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]";
    bgBorderGlow = "border-emerald-500/15 bg-emerald-500/[0.01]";
  } else if (status === "Failed") {
    StatusIcon = XCircle;
    statusBadgeStyles = "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]";
    bgBorderGlow = "border-red-500/20 bg-red-500/[0.01]";
  } else if (status === "Waiting") {
    StatusIcon = AlertTriangle;
    statusBadgeStyles = "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]";
    bgBorderGlow = "border-amber-500/15 bg-amber-500/[0.01]";
  } else if (status === "Ready") {
    // Treat Ready as Waiting/amber for backend status
    StatusIcon = CircleDashed;
    statusBadgeStyles = "bg-zinc-800/80 text-zinc-500 border-zinc-700/50";
    bgBorderGlow = "border-white/[0.06]";
  }

  // Mocks for premium metadata
  const executionTime = status === "Completed" ? "1.2s" : status === "Running" ? "..." : "---";
  const confidence = status === "Completed" ? "98.5%" : "---";

  return (
    <div className={`glass-card p-6 rounded-2xl ${bgBorderGlow} flex flex-col justify-between relative overflow-hidden group shadow-lg shadow-black/20 hover:shadow-black/40 hover:-translate-y-0.5 transition-all duration-300`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 bg-white/5 rounded-xl border border-white/10 text-zinc-300 group-hover:text-zinc-50 transition-colors shadow-inner ${pulseIcon}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-zinc-50">{name}</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{role}</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusBadgeStyles}`}>
          <StatusIcon className={`size-3 ${status === "Running" ? "animate-spin" : ""}`} />
          <span>{status}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-2 relative z-10">
        <div className="bg-black/25 rounded-xl p-3 border border-white/[0.04] flex flex-col justify-between">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Time</span>
          <span className="text-xs font-semibold text-zinc-300 font-mono">{executionTime}</span>
        </div>
        <div className="bg-black/25 rounded-xl p-3 border border-white/[0.04] flex flex-col justify-between">
          <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Confidence</span>
          <span className="text-xs font-semibold text-zinc-300 font-mono">{confidence}</span>
        </div>
      </div>
    </div>
  );
}
