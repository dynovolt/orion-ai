"use client";

import { useMission } from "@/context/MissionContext";

export function AgentTimeline() {
  const { executionLog, missionStatus } = useMission();

  let timelineEvents: any[] = [];
  
  if (missionStatus === "Ready") {
    timelineEvents = [
      { time: "---", agent: "System", action: "Awaiting mission parameters...", status: "pending", statusDotColor: "bg-zinc-800 ring-zinc-900" }
    ];
  } else if (missionStatus === "Planning") {
    timelineEvents = [
      { time: "Now", agent: "Planner", action: "Analyzing objectives & constructing plan...", status: "running", statusDotColor: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)] animate-pulse" }
    ];
  } else if (executionLog && executionLog.events.length > 0) {
    timelineEvents = executionLog.events.map(ev => {
      const isCompleted = ev.event.startsWith("completed");
      const isFailed = ev.event.startsWith("failed");
      
      let status = "running";
      let statusDotColor = "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)] animate-pulse";
      
      if (isCompleted) {
        status = "completed";
        statusDotColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
      } else if (isFailed) {
        status = "failed";
        statusDotColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
      }
      
      return {
        time: new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: ev.agent,
        action: ev.event,
        status: status,
        statusDotColor: statusDotColor
      };
    });
    
    if (missionStatus !== "Completed" && missionStatus !== "Failed") {
      timelineEvents.push({ 
        time: "...", 
        agent: "System", 
        action: "Processing next tasks in queue...", 
        status: "pending", 
        statusDotColor: "bg-zinc-800" 
      });
    }
  }

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden shadow-lg border-white/[0.08] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-white/[0.05] pb-4 shrink-0">
        <h2 className="text-sm font-bold tracking-wider text-zinc-500 uppercase">Operation Logs</h2>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-0.5 rounded">Live Stream</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[1px] before:bg-white/10">
        {timelineEvents.map((event, i) => (
          <div key={i} className="relative flex items-start gap-4 animate-fade pl-1">
            <div className="relative pt-1.5 z-10">
              <div className={`size-2 rounded-full ring-4 ring-[#111113] ${event.statusDotColor}`} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
              <span className="font-mono text-[10px] text-zinc-500 tracking-wider w-16 shrink-0">{event.time}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-zinc-100">{event.agent}</span>
                <span className="text-[10px] text-zinc-600 font-medium">|</span>
              </div>
              <span className={`text-xs font-medium tracking-wide flex-1 break-words ${event.status === "running" ? "text-zinc-200" : "text-zinc-400"}`}>
                {event.action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
