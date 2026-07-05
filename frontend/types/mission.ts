export type TaskStatus = "pending" | "running" | "completed" | "failed";

export interface Task {
    id: string;
    title: string;
    description: string;
    assigned_agent: string;
    priority: string;
    status: TaskStatus;
}

export interface MissionPlan {
    objective: string;
    priority: string;
    estimated_time: string;
    execution_order: string[];
    tasks: Task[];
}

export interface ExecutionEvent {
    timestamp: string;
    task_id: string;
    agent: string;
    event: "started" | "completed" | "failed" | string;
}

export interface ExecutionLog {
    events: ExecutionEvent[];
}

export interface ExecutiveReport {
    title: string;
    executive_summary: string;
    key_findings: string[];
    agent_contributions: string[];
    risks: string[];
    recommendations: string[];
    next_steps: string[];
    confidence: number;
    generated_at: string;
}

export interface MissionResponse {
    mission_id: string;
    status: string;
    planner_output: MissionPlan;
    execution_log: ExecutionLog;
    executive_report?: ExecutiveReport;
}
