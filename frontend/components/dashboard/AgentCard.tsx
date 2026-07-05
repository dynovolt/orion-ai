"use client";

import { motion } from "framer-motion";
import { Badge, StatusIndicator } from "@/components/ui/badge";

interface AgentCardProps {
  name: string;
  role: string;
  status: string;
  icon: React.ReactNode;
}

export function AgentCard({ name, role, status, icon }: AgentCardProps) {
  let badgeVariant = "default";
  let statusText = "Ready for tasks";
  let animateClass = "";

  if (status === "Running") {
    badgeVariant = "secondary";
    statusText = "Processing tasks...";
    animateClass = "animate-pulse border-accent/70";
  } else if (status === "Completed") {
    badgeVariant = "success";
    statusText = "Task completed";
  }

  return (
    <div className={`bg-card p-4 rounded-xl border border-border hover:border-accent/50 transition-all group ${animateClass}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-background rounded-lg border border-border group-hover:border-accent/30 transition-colors">
          {icon}
        </div>
        <Badge variant={badgeVariant as any}>
          {status}
        </Badge>
      </div>
      <div>
        <h3 className="font-bold text-sm tracking-tight">{name}</h3>
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{role}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIndicator />
          <span className="text-[10px] text-muted-foreground italic">{statusText}</span>
        </div>
      </div>
    </div>
  );
}
