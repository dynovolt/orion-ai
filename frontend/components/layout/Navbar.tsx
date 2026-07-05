import { Badge } from "@/components/ui/badge";

export function Navbar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="font-semibold text-lg">Mission Control</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border border-border">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">System Status:</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-success"></div>
              <span className="text-xs font-medium">Backend: Online</span>
            </div>
            <div className="w-px h-3 bg-border"></div>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-success"></div>
              <span className="text-xs font-medium">AI Model: Gemini Ready</span>
            </div>
            <div className="w-px h-3 bg-border"></div>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-success"></div>
              <span className="text-xs font-medium">Agents: 4 Available</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
