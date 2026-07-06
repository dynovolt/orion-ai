"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Loader2, XCircle, AlertTriangle } from "lucide-react";

interface AgentCardProps {
  name: string;
  role: string;
  status: string;
  icon: React.ReactNode;
}

export function AgentCard({ name, role, status, icon }: AgentCardProps) {
  let borderStyle = "border-white/[0.05]";
  let shadowStyle = "shadow-lg shadow-black/10";
  let statusBadgeStyle = "bg-zinc-800/80 text-zinc-400 border-zinc-700/50";
  let iconGlowStyle = "bg-white/5 border-white/10 text-zinc-300";
  let cardGlowOverlay = null;

  if (status === "Running" || status === "Planning") {
    borderStyle = "border-[#5B5CF6]/30 shadow-[0_0_20px_rgba(91,92,246,0.15)] bg-[#5B5CF6]/[0.02]";
    statusBadgeStyle = "bg-[#5B5CF6]/10 text-[#5B5CF6] border-[#5B5CF6]/20 shadow-[0_0_8px_rgba(91,92,246,0.1)]";
    iconGlowStyle = "bg-[#5B5CF6]/10 border-[#5B5CF6]/20 text-[#5B5CF6] animate-pulse";
    cardGlowOverlay = (
      <div className="absolute inset-0 border border-[#5B5CF6]/30 rounded-[18px] pointer-events-none animate-pulse" />
    );
  } else if (status === "Completed") {
    borderStyle = "border-emerald-500/20 shadow-[0_0_25px_rgba(34,197,94,0.12)] bg-emerald-500/[0.01]";
    statusBadgeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]";
    iconGlowStyle = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  } else if (status === "Failed") {
    borderStyle = "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)] bg-red-500/[0.01]";
    statusBadgeStyle = "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]";
    iconGlowStyle = "bg-red-500/10 border-red-500/20 text-red-400";
  } else if (status === "Waiting") {
    borderStyle = "border-amber-500/20 bg-amber-500/[0.01]";
    statusBadgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]";
    iconGlowStyle = "bg-amber-500/10 border-amber-500/20 text-amber-400";
  } else if (status === "Ready") {
    borderStyle = "border-white/[0.05]";
    statusBadgeStyle = "bg-zinc-800/80 text-zinc-500 border-zinc-700/50";
    iconGlowStyle = "bg-white/5 border-white/10 text-zinc-400";
  }

  // Dynamic visual helper metrics mapping
  const executionTime = status === "Completed" ? "1.2s" : status === "Running" || status === "Planning" ? "..." : "0.0s";
  const confidence = status === "Completed" ? "98%" : "---";

  return (
    <div className={`relative bg-white/[0.02] backdrop-blur-[20px] ${borderStyle} ${shadowStyle} rounded-[18px] p-6 flex flex-col justify-between hover:-translate-y-[2px] hover:border-white/[0.12] transition-all duration-200 group`}>
      {cardGlowOverlay}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[18px]"></div>
      
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className={`p-2.5 rounded-xl border transition-colors shadow-inner flex items-center justify-center shrink-0 ${iconGlowStyle}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-[#FAFAFA]">{name}</h3>
            <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mt-0.5">{role}</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusBadgeStyle} shrink-0`}>
          {status === "Running" || status === "Planning" ? (
            <Loader2 className="size-3 animate-spin" />
          ) : status === "Completed" ? (
            <CheckCircle2 className="size-3" />
          ) : status === "Failed" ? (
            <XCircle className="size-3" />
          ) : status === "Waiting" ? (
            <AlertTriangle className="size-3" />
          ) : (
            <CircleDashed className="size-3" />
          )}
          <span>{status}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-1 relative z-10">
        <div className="bg-[#111113]/40 border border-white/[0.04] p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[9px] text-[#71717A] uppercase tracking-widest font-bold mb-1">Duration</span>
          <span className="text-xs font-semibold text-[#FAFAFA] font-mono">{executionTime}</span>
        </div>
        <div className="bg-[#111113]/40 border border-white/[0.04] p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[9px] text-[#71717A] uppercase tracking-widest font-bold mb-1">Confidence</span>
          <span className="text-xs font-semibold text-[#FAFAFA] font-mono">{confidence}</span>
        </div>
      </div>
    </div>
  );
}
