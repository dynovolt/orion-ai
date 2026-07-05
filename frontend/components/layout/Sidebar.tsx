import { LayoutDashboard, Brain, BookOpen, Settings, History, Cpu } from "lucide-react";

export function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: BookOpen, label: "Knowledge Base" },
    { icon: History, label: "Mission History" },
    { icon: Cpu, label: "Architecture" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-accent">AIGENTIC</h1>
        <p className="text-xs text-muted-foreground mt-1">Autonomous AI Workforce</p>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
          >
            <item.icon className="size-5" />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
