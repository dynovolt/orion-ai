"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { launchMission as apiLaunchMission } from "../lib/api";
import { MissionPlan, ExecutionLog, ExecutionEvent, ExecutiveReport } from "../types/mission";

type AgentState = "Ready" | "Running" | "Completed";

interface MissionContextProps {
  loading: boolean;
  missionStatus: string;
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
      
      setMissionPlan(response.planner_output);
      setMissionReport(response.executive_report || null);
      setAgentStates(prev => ({ ...prev, Planner: "Completed" }));
      setMissionStatus("Executing");

      // Sequential replay of execution log events
      const events = response.execution_log?.events || [];
      const replayedEvents: ExecutionEvent[] = [];

      for (const event of events) {
        // Small delay to simulate processing and animate UI
        await new Promise(resolve => setTimeout(resolve, 400));
        
        replayedEvents.push(event);
        setExecutionLog({ events: [...replayedEvents] });

        // Update agent state
        if (event.event === "started") {
          setAgentStates(prev => ({ ...prev, [event.agent]: "Running" }));
        } else if (event.event.startsWith("completed") || event.event.startsWith("failed")) {
          setAgentStates(prev => ({ ...prev, [event.agent]: "Completed" }));
        }
      }

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
