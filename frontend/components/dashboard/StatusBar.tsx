"use client";

import { motion } from "framer-motion";
import { AgentCard } from "./AgentCard";
import { Brain, Search, Database, ShieldCheck } from "lucide-react";
import { useMission } from "@/context/MissionContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }
  }
};

export function StatusBar() {
  const { agentStates } = useMission();

  const agents = [
    { name: "Planner",   role: "Project Manager",       status: agentStates["Planner"]   || "Ready", icon: <Brain      className="size-4" /> },
    { name: "Research",  role: "Business Analyst",      status: agentStates["Research"]  || "Ready", icon: <Search     className="size-4" /> },
    { name: "Knowledge", role: "Knowledge Specialist",  status: agentStates["Knowledge"] || "Ready", icon: <Database   className="size-4" /> },
    { name: "Reviewer",  role: "Quality Assurance",     status: agentStates["Reviewer"]  || "Ready", icon: <ShieldCheck className="size-4" /> },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {agents.map((agent) => (
        <motion.div key={agent.name} variants={cardVariants}>
          <AgentCard {...agent} />
        </motion.div>
      ))}
    </motion.div>
  );
}
