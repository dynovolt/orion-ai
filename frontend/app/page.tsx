import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MissionInput } from "@/components/dashboard/MissionInput";
import { AgentTimeline } from "@/components/dashboard/AgentTimeline";
import { ReportViewer } from "@/components/dashboard/ReportViewer";
import { StatusBar } from "@/components/dashboard/StatusBar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <StatusBar />
            <MissionInput />
            <AgentTimeline />
          </div>
          <div className="lg:col-span-1">
            <ReportViewer />
          </div>
        </main>
      </div>
    </div>
  );
}
