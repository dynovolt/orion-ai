"use client";

import { AgentCard } from "./AgentCard";
import { Brain, Search, Database, ShieldCheck } from "lucide-react";
import { useMission } from "@/context/MissionContext";

export function StatusBar() {
  const { agentStates } = useMission();

  const agents = [
    { name: "Planner", role: "Project Manager", status: agentStates["Planner"] || "Ready", icon: <Brain className="size-5 text-accent" /> },
    { name: "Research", role: "Business Analyst", status: agentStates["Research"] || "Ready", icon: <Search className="size-5 text-accent" /> },
    { name: "Knowledge", role: "Knowledge Specialist", status: agentStates["Knowledge"] || "Ready", icon: <Database className="size-5 text-accent" /> },
    { name: "Reviewer", role: "Quality Assurance", status: agentStates["Reviewer"] || "Ready", icon: <ShieldCheck className="size-5 text-accent" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {agents.map((agent) => (
        <AgentCard key={agent.name} {...agent} />
      ))}
    </div>
  );
}
