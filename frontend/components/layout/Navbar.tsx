"use client";

import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="h-14 border-b border-white/[0.05] bg-transparent flex items-center justify-between px-8 shrink-0"
    >
      <div className="text-xs font-semibold text-[#71717a] tracking-widest uppercase">Mission Control</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 glass-panel rounded-full">
          <span className="text-[9px] uppercase tracking-widest text-[#71717a] font-bold">System</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.7)] animate-dot-pulse"></div>
              <span className="text-[11px] font-medium text-[#a1a1aa]">Backend Online</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.7)] animate-dot-pulse"></div>
              <span className="text-[11px] font-medium text-[#a1a1aa]">Gemini Connected</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.7)] animate-dot-pulse"></div>
              <span className="text-[11px] font-medium text-[#a1a1aa]">4 Agents Ready</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
