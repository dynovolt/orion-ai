import { AgentCard } from "./AgentCard";
import { Brain, Search, Database, FileText } from "lucide-react";

export function StatusBar() {
  const agents = [
    { role: "Planner", status: "Idle", icon: <Brain className="size-5 text-accent" /> },
    { role: "Research", status: "Idle", icon: <Search className="size-5 text-accent" /> },
    { role: "Knowledge", status: "Idle", icon: <Database className="size-5 text-accent" /> },
    { role: "Reviewer", status: "Idle", icon: <FileText className="size-5 text-accent" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {agents.map((agent) => (
        <AgentCard key={agent.role} {...agent} />
      ))}
    </div>
  );
}
