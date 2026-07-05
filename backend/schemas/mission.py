from pydantic import BaseModel, Field
from typing import List, Optional, Any
from enum import Enum
from datetime import datetime

try:
    from backend.schemas.report import ExecutiveReport
except ModuleNotFoundError:
    from schemas.report import ExecutiveReport

class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class MissionRequest(BaseModel):
    mission: str = Field(..., description="The user's mission instructions")
    files: Optional[List[str]] = Field(None, description="Optional list of asset paths or identifiers")
    document_id: Optional[str] = Field(None, description="Optional document ID for context")

class Task(BaseModel):
    id: str = Field(..., description="Unique identifier for the task")
    title: str = Field(..., description="Short title of the task")
    description: str = Field(..., description="Detailed description of what needs to be done")
    assigned_agent: str = Field(..., description="The recommended agent for this task")
    priority: str = Field(..., description="Priority of the task (e.g., high, medium, low)")
    status: TaskStatus = Field(TaskStatus.PENDING, description="Current status of the task")

class MissionPlan(BaseModel):
    objective: str = Field(..., description="The overall objective of the mission")
    priority: str = Field(..., description="Overall mission priority")
    estimated_time: str = Field(..., description="Estimated time to complete the mission")
    execution_order: List[str] = Field(..., description="Order of execution by task ID")
    tasks: List[Task] = Field(..., description="List of subtasks for the mission")

class ExecutionEvent(BaseModel):
    timestamp: datetime = Field(..., description="When the event occurred")
    task_id: str = Field(..., description="The ID of the task")
    agent: str = Field(..., description="The agent executing the task")
    event: str = Field(..., description="Event type, e.g., 'started' or 'completed'")

class ExecutionLog(BaseModel):
    events: List[ExecutionEvent] = Field(default_factory=list, description="Chronological list of execution events")

class MissionResponse(BaseModel):
    mission_id: str = Field(..., description="Unique identifier for the mission")
    status: str = Field(..., description="Initial status of the mission (e.g., 'queued')")
    planner_output: MissionPlan = Field(..., description="Structured mission plan from the Planner agent")
    execution_log: ExecutionLog = Field(..., description="Log of execution events across agents")
    executive_report: Optional[ExecutiveReport] = Field(None, description="Generated executive report if available")
