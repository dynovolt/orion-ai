"use client";

import { MissionInput } from "./MissionInput";
import { AgentTimeline } from "./AgentTimeline";
import { ReportViewer } from "./ReportViewer";
import { StatusBar } from "./StatusBar";
import { MissionStatusCard } from "./MissionStatusCard";

export function Dashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto w-full pb-12 animate-fade">
      {/* Top Row: Planner, Research, Knowledge, Reviewer Agents */}
      <div className="w-full">
        <StatusBar />
      </div>

      {/* Second Row: Mission Status Statistics */}
      <div className="w-full">
        <MissionStatusCard />
      </div>

      {/* Third Row: Core Actions, Execution Log, and Report Viewer */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch w-full">
        <div className="flex flex-col h-full min-h-[420px]">
          <MissionInput />
        </div>
        <div className="flex flex-col h-full min-h-[420px]">
          <AgentTimeline />
        </div>
        <div className="flex flex-col h-full min-h-[500px] xl:min-h-0">
          <ReportViewer />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
