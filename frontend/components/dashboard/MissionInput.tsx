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
  const [isDragActive, setIsDragActive] = useState(false);
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

  const handleFile = async (file: File) => {
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleFile(file);
    }
  };

  return (
    <div 
      className={`glass-panel p-8 rounded-[18px] relative overflow-hidden group shadow-lg border-white/[0.05] transition-all duration-300 ${
        isDragActive ? "border-[#5B5CF6]/50 bg-[#5B5CF6]/[0.02]" : ""
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      {isDragActive && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center border-2 border-dashed border-[#5B5CF6]/50 rounded-[18px] animate-fade">
          <Upload className="size-10 text-[#5B5CF6] mb-3 animate-bounce" />
          <p className="text-sm font-bold text-[#FAFAFA]">Drop your PDF here</p>
          <p className="text-xs text-[#71717A] mt-1">Up to 25 MB limit</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#5B5CF6]/10 rounded-xl border border-[#5B5CF6]/20 shadow-[0_0_12px_rgba(91,92,246,0.15)]">
             <Rocket className="size-4 text-[#5B5CF6]" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-[#FAFAFA]">Launch Mission</h2>
        </div>
        
        {uploadError && (
          <div className="flex items-center gap-2 text-[#EF4444] text-xs font-semibold bg-[#EF4444]/10 px-3 py-1.5 rounded-full border border-[#EF4444]/20 animate-fade shrink-0">
            <AlertCircle className="size-3.5" />
            {uploadError}
          </div>
        )}
      </div>
      
      <textarea
        className="w-full h-40 bg-black/45 border border-white/[0.05] rounded-xl p-5 mb-6 outline-none focus:border-[#5B5CF6]/50 focus:ring-4 focus:ring-[#5B5CF6]/10 transition-all duration-300 resize-none text-sm leading-relaxed text-[#FAFAFA] placeholder:text-[#71717A] shadow-inner relative z-10"
        placeholder="Describe your mission..."
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
          className="rounded-xl h-10 px-4 text-xs font-semibold bg-[#18181B] border-white/[0.05] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 shadow-sm" 
          disabled={loading || uploadState === "Uploading" || uploadState === "Extracting" || uploadState === "Ready"}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadState === "Idle" && <><Upload className="size-3.5 mr-2 opacity-70" /> Upload Assets</>}
          {uploadState === "Uploading" && <><Loader2 className="size-3.5 mr-2 animate-spin text-[#5B5CF6]" /> Uploading...</>}
          {uploadState === "Extracting" && <><Loader2 className="size-3.5 mr-2 animate-spin text-[#5B5CF6]" /> Extracting...</>}
          {uploadState === "Ready" && <><CheckCircle2 className="size-3.5 mr-2 text-emerald-400" /> Asset Ready</>}
        </Button>
        
        <Button 
          onClick={handleLaunch}
          disabled={loading || !text.trim()}
          className="rounded-xl px-8 h-10 bg-gradient-to-r from-[#5B5CF6] to-[#3B82F6] hover:from-[#4F46E5] hover:to-[#2563EB] text-[#FAFAFA] hover:shadow-[0_0_20px_rgba(91,92,246,0.35)] hover:-translate-y-0.5 transition-all active:scale-[0.98] duration-200 font-semibold text-xs border border-white/10"
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
