"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMission } from "@/context/MissionContext";
import { CheckCircle2, AlertCircle, Loader2, Clock } from "lucide-react";

/* ─── Map raw event strings → readable labels ─── */
function formatEventLabel(agent: string, event: string): string {
  if (event === "started") return `${agent} Agent started task`;
  if (event.startsWith("completed")) return `${agent} completed successfully`;
  if (event.startsWith("failed"))   return `${agent} encountered an error`;
  return event;
}

function getStatusFromEvent(event: string): "running" | "completed" | "failed" | "pending" {
  if (event === "started")              return "running";
  if (event.startsWith("completed"))    return "completed";
  if (event.startsWith("failed"))       return "failed";
  return "pending";
}

const agentVerbs: Record<string, string> = {
  Planner:   "Generated Execution Plan",
  Research:  "Completed Analysis",
  Knowledge: "Extracted Context",
  Reviewer:  "Validated Findings",
  System:    "Initialized",
};

function getFriendlyLabel(agent: string, event: string): string {
  if (event === "started") {
    const verb = agentVerbs[agent] ?? "Started Task";
    return `${agent} → ${verb.replace("Completed", "Starting").replace("Extracted", "Extracting").replace("Validated", "Validating").replace("Generated", "Generating")}...`;
  }
  if (event.startsWith("completed")) {
    const verb = agentVerbs[agent] ?? "Completed";
    return `✓ ${agent}: ${verb}`;
  }
  if (event.startsWith("failed")) {
    return `✗ ${agent}: Task Failed`;
  }
  return event;
}

/* ─── Dot component ─── */
function StatusDot({ status }: { status: "running" | "completed" | "failed" | "pending" }) {
  if (status === "running") {
    return (
      <motion.div
        className="size-2 rounded-full bg-[#5B5CF6] ring-4 ring-[#09090B]"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }
  if (status === "completed") {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="size-2 rounded-full bg-[#22C55E] ring-4 ring-[#09090B] shadow-[0_0_8px_rgba(34,197,94,0.5)]"
      />
    );
  }
  if (status === "failed") {
    return <div className="size-2 rounded-full bg-[#EF4444] ring-4 ring-[#09090B] shadow-[0_0_8px_rgba(239,68,68,0.5)]" />;
  }
  return <div className="size-2 rounded-full bg-[#3f3f46] ring-4 ring-[#09090B]" />;
}

/* ─── Main component ─── */
export function AgentTimeline() {
  const { executionLog, missionStatus } = useMission();
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Build events list */
  type TimelineEvent = {
    key: string;
    time: string;
    label: string;
    status: "running" | "completed" | "failed" | "pending";
    isNewest: boolean;
  };

  let events: TimelineEvent[] = [];

  if (missionStatus === "Ready") {
    events = [{
      key: "idle",
      time: "—",
      label: "Awaiting mission parameters...",
      status: "pending",
      isNewest: true,
    }];
  } else if (missionStatus === "Planning") {
    events = [{
      key: "planning",
      time: "Now",
      label: "Planner → Building Execution Graph...",
      status: "running",
      isNewest: true,
    }];
  } else if (executionLog && executionLog.events.length > 0) {
    const raw = executionLog.events;
    events = raw.map((ev, i) => ({
      key: `${ev.agent}-${ev.event}-${i}`,
      time: new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      label: getFriendlyLabel(ev.agent, ev.event),
      status: getStatusFromEvent(ev.event),
      isNewest: i === raw.length - 1,
    }));

    if (missionStatus === "Executing") {
      events.push({
        key: "queued",
        time: "...",
        label: "Processing next agent in queue...",
        status: "pending",
        isNewest: true,
      });
    }
  }

  /* Auto-scroll to bottom whenever events change */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  return (
    <div className="glass-panel p-6 rounded-[18px] h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.05] shrink-0">
        <h2 className="text-xs font-bold text-[#71717A] uppercase tracking-widest">Execution Log</h2>
        <motion.span
          animate={missionStatus === "Executing" || missionStatus === "Planning"
            ? { opacity: [0.5, 1, 0.5] }
            : { opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
            missionStatus === "Completed"
              ? "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20"
              : missionStatus === "Failed"
              ? "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
              : missionStatus === "Ready"
              ? "text-[#71717A] bg-white/5 border-white/10"
              : "text-[#5B5CF6] bg-[#5B5CF6]/10 border-[#5B5CF6]/20"
          }`}
        >
          {missionStatus === "Ready" ? "Idle" : missionStatus === "Completed" ? "Complete" : missionStatus === "Failed" ? "Failed" : "Live"}
        </motion.span>
      </div>

      {/* Events */}
      <div className="flex-1 overflow-y-auto pr-1 relative space-y-0">
        {/* Connector line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/[0.06]" />

        <AnimatePresence initial={false}>
          {events.map((ev) => (
            <motion.div
              key={ev.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative flex items-start gap-4 py-2 pl-1"
            >
              {/* Dot */}
              <div className="relative z-10 flex items-center justify-center mt-0.5 shrink-0 w-5">
                <StatusDot status={ev.status} />
              </div>

              {/* Content */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0">
                <span className="font-mono text-[9px] text-[#71717A] tracking-wider shrink-0 w-16">{ev.time}</span>
                <span className={`text-xs font-medium leading-relaxed break-words ${
                  ev.isNewest && ev.status !== "pending"
                    ? "text-[#FAFAFA]"
                    : ev.status === "completed"
                    ? "text-[#22C55E]/80"
                    : ev.status === "failed"
                    ? "text-[#EF4444]/80"
                    : "text-[#A1A1AA]"
                }`}>
                  {ev.label}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
