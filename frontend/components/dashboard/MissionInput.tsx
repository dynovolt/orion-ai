"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Rocket, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { uploadDocument } from "@/lib/api";

/* ─── Stage messages matching execution flow ─── */
const LAUNCH_STAGES = [
  "Launching...",
  "Analyzing Request...",
  "Planning Mission...",
  "Executing Agents...",
  "Generating Report...",
];

export function MissionInput() {
  const [text, setText] = useState("");
  const { launchMission, loading, missionStatus, setDocumentId } = useMission();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadState, setUploadState] = useState<"Idle" | "Uploading" | "Extracting" | "Ready">("Idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  /* Cycle through launch stage messages while loading */
  useEffect(() => {
    if (loading) {
      setStageIndex(0);
      const id = setInterval(() => {
        setStageIndex(prev => Math.min(prev + 1, LAUNCH_STAGES.length - 1));
      }, 2200);
      return () => clearInterval(id);
    } else {
      setStageIndex(0);
    }
  }, [loading]);

  const handleLaunch = () => {
    if (!text.trim() || loading) return;
    launchMission(text);
  };

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are supported.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadError("File exceeds 25 MB limit.");
      return;
    }
    setUploadError(null);
    setUploadState("Uploading");
    try {
      await new Promise(r => setTimeout(r, 700));
      setUploadState("Extracting");
      const res = await uploadDocument(file);
      setDocumentId(res.document_id);
      setUploadState("Ready");
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
      setUploadState("Idle");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  };

  /* Button label + style based on mission state */
  const isCompleted = missionStatus === "Completed";

  let btnLabel = "Launch Mission";
  let btnClass = "from-[#5B5CF6] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#3B82F6] shadow-[0_4px_16px_rgba(91,92,246,0.3)] hover:shadow-[0_6px_24px_rgba(91,92,246,0.4)]";

  if (loading) {
    btnLabel = LAUNCH_STAGES[stageIndex];
    btnClass = "from-[#4F46E5] to-[#3B82F6] cursor-not-allowed opacity-80";
  } else if (isCompleted) {
    btnLabel = "Mission Complete ✓";
    btnClass = "from-[#16A34A] to-[#15803D] shadow-[0_4px_16px_rgba(34,197,94,0.25)]";
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`glass-panel p-8 rounded-[18px] relative overflow-hidden group transition-all duration-300 ${
        isDragActive ? "border-[#5B5CF6]/50 bg-[#5B5CF6]/[0.03]" : ""
      }`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5B5CF6]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Drag overlay */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-[#5B5CF6]/60 rounded-[18px]"
          >
            <Upload className="size-10 text-[#5B5CF6] mb-3" />
            <p className="text-sm font-bold text-[#FAFAFA]">Drop PDF here</p>
            <p className="text-xs text-[#71717A] mt-1">Up to 25 MB</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#5B5CF6]/10 rounded-xl border border-[#5B5CF6]/20 shadow-[0_0_12px_rgba(91,92,246,0.15)]">
            <Rocket className="size-4 text-[#5B5CF6]" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-[#FAFAFA]">Launch Mission</h2>
        </div>

        <AnimatePresence>
          {uploadError && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2 text-[#EF4444] text-xs font-semibold bg-[#EF4444]/10 px-3 py-1.5 rounded-full border border-[#EF4444]/20 shrink-0"
            >
              <AlertCircle className="size-3.5" />
              {uploadError}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Textarea */}
      <textarea
        disabled={loading}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Describe your mission..."
        className="w-full h-36 bg-black/40 border border-white/[0.06] rounded-xl p-5 mb-6 outline-none focus:border-[#5B5CF6]/50 focus:ring-4 focus:ring-[#5B5CF6]/10 transition-all duration-300 resize-none text-sm leading-relaxed text-[#FAFAFA] placeholder:text-[#71717A] shadow-inner relative z-10 disabled:opacity-50"
      />

      {/* Footer actions */}
      <div className="flex justify-between items-center relative z-10">
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading || uploadState === "Uploading" || uploadState === "Extracting" || uploadState === "Ready"}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadState === "Idle" && <><Upload className="size-3.5 opacity-70" /> Upload PDF</>}
          {uploadState === "Uploading" && <><Loader2 className="size-3.5 animate-spin text-[#5B5CF6]" /> Uploading...</>}
          {uploadState === "Extracting" && <><Loader2 className="size-3.5 animate-spin text-[#5B5CF6]" /> Extracting...</>}
          {uploadState === "Ready" && <><CheckCircle2 className="size-3.5 text-[#22C55E]" /> Asset Ready</>}
        </motion.button>

        <motion.button
          whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          onClick={handleLaunch}
          disabled={loading || !text.trim()}
          className={`flex items-center gap-2 h-10 px-8 rounded-xl bg-gradient-to-r ${btnClass} text-white font-semibold text-xs border border-white/10 transition-all duration-200 disabled:cursor-not-allowed`}
        >
          {loading
            ? <Loader2 className="size-3.5 animate-spin" />
            : isCompleted
            ? null
            : <Rocket className="size-3.5" />
          }
          <AnimatePresence mode="wait">
            <motion.span
              key={btnLabel}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {btnLabel}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
