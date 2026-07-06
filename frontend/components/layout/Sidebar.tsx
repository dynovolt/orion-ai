import { LayoutDashboard, Brain, BookOpen, Settings, History, Cpu } from "lucide-react";

export function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: BookOpen, label: "Knowledge Base", active: false },
    { icon: History, label: "Mission History", active: false },
    { icon: Cpu, label: "Architecture", active: false },
  ];

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-[#09090b] hidden md:flex flex-col relative shrink-0">
      <div className="p-6 pb-8">
        <h1 className="text-lg font-bold tracking-tight text-zinc-50 flex items-center gap-2">
          <span className="size-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
          OrionOS
        </h1>
        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">Autonomous Workspace</p>
      </div>
      <nav className="flex-1 px-3 space-y-1.5">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
              item.active 
                ? "bg-white/[0.05] text-zinc-50 shadow-sm" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02]"
            }`}
          >
            {item.active && (
              <span className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-r bg-indigo-500"></span>
            )}
            <item.icon className={`size-4 transition-transform group-hover:scale-105 ${item.active ? "text-indigo-400" : "text-zinc-500"}`} />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
