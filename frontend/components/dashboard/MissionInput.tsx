"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Rocket, Loader2, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { uploadDocument } from "@/lib/api";

export function MissionInput() {
  const [text, setText] = useState("");
  const { launchMission, loading, documentId, setDocumentId } = useMission();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadState, setUploadState] = useState<"Idle" | "Uploading" | "Extracting" | "Ready">("Idle");
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      // Small artificial delay to enforce the UX progression
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
    <div className="bg-card p-6 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Rocket className="size-5 text-accent" />
          <h2 className="text-lg font-bold tracking-tight">Launch Mission</h2>
        </div>
        
        {/* Upload Error Display */}
        {uploadError && (
          <div className="flex items-center gap-2 text-destructive text-xs font-medium">
            <AlertCircle className="size-3.5" />
            {uploadError}
          </div>
        )}
      </div>
      
      <textarea
        className="w-full h-40 bg-background border border-border rounded-xl p-4 mb-4 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all resize-none text-sm leading-relaxed"
        placeholder="Example: Analyze this quarterly report and prepare an executive summary with recommendations."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      
      <div className="flex justify-between items-center">
        {/* Hidden File Input */}
        <input 
          type="file" 
          accept="application/pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <Button 
          variant="outline" 
          className="rounded-lg" 
          disabled={loading || uploadState === "Uploading" || uploadState === "Extracting" || uploadState === "Ready"}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadState === "Idle" && <><Upload className="size-4 mr-2" /> Upload Assets</>}
          {uploadState === "Uploading" && <><Loader2 className="size-4 mr-2 animate-spin text-accent" /> Uploading...</>}
          {uploadState === "Extracting" && <><Loader2 className="size-4 mr-2 animate-spin text-accent" /> Extracting Text...</>}
          {uploadState === "Ready" && <><CheckCircle2 className="size-4 mr-2 text-success" /> Ready</>}
        </Button>
        
        <Button 
          onClick={handleLaunch}
          disabled={loading || !text.trim()}
          className="rounded-lg px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 font-bold"
        >
          {loading ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <Rocket className="size-4 mr-2" />
          )}
          {loading ? "Initiating..." : "Initiate Operation"}
        </Button>
      </div>
    </div>
  );
}
