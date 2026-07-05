"use client";

import { motion } from "framer-motion";

export function Badge({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "success" }) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/10 text-success border-success/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function StatusIndicator() {
  return (
    <motion.div
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="size-2 rounded-full bg-success"
    />
  );
}
