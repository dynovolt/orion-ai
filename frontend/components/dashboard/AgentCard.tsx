"use client";

import { motion } from "framer-motion";


interface AgentCardProps {
  role: string;
  status: string;
  icon: React.ReactNode;
}

export function AgentCard({ role, status, icon }: AgentCardProps) {
  return (
    <div className="bg-card p-4 rounded-lg border border-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{role}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{status}</span>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="size-2 rounded-full bg-success"
        />
      </div>
    </div>
  );
}
