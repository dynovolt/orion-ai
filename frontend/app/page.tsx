import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MissionInput } from "@/components/dashboard/MissionInput";
import { AgentTimeline } from "@/components/dashboard/AgentTimeline";
import { ReportViewer } from "@/components/dashboard/ReportViewer";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { MissionStatusCard } from "@/components/dashboard/MissionStatusCard";

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <StatusBar />
              <div className="space-y-8">
                <MissionStatusCard />
                <MissionInput />
              </div>
              <AgentTimeline />
            </div>
            <div className="lg:col-span-1 min-h-[600px]">
              <ReportViewer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
