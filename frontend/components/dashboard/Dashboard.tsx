"use client";

import { motion } from "framer-motion";
import { MissionInput } from "./MissionInput";
import { AgentTimeline } from "./AgentTimeline";
import { ReportViewer } from "./ReportViewer";
import { StatusBar } from "./StatusBar";
import { MissionStatusCard } from "./MissionStatusCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.21, 0.47, 0.32, 0.98]
    }
  }
};

export function Dashboard() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 max-w-[1600px] mx-auto w-full pb-12 select-none"
    >
      {/* Top Row: Planner, Research, Knowledge, Reviewer Agents */}
      <motion.div variants={itemVariants} className="w-full">
        <StatusBar />
      </motion.div>

      {/* Second Row: Mission Status Statistics */}
      <motion.div variants={itemVariants} className="w-full">
        <MissionStatusCard />
      </motion.div>

      {/* Third Row: Core Actions, Execution Log, and Report Viewer */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch w-full">
        <motion.div variants={itemVariants} className="flex flex-col h-full min-h-[420px]">
          <MissionInput />
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col h-full min-h-[420px]">
          <AgentTimeline />
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col h-full min-h-[500px] xl:min-h-0">
          <ReportViewer />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
