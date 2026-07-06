"use client";

import { useState } from "react";
import { FileSearch, Download, Loader2, CheckCircle2, Info, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
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
      <div className="glass-panel p-8 rounded-2xl h-full flex flex-col relative overflow-hidden shadow-lg border-white/[0.08]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/[0.05] shrink-0">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
             <FileSearch className="size-4 text-indigo-400" />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-50">Intelligence Workspace</h2>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-5 py-2 px-1">
          <div className="text-center mb-2">
            <h3 className="text-sm font-bold text-zinc-200">How to execute a mission</h3>
            <p className="text-xs text-zinc-500 mt-1">Orion connects specialized agents to deliver structured insights</p>
          </div>
          
          <div className="space-y-3.5">
            <div className="flex items-center gap-4 bg-black/20 border border-white/[0.04] p-3.5 rounded-xl hover:border-white/[0.08] transition-colors">
              <div className="flex items-center justify-center size-8 rounded-lg bg-zinc-900 text-zinc-400 font-mono text-xs font-bold border border-white/5 shrink-0">01</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-200">Upload a PDF Asset</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 font-medium">Load reference documents or contextual logs</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-black/20 border border-white/[0.04] p-3.5 rounded-xl hover:border-white/[0.08] transition-colors">
              <div className="flex items-center justify-center size-8 rounded-lg bg-zinc-900 text-zinc-400 font-mono text-xs font-bold border border-white/5 shrink-0">02</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-200">Describe your mission</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 font-medium">Outline specific analytics or strategies required</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-black/20 border border-white/[0.04] p-3.5 rounded-xl hover:border-white/[0.08] transition-colors">
              <div className="flex items-center justify-center size-8 rounded-lg bg-zinc-900 text-zinc-400 font-mono text-xs font-bold border border-white/5 shrink-0">03</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-200">Launch Orion Workload</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 font-medium">Sit back while agents orchestrate and refine findings</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-indigo-500/[0.02] border border-indigo-500/10 p-3.5 rounded-xl hover:border-indigo-500/20 transition-colors">
              <div className="flex items-center justify-center size-8 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.15)] shrink-0">04</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-indigo-400">Review Executive Report</span>
                <span className="text-[10px] text-indigo-500/50 mt-0.5 font-semibold">Examine metric deliverables and download as PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (missionReport) {
    const confidencePercent = missionReport.confidence * 100;
    let confidenceLabel = "High Confidence";
    if (confidencePercent >= 95) confidenceLabel = "Very High Confidence";
    else if (confidencePercent >= 80) confidenceLabel = "High Confidence";
    else if (confidencePercent >= 60) confidenceLabel = "Moderate Confidence";
    else confidenceLabel = "Low Confidence";

    return (
      <div className="glass-panel p-8 rounded-2xl h-full flex flex-col relative overflow-hidden shadow-lg border-white/[0.08]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.05] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="size-4 text-emerald-400" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-zinc-50">Executive Report</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload} 
            disabled={downloading}
            className="h-9 px-4 gap-2 bg-[#18181B] border-white/[0.08] hover:bg-white/[0.04] text-zinc-300 hover:text-zinc-50 hover:border-white/[0.15] rounded-lg transition-all shadow-sm font-semibold text-xs"
          >
            {downloading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
            <h3 className="text-lg font-bold tracking-tight text-zinc-50 mb-2 leading-tight">{missionReport.title}</h3>
            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Generated {new Date(missionReport.generated_at).toLocaleString()}</p>
          </div>

          <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Executive Summary</h3>
            <p className="text-sm font-medium leading-relaxed text-zinc-300">{missionReport.executive_summary}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/35 border border-white/[0.05] p-5 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent"></div>
               <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 relative z-10">Confidence Score</h3>
               <p className="text-3xl font-light tracking-tighter text-indigo-400 relative z-10">
                 {confidencePercent.toFixed(1)}<span className="text-lg text-indigo-500/50 ml-0.5">%</span>
               </p>
               <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1 relative z-10">{confidenceLabel}</span>
            </div>
            
            <div className="bg-black/35 border border-white/[0.05] p-4 rounded-xl flex flex-col justify-between">
               <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Agent Contributions</h3>
               <div className="space-y-2 overflow-y-auto max-h-28 pr-1">
                 {missionReport.agent_contributions.map((c, i) => (
                   <div key={i} className="bg-white/[0.03] border border-white/[0.05] px-2.5 py-2 rounded-lg text-[10px] text-zinc-300 font-medium leading-relaxed">
                     {c}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Key Findings</h3>
            <ul className="space-y-3">
              {missionReport.key_findings.map((finding, idx) => (
                <li key={idx} className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl text-xs flex items-start gap-3 hover:border-white/[0.1] hover:bg-white/[0.04] transition-all">
                  <span className="text-indigo-400 font-bold text-xs shrink-0">0{idx + 1}.</span>
                  <span className="leading-relaxed text-zinc-300">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
            <h3 className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mb-4">Strategic Recommendations</h3>
            <ul className="space-y-3">
              {missionReport.recommendations.map((rec, idx) => (
                <li key={idx} className="bg-emerald-500/[0.02] border border-emerald-500/10 p-4 rounded-xl text-xs flex items-start gap-3 hover:border-emerald-500/20 hover:bg-emerald-500/[0.04] transition-all">
                  <span className="text-emerald-400 font-bold text-xs shrink-0">0{idx + 1}.</span>
                  <span className="leading-relaxed text-zinc-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {missionReport.risks.length > 0 && (
            <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
              <h3 className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest mb-4">Business Risks & Limitations</h3>
              <ul className="space-y-3">
                {missionReport.risks.map((risk, idx) => (
                  <li key={idx} className="bg-red-500/[0.02] border border-red-500/10 p-4 rounded-xl text-xs flex items-start gap-3 hover:border-red-500/20 hover:bg-red-500/[0.04] transition-all">
                     <span className="text-red-400 font-bold text-xs shrink-0">0{idx + 1}.</span>
                     <span className="leading-relaxed text-zinc-300">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Next Steps</h3>
            <ul className="space-y-3">
              {missionReport.next_steps.map((step, idx) => (
                 <li key={idx} className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl text-xs flex items-start gap-3 hover:border-white/[0.1] hover:bg-white/[0.04] transition-all">
                   <span className="text-[10px] font-mono text-zinc-500 mt-0.5 shrink-0">{(idx + 1).toString().padStart(2, '0')}</span>
                   <span className="font-semibold leading-relaxed text-zinc-300">{step}</span>
                 </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to MissionPlan (during execution)
  return (
    <div className="glass-panel p-8 rounded-2xl h-full flex flex-col relative overflow-hidden shadow-lg border-white/[0.08]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
      
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5 shrink-0">
        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.15)]">
           <FileSearch className="size-4 text-indigo-400" />
        </div>
        <h2 className="text-base font-bold tracking-tight text-zinc-50">Mission Blueprint</h2>
      </div>
      <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Objective</h3>
          <p className="text-sm font-medium leading-relaxed text-zinc-300">{missionPlan.objective}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 border border-white/[0.04] p-4 rounded-xl">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Priority</h3>
            <p className="text-sm font-bold text-indigo-400">{missionPlan.priority}</p>
          </div>
          <div className="bg-black/20 border border-white/[0.04] p-4 rounded-xl">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Est. Time</h3>
            <p className="text-sm font-bold text-zinc-300">{missionPlan.estimated_time}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Task Breakdown</h3>
          <div className="space-y-4">
            {missionPlan.tasks.map((task) => (
              <div key={task.id} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl hover:border-white/[0.1] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-400 tracking-wide">Task {task.id}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                    {task.assigned_agent}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-100 mb-2">{task.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
