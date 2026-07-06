"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMission } from "@/context/MissionContext";
import { downloadReportPdf } from "@/lib/api";
import {
  FileText, Download, Loader2, BarChart2, AlertTriangle,
  CheckCircle2, ChevronRight, Lightbulb, TrendingUp, Activity
} from "lucide-react";

/* ─── Section card ─── */
function ReportSection({
  icon: Icon,
  title,
  items,
  colorClass,
  borderClass,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
  colorClass: string;
  borderClass: string;
  delay?: number;
}) {
  if (!items || items.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className={`bg-black/20 border ${borderClass} rounded-xl p-5`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg ${colorClass}`}>
          <Icon className="size-3.5" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <ChevronRight className="size-3 text-[#71717A] mt-0.5 shrink-0" />
            <span className="text-xs text-[#A1A1AA] leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─── Skeleton block ─── */
function SkeletonBlock({ w = "full", h = 4 }: { w?: string; h?: number }) {
  return <div className={`skeleton w-${w} h-${h} rounded-lg`} />;
}

/* ─── Loading state ─── */
function ReportLoading({ missionStatus }: { missionStatus: string }) {
  const msgs: Record<string, string> = {
    Planning:  "Planner Building Execution Graph...",
    Executing: "Agents Executing — One by One...",
    Completed: "Finalizing Executive Report...",
  };
  return (
    <div className="flex flex-col h-full p-6 gap-6">
      {/* animated header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.05]">
        <div className="p-2 bg-[#5B5CF6]/10 rounded-xl border border-[#5B5CF6]/20">
          <Loader2 className="size-4 text-[#5B5CF6] animate-spin" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#FAFAFA]">Generating Report</h2>
          <motion.p
            key={missionStatus}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] text-[#71717A] mt-0.5"
          >
            {msgs[missionStatus] || "Processing..."}
          </motion.p>
        </div>
      </div>

      {/* Skeleton blocks */}
      <div className="space-y-3">
        <SkeletonBlock h={3} w="3/4" />
        <SkeletonBlock h={3} />
        <SkeletonBlock h={3} w="5/6" />
        <SkeletonBlock h={3} w="2/3" />
      </div>
      <div className="space-y-2">
        <SkeletonBlock h={2} w="1/3" />
        <SkeletonBlock h={2} w="full" />
        <SkeletonBlock h={2} w="4/5" />
        <SkeletonBlock h={2} w="full" />
        <SkeletonBlock h={2} w="3/4" />
      </div>
      <div className="space-y-2">
        <SkeletonBlock h={2} w="1/4" />
        <SkeletonBlock h={2} w="5/6" />
        <SkeletonBlock h={2} w="2/3" />
      </div>

      {/* pulse message */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-auto flex items-center gap-2 text-[11px] text-[#5B5CF6] font-semibold"
      >
        <span className="size-1.5 rounded-full bg-[#5B5CF6] shadow-[0_0_6px_rgba(91,92,246,0.6)]" />
        Agents executing sequentially...
      </motion.div>
    </div>
  );
}

/* ─── Onboarding (idle) ─── */
function ReportIdle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full text-center px-8 gap-6"
    >
      <div className="size-14 rounded-2xl bg-[#5B5CF6]/10 border border-[#5B5CF6]/20 flex items-center justify-center shadow-[0_0_24px_rgba(91,92,246,0.15)]">
        <FileText className="size-7 text-[#5B5CF6]" />
      </div>
      <div>
        <h3 className="text-base font-bold text-[#FAFAFA] tracking-tight">Executive Report</h3>
        <p className="text-xs text-[#71717A] mt-2 leading-relaxed max-w-[220px]">
          Launch a mission and OrionOS will generate a structured intelligence report.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        {["Executive Summary", "Key Findings", "Business Risks", "Recommendations"].map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="flex items-center gap-2 text-[10px] text-[#71717A] bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2"
          >
            <div className="size-1.5 rounded-full bg-[#5B5CF6]/50" />
            {item}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main ─── */
export function ReportViewer() {
  const { missionReport, missionStatus, loading } = useMission();

  // showReport gates on missionReport presence only — context now sets the report
  // while loading is still true, so we can't use loading as the gate here.
  const showReport   = !!missionReport;
  const showSkeleton = !showReport && (loading || missionStatus === "Planning" || missionStatus === "Executing");
  const showIdle     = !showSkeleton && !showReport;

  return (
    <div className="glass-panel rounded-[18px] h-full flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {showIdle && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
            <ReportIdle />
          </motion.div>
        )}

        {showSkeleton && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto">
            <ReportLoading missionStatus={missionStatus} />
          </motion.div>
        )}

        {showReport && missionReport && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.05] gap-4">
              <div>
                <h2 className="text-sm font-bold text-[#FAFAFA] leading-tight">{missionReport.title}</h2>
                <p className="text-[10px] text-[#71717A] mt-1 font-mono">
                  {new Date(missionReport.generated_at).toLocaleString()} · by OrionOS
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => downloadReportPdf(missionReport)}
                className="flex items-center gap-2 px-4 py-2 bg-[#5B5CF6]/10 border border-[#5B5CF6]/20 rounded-xl text-[#5B5CF6] text-[10px] font-bold uppercase tracking-widest hover:bg-[#5B5CF6]/15 hover:border-[#5B5CF6]/30 transition-all duration-200 shrink-0"
              >
                <Download className="size-3.5" />
                PDF
              </motion.button>
            </div>

            {/* Confidence metric */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between bg-[#22C55E]/[0.04] border border-[#22C55E]/15 rounded-xl px-5 py-4"
            >
              <div className="flex items-center gap-2 text-[11px] text-[#71717A] font-bold uppercase tracking-widest">
                <Activity className="size-3.5 text-[#22C55E]" />
                Confidence Score
              </div>
              <span className="text-2xl font-black text-[#22C55E] font-mono tabular-nums">
                {missionReport.confidence}%
              </span>
            </motion.div>

            {/* Executive summary */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-black/20 border border-white/[0.05] rounded-xl p-5"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-3">Executive Summary</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">{missionReport.executive_summary}</p>
            </motion.div>

            <ReportSection
              icon={TrendingUp}
              title="Key Findings"
              items={missionReport.key_findings}
              colorClass="bg-[#5B5CF6]/10 text-[#5B5CF6]"
              borderClass="border-[#5B5CF6]/[0.08]"
              delay={0.2}
            />
            <ReportSection
              icon={AlertTriangle}
              title="Business Risks"
              items={missionReport.risks}
              colorClass="bg-[#F59E0B]/10 text-[#F59E0B]"
              borderClass="border-[#F59E0B]/[0.08]"
              delay={0.25}
            />
            <ReportSection
              icon={Lightbulb}
              title="Recommendations"
              items={missionReport.recommendations}
              colorClass="bg-[#22C55E]/10 text-[#22C55E]"
              borderClass="border-[#22C55E]/[0.08]"
              delay={0.3}
            />
            <ReportSection
              icon={CheckCircle2}
              title="Next Steps"
              items={missionReport.next_steps}
              colorClass="bg-[#A1A1AA]/10 text-[#A1A1AA]"
              borderClass="border-white/[0.05]"
              delay={0.35}
            />

            {/* Agent contributions */}
            {missionReport.agent_contributions?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/20 border border-white/[0.05] rounded-xl p-5"
              >
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-3 flex items-center gap-2">
                  <BarChart2 className="size-3.5" /> Agent Contributions
                </h3>
                <div className="space-y-2">
                  {missionReport.agent_contributions.map((item, i) => (
                    <div key={i} className="text-xs text-[#A1A1AA] flex items-start gap-2">
                      <span className="text-[#5B5CF6] font-mono mt-0.5 shrink-0">→</span>
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
