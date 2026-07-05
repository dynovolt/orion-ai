"use client";

import { useState } from "react";
import { FileSearch, Download, Loader2, CheckCircle2 } from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { downloadReportPdf } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function ReportViewer() {
  const { missionPlan, missionReport } = useMission();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!missionReport) return;
    try {
      setDownloading(true);
      await downloadReportPdf(missionReport);
    } catch (error) {
      console.error("Failed to download report", error);
    } finally {
      setDownloading(false);
    }
  };

  if (!missionPlan && !missionReport) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <FileSearch className="size-5 text-accent" />
          <h2 className="text-lg font-bold tracking-tight">Intelligence Report</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl bg-background/50">
          <div className="p-4 bg-muted/20 rounded-full mb-4">
            <FileSearch className="size-8 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-muted-foreground">Waiting for Planner Agent</h3>
          <p className="text-xs text-muted-foreground/70 mt-1 uppercase tracking-wider font-medium">No active mission</p>
        </div>
      </div>
    );
  }

  if (missionReport) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-success" />
            <h2 className="text-lg font-bold tracking-tight">Executive Report</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload} 
            disabled={downloading}
            className="h-8 gap-2"
          >
            {downloading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2 pb-4">
          
          <div>
            <h3 className="text-xl font-black mb-1">{missionReport.title}</h3>
            <p className="text-xs text-muted-foreground">Generated at {new Date(missionReport.generated_at).toLocaleString()}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Executive Summary</h3>
            <p className="text-sm font-medium leading-relaxed">{missionReport.executive_summary}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background border border-border p-3 rounded-lg flex flex-col items-center justify-center">
               <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Confidence Score</h3>
               <p className="text-2xl font-black text-accent">{(missionReport.confidence * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-background border border-border p-3 rounded-lg overflow-y-auto max-h-24">
               <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Agent Contributions</h3>
               <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                 {missionReport.agent_contributions.map((c, i) => <li key={i}>{c}</li>)}
               </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Key Findings</h3>
            <ul className="space-y-2">
              {missionReport.key_findings.map((finding, idx) => (
                <li key={idx} className="bg-background border border-border p-3 rounded-lg text-sm flex items-start gap-3">
                  <span className="text-accent font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Recommendations</h3>
            <ul className="space-y-2">
              {missionReport.recommendations.map((rec, idx) => (
                <li key={idx} className="bg-background border border-border p-3 rounded-lg text-sm flex items-start gap-3">
                  <span className="text-success font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {missionReport.risks.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-destructive uppercase tracking-wider mb-2">Risks & Limitations</h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                {missionReport.risks.map((risk, idx) => <li key={idx} className="leading-relaxed">{risk}</li>)}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Next Steps</h3>
            <ul className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
              {missionReport.next_steps.map((step, idx) => <li key={idx} className="font-medium leading-relaxed">{step}</li>)}
            </ul>
          </div>
          
        </div>
      </div>
    );
  }

  // Fallback to MissionPlan (during execution)
  return (
    <div className="bg-card p-6 rounded-xl border border-border h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <FileSearch className="size-5 text-accent" />
        <h2 className="text-lg font-bold tracking-tight">Mission Plan</h2>
      </div>
      <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2 pb-4">
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Objective</h3>
          <p className="text-sm font-medium leading-relaxed">{missionPlan.objective}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background border border-border p-3 rounded-lg">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Priority</h3>
            <p className="text-sm font-bold text-accent">{missionPlan.priority}</p>
          </div>
          <div className="bg-background border border-border p-3 rounded-lg">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Est. Time</h3>
            <p className="text-sm font-bold">{missionPlan.estimated_time}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Tasks</h3>
          <div className="space-y-3">
            {missionPlan.tasks.map((task) => (
              <div key={task.id} className="bg-background border border-border p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-accent">Task {task.id}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {task.assigned_agent}
                  </span>
                </div>
                <h4 className="text-sm font-bold mb-1">{task.title}</h4>
                <p className="text-xs text-muted-foreground">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
