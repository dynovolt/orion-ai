"use client";

import { useMission } from "@/context/MissionContext";

export function AgentTimeline() {
  const { executionLog, missionStatus } = useMission();

  let timelineEvents: any[] = [];
  
  if (missionStatus === "Ready") {
    timelineEvents = [
      { time: "---", event: "Waiting for mission...", status: "pending" }
    ];
  } else if (missionStatus === "Planning") {
    timelineEvents = [
      { time: "Now", event: "Planner analyzing request...", status: "active" }
    ];
  } else if (executionLog && executionLog.events.length > 0) {
    timelineEvents = executionLog.events.map(ev => ({
      time: new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: `[${ev.agent}] Task ${ev.task_id} ${ev.event}`,
      status: ev.event.startsWith("completed") || ev.event.startsWith("failed") ? "completed" : "active"
    }));
    if (missionStatus !== "Completed" && missionStatus !== "Failed") {
      timelineEvents.push({ time: "...", event: "Working...", status: "pending" });
    }
  }

  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <h2 className="text-lg font-bold tracking-tight mb-6">Operation Timeline</h2>
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent before:via-border before:to-transparent">
        {timelineEvents.map((event, i) => (
          <div key={i} className="relative flex items-center gap-6">
            <div className={`size-2.5 rounded-full ring-4 ring-background ${
              event.status === "completed" ? "bg-success" : 
              event.status === "active" ? "bg-accent" : "bg-muted"
            } z-10 ml-[15px]`} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{event.time}</span>
              <span className={`text-sm font-medium ${event.status === "active" ? "text-accent" : "text-foreground"}`}>
                {event.event}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
