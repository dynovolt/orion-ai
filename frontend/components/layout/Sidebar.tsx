"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, History, Cpu, ChevronLeft, ChevronRight } from "lucide-react";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: BookOpen, label: "Knowledge", active: false },
    { icon: History, label: "History", active: false },
    { icon: Cpu, label: "Architecture", active: false },
  ];

  return (
    <aside 
      className={`relative my-4 ml-4 mr-0 h-[calc(100vh-2rem)] bg-white/[0.02] backdrop-blur-[20px] border border-white/[0.05] rounded-2xl flex flex-col transition-all duration-300 shadow-xl shadow-black/30 shrink-0 select-none ${
        isCollapsed ? "w-20" : "w-64"
      } hidden md:flex`}
    >
      {/* Sidebar Header / Logo */}
      <div className={`p-6 pb-8 flex items-center justify-between border-b border-white/[0.04] ${
        isCollapsed ? "justify-center" : ""
      }`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-3 animate-fade">
            <span className="size-2 rounded-full bg-[#5B5CF6] shadow-[0_0_12px_rgba(91,92,246,0.8)] animate-pulse"></span>
            <h1 className="text-base font-bold tracking-tight text-[#FAFAFA]">OrionOS</h1>
          </div>
        ) : (
          <span className="size-3.5 rounded-full bg-[#5B5CF6] shadow-[0_0_15px_rgba(91,92,246,1)] animate-pulse"></span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
              item.active 
                ? "bg-white/[0.04] text-[#FAFAFA] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]" 
                : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/[0.01]"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            {item.active && (
              <motion.span 
                layoutId="active-indicator" 
                className="absolute left-0 w-0.5 bg-[#5B5CF6] rounded-r"
                style={{ top: "10px", bottom: "10px" }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
            
            <item.icon className={`size-4.5 transition-transform group-hover:scale-105 shrink-0 ${
              item.active ? "text-[#5B5CF6]" : "text-[#71717A]"
            }`} />
            
            {!isCollapsed && (
              <span className="animate-fade truncate">{item.label}</span>
            )}
          </a>
        ))}
      </nav>

      {/* Sidebar Footer / Toggle Trigger */}
      <div className="p-4 border-t border-white/[0.04] flex items-center justify-center shrink-0">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="size-8 rounded-lg bg-[#111113] hover:bg-[#18181B] border border-white/[0.05] text-[#71717A] hover:text-[#FAFAFA] transition-all flex items-center justify-center hover:shadow-[0_0_10px_rgba(255,255,255,0.02)] active:scale-95 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
