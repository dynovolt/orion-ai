"use client";

import { useState } from "react";
import { FileSearch, Download, Loader2, CheckCircle2, AlertTriangle, Cpu, HelpCircle } from "lucide-react";
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

  // Before Mission: Show Onboarding
  if (!missionPlan && !missionReport) {
    return (
      <div className="bg-white/[0.02] backdrop-blur-[20px] border border-white/[0.05] p-8 rounded-[18px] h-full flex flex-col relative overflow-hidden shadow-lg">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#5B5CF6]/20 to-transparent"></div>
        
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/[0.05] shrink-0">
          <div className="p-2 bg-[#5B5CF6]/10 rounded-xl border border-[#5B5CF6]/20">
             <HelpCircle className="size-4 text-[#5B5CF6]" />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-[#FAFAFA]">How Orion Works</h2>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-5 py-2 px-1">
          <div className="text-center mb-2">
            <h3 className="text-sm font-bold text-[#FAFAFA]">Orchestrate Your Workflow</h3>
            <p className="text-xs text-[#71717A] mt-1 leading-relaxed">Connect and deploy specialized AI agents to generate executive insights</p>
          </div>
          
          <div className="space-y-3.5">
            <div className="flex items-center gap-4 bg-black/20 border border-white/[0.04] p-3.5 rounded-xl hover:border-white/[0.08] transition-all">
              <div className="flex items-center justify-center size-8 rounded-lg bg-[#111113] text-[#71717A] font-mono text-xs font-bold border border-white/5 shrink-0">01</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#FAFAFA]">Upload Context File</span>
                <span className="text-[10px] text-[#71717A] mt-0.5 font-medium">Attach PDF assets to construct dynamic knowledge bases</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-black/20 border border-white/[0.04] p-3.5 rounded-xl hover:border-white/[0.08] transition-all">
              <div className="flex items-center justify-center size-8 rounded-lg bg-[#111113] text-[#71717A] font-mono text-xs font-bold border border-white/5 shrink-0">02</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#FAFAFA]">Set Objectives</span>
                <span className="text-[10px] text-[#71717A] mt-0.5 font-medium">Describe your research requirements and guidelines</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-black/20 border border-white/[0.04] p-3.5 rounded-xl hover:border-white/[0.08] transition-all">
              <div className="flex items-center justify-center size-8 rounded-lg bg-[#111113] text-[#71717A] font-mono text-xs font-bold border border-white/5 shrink-0">03</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#FAFAFA]">Launch Agents</span>
                <span className="text-[10px] text-[#71717A] mt-0.5 font-medium">Watch Planner, Research, and Reviewer run in series</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#5B5CF6]/5 border border-[#5B5CF6]/10 p-3.5 rounded-xl hover:border-[#5B5CF6]/20 transition-all">
              <div className="flex items-center justify-center size-8 rounded-lg bg-[#5B5CF6]/10 text-[#5B5CF6] font-mono text-xs font-bold border border-[#5B5CF6]/20 shadow-[0_0_8px_rgba(91,92,246,0.15)] shrink-0">04</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#5B5CF6]">Generate Analytics</span>
                <span className="text-[10px] text-[#5B5CF6]/50 mt-0.5 font-semibold">Examine structural deliverables and download as PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // After Mission: Show Report
  if (missionReport) {
    const confidencePercent = missionReport.confidence * 100;
    let confidenceLabel = "High Confidence";
    if (confidencePercent >= 95) confidenceLabel = "Very High Confidence";
    else if (confidencePercent >= 80) confidenceLabel = "High Confidence";
    else if (confidencePercent >= 60) confidenceLabel = "Moderate Confidence";
    else confidenceLabel = "Low Confidence";

    return (
      <div className="bg-white/[0.02] backdrop-blur-[20px] border border-white/[0.05] p-8 rounded-[18px] h-full flex flex-col relative overflow-hidden shadow-lg">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#5B5CF6]/50 to-transparent"></div>
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.05] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="size-4 text-emerald-400" />
            </div>
            <h2 className="text-sm font-bold tracking-tight text-[#FAFAFA]">Executive Report</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload} 
            disabled={downloading}
            className="h-9 px-4 gap-2 bg-[#18181B] border-white/[0.05] hover:bg-[#111113] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-white/[0.12] rounded-xl transition-all shadow-sm font-semibold text-xs active:scale-[0.98]"
          >
            {downloading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
            <h3 className="text-base font-bold tracking-tight text-[#FAFAFA] mb-2 leading-tight">{missionReport.title}</h3>
            <p className="text-[9px] text-[#71717A] font-bold tracking-widest uppercase">Generated {new Date(missionReport.generated_at).toLocaleString()}</p>
          </div>

          <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
            <h3 className="text-[10px] text-[#71717A] uppercase tracking-widest font-bold mb-3">Executive Summary</h3>
            <p className="text-sm font-medium leading-relaxed text-[#A1A1AA]">{missionReport.executive_summary}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111113]/40 border border-white/[0.05] p-5 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-b from-[#5B5CF6]/5 to-transparent"></div>
               <h3 className="text-[10px] text-[#71717A] uppercase tracking-widest font-bold mb-1.5 relative z-10">Confidence</h3>
               <p className="text-3xl font-light tracking-tighter text-[#5B5CF6] relative z-10">
                 {confidencePercent.toFixed(1)}<span className="text-lg text-[#5B5CF6]/50 ml-0.5">%</span>
               </p>
               <span className="text-[10px] text-[#5B5CF6] font-bold uppercase tracking-widest mt-1 relative z-10">{confidenceLabel}</span>
            </div>
            
            <div className="bg-[#111113]/40 border border-white/[0.05] p-4 rounded-xl flex flex-col justify-between">
               <h3 className="text-[10px] text-[#71717A] uppercase tracking-widest font-bold mb-3">Contributions</h3>
               <div className="space-y-2 overflow-y-auto max-h-24 pr-1">
                 {missionReport.agent_contributions.map((c, i) => (
                   <div key={i} className="bg-white/[0.02] border border-white/[0.04] px-2.5 py-1.5 rounded-lg text-[10px] text-[#A1A1AA] font-medium leading-normal">
                     {c}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
            <h3 className="text-[10px] text-[#71717A] uppercase tracking-widest font-bold mb-4">Key Findings</h3>
            <ul className="space-y-3">
              {missionReport.key_findings.map((finding, idx) => (
                <li key={idx} className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl text-xs flex items-start gap-3 hover:border-white/[0.08] hover:bg-white/[0.02] transition-all">
                  <span className="text-[#5B5CF6] font-bold text-xs shrink-0">0{idx + 1}.</span>
                  <span className="leading-relaxed text-[#A1A1AA]">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
            <h3 className="text-[10px] text-emerald-500/70 uppercase tracking-widest font-bold mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {missionReport.recommendations.map((rec, idx) => (
                <li key={idx} className="bg-emerald-500/[0.02] border border-emerald-500/10 p-4 rounded-xl text-xs flex items-start gap-3 hover:border-emerald-500/20 hover:bg-emerald-500/[0.04] transition-all">
                  <span className="text-emerald-400 font-bold text-xs shrink-0">0{idx + 1}.</span>
                  <span className="leading-relaxed text-[#A1A1AA]">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {missionReport.risks.length > 0 && (
            <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
              <h3 className="text-[10px] text-[#EF4444]/70 uppercase tracking-widest font-bold mb-4">Business Risks</h3>
              <ul className="space-y-3">
                {missionReport.risks.map((risk, idx) => (
                  <li key={idx} className="bg-red-500/[0.02] border border-red-500/10 p-4 rounded-xl text-xs flex items-start gap-3 hover:border-red-500/20 hover:bg-red-500/[0.04] transition-all">
                     <span className="text-red-400 font-bold text-xs shrink-0">0{idx + 1}.</span>
                     <span className="leading-relaxed text-[#A1A1AA]">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
            <h3 className="text-[10px] text-[#71717A] uppercase tracking-widest font-bold mb-4">Next Steps</h3>
            <ul className="space-y-3">
              {missionReport.next_steps.map((step, idx) => (
                 <li key={idx} className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl text-xs flex items-start gap-3 hover:border-white/[0.08] hover:bg-white/[0.02] transition-all">
                   <span className="text-[10px] font-mono text-[#71717A] mt-0.5 shrink-0">{(idx + 1).toString().padStart(2, '0')}</span>
                   <span className="font-semibold leading-relaxed text-[#A1A1AA]">{step}</span>
                 </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to MissionPlan (during execution / blueprint phase)
  return (
    <div className="bg-white/[0.02] backdrop-blur-[20px] border border-white/[0.05] p-8 rounded-[18px] h-full flex flex-col relative overflow-hidden shadow-lg">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#5B5CF6]/20 to-transparent"></div>
      
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5 shrink-0">
        <div className="p-2 bg-[#5B5CF6]/10 rounded-xl border border-[#5B5CF6]/20 shadow-[0_0_8px_rgba(91,92,246,0.15)]">
           <FileSearch className="size-4 text-[#5B5CF6]" />
        </div>
        <h2 className="text-sm font-bold tracking-tight text-[#FAFAFA]">Mission Blueprint</h2>
      </div>
      <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="bg-black/20 border border-white/[0.04] p-5 rounded-xl">
          <h3 className="text-[10px] text-[#71717A] uppercase tracking-widest font-bold mb-3">Objective</h3>
          <p className="text-sm font-medium leading-relaxed text-[#A1A1AA]">{missionPlan.objective}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 border border-white/[0.04] p-4 rounded-xl">
            <h3 className="text-[10px] text-[#71717A] uppercase tracking-widest font-bold mb-2">Priority</h3>
            <p className="text-sm font-bold text-[#5B5CF6]">{missionPlan.priority}</p>
          </div>
          <div className="bg-black/20 border border-white/[0.04] p-4 rounded-xl">
            <h3 className="text-[10px] text-[#71717A] uppercase tracking-widest font-bold mb-2">Est. Time</h3>
            <p className="text-sm font-bold text-[#FAFAFA]">{missionPlan.estimated_time}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-[10px] text-[#71717A] uppercase tracking-widest font-bold mb-2 px-1">Task Breakdown</h3>
          <div className="space-y-4">
            {missionPlan.tasks.map((task) => (
              <div key={task.id} className="bg-white/[0.01] border border-white/[0.04] p-5 rounded-xl hover:border-white/[0.08] hover:bg-white/[0.02] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#5B5CF6] tracking-wide">Task {task.id}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#A1A1AA] bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                    {task.assigned_agent}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#FAFAFA] mb-2">{task.title}</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
