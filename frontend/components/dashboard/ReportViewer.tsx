"use client";

import { FileSearch } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export function ReportViewer() {
  const { missionPlan } = useMission();

  if (!missionPlan) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <FileSearch className="size-5 text-accent" />
          <h2 className="text-lg font-bold tracking-tight">Intelligence Report</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl bg-background/50">
          <div className="p-4 bg-muted/20 rounded-full mb-4">
            <FileSearch className="size-8 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-muted-foreground">Waiting for Planner Agent</h3>
          <p className="text-xs text-muted-foreground/70 mt-1 uppercase tracking-wider font-medium">No active mission</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-xl border border-border h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <FileSearch className="size-5 text-accent" />
        <h2 className="text-lg font-bold tracking-tight">Mission Plan</h2>
      </div>
      <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2">
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Objective</h3>
          <p className="text-sm font-medium leading-relaxed">{missionPlan.objective}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background border border-border p-3 rounded-lg">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Priority</h3>
            <p className="text-sm font-bold text-accent">{missionPlan.priority}</p>
          </div>
          <div className="bg-background border border-border p-3 rounded-lg">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Est. Time</h3>
            <p className="text-sm font-bold">{missionPlan.estimated_time}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Tasks</h3>
          <div className="space-y-3">
            {missionPlan.tasks.map((task) => (
              <div key={task.id} className="bg-background border border-border p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-accent">Task {task.id}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {task.assigned_agent}
                  </span>
                </div>
                <h4 className="text-sm font-bold mb-1">{task.title}</h4>
                <p className="text-xs text-muted-foreground">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
