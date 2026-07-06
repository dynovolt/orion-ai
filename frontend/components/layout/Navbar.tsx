import { Badge } from "@/components/ui/badge";

export function Navbar() {
  return (
    <header className="h-16 border-b border-white/[0.08] bg-transparent flex items-center justify-between px-8 shrink-0">
      <div className="font-medium text-sm text-zinc-200 tracking-tight">Mission Control</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 glass-panel rounded-full">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">System:</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse"></div>
              <span className="text-xs font-medium text-zinc-300">Backend Online</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse"></div>
              <span className="text-xs font-medium text-zinc-300">Gemini Connected</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] animate-pulse"></div>
              <span className="text-xs font-medium text-zinc-300">4 Agents Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
