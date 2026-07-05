"use client";

import { Badge } from "@/components/ui/badge";
import { Info, Clock, Users, Activity } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export function MissionStatusCard() {
  const { missionStatus, missionPlan } = useMission();

  let statusColor = "text-muted-foreground";
  if (missionStatus === "Planning" || missionStatus === "Executing") statusColor = "text-accent";
  if (missionStatus === "Completed") statusColor = "text-success";
  if (missionStatus === "Failed") statusColor = "text-destructive";

  const stats = [
    { label: "Status", value: missionStatus, icon: Activity, color: statusColor },
    { label: "Current Mission", value: missionPlan ? (missionPlan.objective.length > 25 ? missionPlan.objective.substring(0, 25) + "..." : missionPlan.objective) : "None", icon: Info, color: "text-accent" },
    { label: "Est. Runtime", value: missionPlan ? missionPlan.estimated_time : "---", icon: Clock, color: "text-muted-foreground" },
    { label: "Connected Agents", value: "4", icon: Users, color: "text-accent" },
  ];

  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <stat.icon className="size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
