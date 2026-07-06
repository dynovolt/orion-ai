import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MissionProvider } from "@/context/MissionContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OrionOS — Autonomous AI Workspace",
  description: "Deploy specialized AI agents to orchestrate research, analysis, and executive reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col dark bg-background text-foreground relative selection:bg-[#5b5cf6]/30 selection:text-white">
        {/* Subtle radial background overlay */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(91,92,246,0.06),transparent)]" />
        </div>
        <MissionProvider>
          {children}
        </MissionProvider>
      </body>
    </html>
  );
}
