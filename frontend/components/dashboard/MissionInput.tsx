"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Rocket, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { uploadDocument } from "@/lib/api";

const loadingStages = [
  "Initializing Orion...",
  "Planning Mission...",
  "Executing Agents...",
  "Generating Report..."
];

export function MissionInput() {
  const [text, setText] = useState("");
  const { launchMission, loading, setDocumentId } = useMission();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadState, setUploadState] = useState<"Idle" | "Uploading" | "Extracting" | "Ready">("Idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (loading) {
      setCurrentStageIndex(0);
      const interval = setInterval(() => {
        setCurrentStageIndex((prev) => Math.min(prev + 1, loadingStages.length - 1));
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setCurrentStageIndex(0);
    }
  }, [loading]);

  const handleLaunch = () => {
    if (!text.trim()) return;
    launchMission(text);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Only application/pdf files are supported.");
      return;
    }
    
    if (file.size > 25 * 1024 * 1024) {
      setUploadError("File size exceeds 25 MB limit.");
      return;
    }

    setUploadError(null);
    setUploadState("Uploading");

    try {
      await new Promise(r => setTimeout(r, 800));
      setUploadState("Extracting");
      
      const response = await uploadDocument(file);
      setDocumentId(response.document_id);
      setUploadState("Ready");
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload document");
      setUploadState("Idle");
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group shadow-lg border-white/[0.08]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.15)]">
             <Rocket className="size-4 text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-50">Launch Mission</h2>
        </div>
        
        {uploadError && (
          <div className="flex items-center gap-2 text-destructive text-xs font-semibold bg-destructive/10 px-3 py-1.5 rounded-full border border-destructive/20 animate-fade">
            <AlertCircle className="size-3.5" />
            {uploadError}
          </div>
        )}
      </div>
      
      <textarea
        className="w-full h-40 bg-black/45 border border-white/[0.08] rounded-xl p-5 mb-6 outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 resize-none text-sm leading-relaxed text-zinc-50 placeholder:text-zinc-500 shadow-inner relative z-10"
        placeholder="Describe what you want Orion to accomplish..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      
      <div className="flex justify-between items-center relative z-10">
        <input 
          type="file" 
          accept="application/pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <Button 
          variant="outline" 
          className="rounded-lg h-10 px-4 text-xs font-semibold bg-[#18181B] border-white/[0.08] text-zinc-300 hover:text-zinc-50 hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-300 shadow-sm" 
          disabled={loading || uploadState === "Uploading" || uploadState === "Extracting" || uploadState === "Ready"}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadState === "Idle" && <><Upload className="size-3.5 mr-2 opacity-70" /> Upload Assets</>}
          {uploadState === "Uploading" && <><Loader2 className="size-3.5 mr-2 animate-spin text-indigo-400" /> Uploading...</>}
          {uploadState === "Extracting" && <><Loader2 className="size-3.5 mr-2 animate-spin text-indigo-400" /> Extracting...</>}
          {uploadState === "Ready" && <><CheckCircle2 className="size-3.5 mr-2 text-emerald-400" /> Asset Ready</>}
        </Button>
        
        <Button 
          onClick={handleLaunch}
          disabled={loading || !text.trim()}
          className="rounded-lg px-8 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 text-zinc-50 hover:from-indigo-500 hover:to-blue-500 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.35)] transition-all active:scale-95 font-semibold text-xs border border-white/10"
        >
          {loading ? (
            <Loader2 className="size-3.5 mr-2 animate-spin text-white" />
          ) : (
            <Rocket className="size-3.5 mr-2 opacity-90" />
          )}
          {loading ? loadingStages[currentStageIndex] : "Initiate Operation"}
        </Button>
      </div>
    </div>
  );
}
