"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, CircleDashed, Loader2, XCircle, AlertTriangle } from "lucide-react";

interface AgentCardProps {
  name: string;
  role: string;
  status: string;
  icon: React.ReactNode;
}

const shakeVariants = {
  shake: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

export function AgentCard({ name, role, status, icon }: AgentCardProps) {
  const isRunning   = status === "Running"   || status === "Planning";
  const isCompleted = status === "Completed";
  const isFailed    = status === "Failed";
  const isWaiting   = status === "Waiting";

  /* ── border / shadow state ── */
  let borderClass  = "border-white/[0.05]";
  let shadowClass  = "";
  let bgClass      = "bg-white/[0.02]";

  if (isRunning) {
    borderClass = "border-[#5B5CF6]/40";
    shadowClass = "shadow-[0_0_24px_rgba(91,92,246,0.18)]";
    bgClass     = "bg-[#5B5CF6]/[0.03]";
  } else if (isCompleted) {
    borderClass = "border-[#22C55E]/25";
    shadowClass = "shadow-[0_0_20px_rgba(34,197,94,0.12)]";
    bgClass     = "bg-[#22C55E]/[0.02]";
  } else if (isFailed) {
    borderClass = "border-[#EF4444]/30";
    shadowClass = "shadow-[0_0_20px_rgba(239,68,68,0.1)]";
    bgClass     = "bg-[#EF4444]/[0.02]";
  } else if (isWaiting) {
    borderClass = "border-[#FACC15]/20";
    bgClass     = "bg-[#FACC15]/[0.01]";
  }

  /* ── badge ── */
  let badgeClass = "bg-white/[0.04] text-[#71717A] border-white/[0.06]";
  if (isRunning)   badgeClass = "bg-[#5B5CF6]/10 text-[#5B5CF6] border-[#5B5CF6]/20";
  if (isCompleted) badgeClass = "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20";
  if (isFailed)    badgeClass = "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
  if (isWaiting)   badgeClass = "bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20";

  /* ── icon wrapper ── */
  let iconBg = "bg-white/[0.04] border-white/[0.06] text-[#71717A]";
  if (isRunning)   iconBg = "bg-[#5B5CF6]/10 border-[#5B5CF6]/20 text-[#5B5CF6]";
  if (isCompleted) iconBg = "bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]";
  if (isFailed)    iconBg = "bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]";

  const executionTime = isCompleted ? "1.2s" : isRunning ? "..." : "—";
  const confidence    = isCompleted ? "98%" : "—";

  return (
    <motion.div
      variants={isFailed ? shakeVariants : undefined}
      animate={isFailed ? "shake" : undefined}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`relative ${bgClass} backdrop-blur-[20px] border ${borderClass} ${shadowClass} rounded-[18px] p-6 flex flex-col gap-4 cursor-default transition-colors duration-300`}
    >
      {/* Running: animated border ring */}
      {isRunning && (
        <motion.div
          className="absolute inset-0 rounded-[18px] border border-[#5B5CF6]/30 pointer-events-none"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Header row */}
      <div className="flex items-start justify-between">
        {/* Icon + name */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={isRunning ? { rotate: [0, 8, -8, 0] } : {}}
            transition={isRunning ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
            className={`p-2.5 rounded-xl border ${iconBg} flex items-center justify-center shrink-0`}
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-[#FAFAFA]">{name}</h3>
            <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-widest mt-0.5">{role}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badgeClass} shrink-0`}>
          {isRunning   && <Loader2   className="size-3 animate-spin" />}
          {isCompleted && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <CheckCircle2 className="size-3" />
            </motion.div>
          )}
          {isFailed    && <XCircle   className="size-3" />}
          {isWaiting   && <AlertTriangle className="size-3" />}
          {!isRunning && !isCompleted && !isFailed && !isWaiting && <CircleDashed className="size-3" />}
          <span>{isRunning ? "Working..." : status}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/20 border border-white/[0.04] p-3 rounded-xl">
          <p className="text-[9px] text-[#71717A] uppercase tracking-widest font-bold mb-1">Duration</p>
          <p className="text-xs font-semibold text-[#FAFAFA] font-mono">{executionTime}</p>
        </div>
        <div className="bg-black/20 border border-white/[0.04] p-3 rounded-xl">
          <p className="text-[9px] text-[#71717A] uppercase tracking-widest font-bold mb-1">Confidence</p>
          <p className="text-xs font-semibold text-[#FAFAFA] font-mono">{confidence}</p>
        </div>
      </div>

      {/* Running progress indicator */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#5B5CF6] to-transparent rounded-full origin-left"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
