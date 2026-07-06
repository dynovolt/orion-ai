"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MissionInput } from "@/components/dashboard/MissionInput";
import { AgentTimeline } from "@/components/dashboard/AgentTimeline";
import { ReportViewer } from "@/components/dashboard/ReportViewer";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { MissionStatusCard } from "@/components/dashboard/MissionStatusCard";
import { useMission } from "@/context/MissionContext";
import { CheckCircle2 } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }
  }
};

function CompletionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="flex items-center justify-center gap-3 py-2.5 px-6 mx-auto max-w-fit mt-2 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs font-bold tracking-wide shadow-[0_0_24px_rgba(34,197,94,0.12)]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
      >
        <CheckCircle2 className="size-4" />
      </motion.div>
      Mission Complete — Executive Report Generated
    </motion.div>
  );
}

export default function DashboardPage() {
  const { missionStatus } = useMission();
  const isCompleted = missionStatus === "Completed";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        {/* Mission complete banner */}
        <AnimatePresence>
          {isCompleted && (
            <div className="px-8 pt-4">
              <CompletionBanner />
            </div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full"
          >
            {/* Left column */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <motion.div variants={sectionVariants}>
                <StatusBar />
              </motion.div>

              <motion.div variants={sectionVariants} className="space-y-6">
                <MissionStatusCard />
                <MissionInput />
              </motion.div>

              <motion.div variants={sectionVariants} className="flex-1 min-h-[300px]">
                <AgentTimeline />
              </motion.div>
            </div>

            {/* Right column */}
            <motion.div variants={sectionVariants} className="lg:col-span-1 min-h-[600px]">
              <ReportViewer />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
