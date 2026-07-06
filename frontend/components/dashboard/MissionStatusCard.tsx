"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, Users, Brain } from "lucide-react";
import { useMission } from "@/context/MissionContext";

/* ─── Dynamic status label mapped to context state ─── */
const STATUS_LABELS: Record<string, string> = {
  Ready:      "System Idle",
  Planning:   "Planning Workflow...",
  Executing:  "Agents Executing...",
  Completed:  "Mission Complete",
  Failed:     "Mission Failed",
};

export function MissionStatusCard() {
  const { missionStatus, missionPlan, loading, agentStates } = useMission();

  const isActive  = missionStatus === "Planning" || missionStatus === "Executing";
  const isDone    = missionStatus === "Completed";
  const isFailed  = missionStatus === "Failed";

  /* status badge styling */
  let statusColor  = "text-[#71717A]";
  let statusBorder = "bg-white/[0.03] border-white/[0.06]";

  if (isActive) {
    statusColor  = "text-[#5B5CF6]";
    statusBorder = "bg-[#5B5CF6]/10 border-[#5B5CF6]/20";
  } else if (isDone) {
    statusColor  = "text-[#22C55E]";
    statusBorder = "bg-[#22C55E]/10 border-[#22C55E]/20";
  } else if (isFailed) {
    statusColor  = "text-[#EF4444]";
    statusBorder = "bg-[#EF4444]/10 border-[#EF4444]/20";
  }

  const statusLabel = STATUS_LABELS[missionStatus] ?? missionStatus;

  const activeAgentName = Object.entries(agentStates ?? {})
    .find(([, v]) => v === "Running")?.[0] ?? null;

  const stats = [
    {
      label: "Status",
      icon: Activity,
      content: (
        <motion.div
          key={missionStatus}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest truncate max-w-full ${statusColor} ${statusBorder}`}
        >
          {isActive && (
            <motion.span
              className="size-1.5 rounded-full bg-[#5B5CF6]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          {isDone && <span className="size-1.5 rounded-full bg-[#22C55E]" />}
          {statusLabel}
        </motion.div>
      ),
    },
    {
      label: "Active Agent",
      icon: Brain,
      content: (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAgentName ?? "none"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-wide truncate max-w-full ${
              activeAgentName
                ? "text-[#5B5CF6] bg-[#5B5CF6]/10 border-[#5B5CF6]/20"
                : "text-[#71717A] bg-white/[0.03] border-white/[0.06]"
            }`}
          >
            {activeAgentName ? `${activeAgentName} Agent` : "—"}
          </motion.div>
        </AnimatePresence>
      ),
    },
    {
      label: "Est. Runtime",
      icon: Clock,
      content: (
        <div className="inline-flex items-center px-3 py-1.5 rounded-lg border text-[10px] font-bold text-[#A1A1AA] bg-white/[0.03] border-white/[0.06] font-mono tracking-wide">
          {missionPlan ? missionPlan.estimated_time : "---"}
        </div>
      ),
    },
    {
      label: "Orion Workforce",
      icon: Users,
      content: (
        <div className="inline-flex items-center px-3 py-1.5 rounded-lg border text-[10px] font-bold text-[#5B5CF6] bg-[#5B5CF6]/[0.05] border-[#5B5CF6]/10 tracking-wide">
          4 Agents Ready
        </div>
      ),
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-[18px] relative overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col justify-between gap-3 p-4 bg-black/20 border border-white/[0.04] rounded-xl hover:border-white/[0.09] hover:bg-black/30 transition-all duration-200 cursor-default"
          >
            <div className="flex items-center gap-2 text-[#71717A]">
              <stat.icon className="size-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{stat.label}</span>
            </div>
            {stat.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
