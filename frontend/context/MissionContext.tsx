"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { launchMission as apiLaunchMission } from "../lib/api";
import { MissionPlan, ExecutionLog, ExecutionEvent, ExecutiveReport } from "../types/mission";

type AgentState = "Ready" | "Running" | "Completed";

interface MissionContextProps {
  loading: boolean;
  missionStatus: string;
  missionPlan: MissionPlan | null;
  executionLog: ExecutionLog | null;
  agentStates: Record<string, AgentState>;
  documentId: string | null;
  setDocumentId: (id: string | null) => void;
  missionReport: ExecutiveReport | null;
  launchMission: (text: string) => Promise<void>;
}

const MissionContext = createContext<MissionContextProps | undefined>(undefined);

export const MissionProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [missionStatus, setMissionStatus] = useState("Ready");
  const [missionPlan, setMissionPlan] = useState<MissionPlan | null>(null);
  const [executionLog, setExecutionLog] = useState<ExecutionLog | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [missionReport, setMissionReport] = useState<ExecutiveReport | null>(null);
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>({
    Planner: "Ready",
    Research: "Ready",
    Knowledge: "Ready",
    Reviewer: "Ready"
  });

  const launchMission = async (text: string) => {
    if (!text.trim()) return;

    setLoading(true);
    setMissionStatus("Planning");
    setMissionPlan(null);
    setExecutionLog(null);
    setMissionReport(null);
    setAgentStates({ Planner: "Running", Research: "Ready", Knowledge: "Ready", Reviewer: "Ready" });

    try {
      const response = await apiLaunchMission(text, documentId);

      // Store plan and show Planner working for a visible beat before marking done
      setMissionPlan(response.planner_output);
      // NOTE: missionReport is intentionally NOT set here.
      // It is revealed only after the full agent replay completes.

      await new Promise(resolve => setTimeout(resolve, 700));
      setAgentStates(prev => ({ ...prev, Planner: "Completed" }));
      setMissionStatus("Executing");

      // ── Sequential replay of execution log events ──
      // Delays are intentionally asymmetric:
      //   • Before a "started" event → short gap (400ms) = quick agent handoff
      //   • Before a "completed/failed" event → long pause (1000ms) = agent visibly working
      // This ensures only ONE agent is animated Running at any time.
      const events = response.execution_log?.events || [];
      const replayedEvents: ExecutionEvent[] = [];

      for (const event of events) {
        const isStart    = event.event === "started";
        const isComplete = event.event.startsWith("completed");
        const isFailed   = event.event.startsWith("failed");

        // Variable delay based on event type
        const delay = isStart ? 400 : 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        replayedEvents.push(event);
        setExecutionLog({ events: [...replayedEvents] });

        // Update agent state
        if (isStart) {
          setAgentStates(prev => ({ ...prev, [event.agent]: "Running" }));
        } else if (isComplete || isFailed) {
          setAgentStates(prev => ({
            ...prev,
            [event.agent]: isFailed ? "Completed" : "Completed",
          }));
        }
      }

      // Brief pause after last event so the final "Completed" state is visible
      // before the report slides in — makes the reveal feel earned
      await new Promise(resolve => setTimeout(resolve, 700));

      // Reveal report ONLY after all agents have completed their animation
      setMissionReport(response.executive_report || null);

      // Small additional gap so ReportViewer's AnimatePresence can run its
      // skeleton → report transition before we flip status to Completed
      await new Promise(resolve => setTimeout(resolve, 300));
      setMissionStatus("Completed");
    } catch (error) {
      console.error(error);
      setMissionStatus("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MissionContext.Provider value={{ loading, missionStatus, missionPlan, executionLog, agentStates, documentId, setDocumentId, missionReport, launchMission }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (context === undefined) {
    throw new Error("useMission must be used within a MissionProvider");
  }
  return context;
};
