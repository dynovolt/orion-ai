import { LayoutDashboard, Brain, BookOpen, Settings } from "lucide-react";

export function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Brain, label: "Agents" },
    { icon: BookOpen, label: "Knowledge" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
      <div className="p-6 text-xl font-bold text-accent">AIGENTIC</div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-colors"
          >
            <item.icon className="size-5" />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
