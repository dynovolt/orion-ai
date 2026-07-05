from datetime import datetime, timezone
from typing import Tuple

try:
    from backend.schemas.mission import MissionPlan, ExecutionLog, ExecutionEvent, TaskStatus
    from backend.agents.research import ResearchAgent
    from backend.agents.knowledge import KnowledgeAgent
    from backend.agents.reviewer import ReviewerAgent
except ModuleNotFoundError:
    from schemas.mission import MissionPlan, ExecutionLog, ExecutionEvent, TaskStatus
    from agents.research import ResearchAgent
    from agents.knowledge import KnowledgeAgent
    from agents.reviewer import ReviewerAgent

AGENTS = {
    "Research": ResearchAgent(),
    "Knowledge": KnowledgeAgent(),
    "Reviewer": ReviewerAgent()
}

class MissionOrchestrator:
    @staticmethod
    def orchestrate(mission_plan: MissionPlan) -> Tuple[MissionPlan, ExecutionLog]:
        log = ExecutionLog(events=[])
        
        # Build a lookup for tasks by their ID
        tasks_by_id = {task.id: task for task in mission_plan.tasks}

        for task_id in mission_plan.execution_order:
            if task_id not in tasks_by_id:
                continue

            task = tasks_by_id[task_id]
            assigned_agent_name = task.assigned_agent

            # Record 'started' event
            task.status = TaskStatus.RUNNING
            log.events.append(ExecutionEvent(
                timestamp=datetime.now(timezone.utc),
                task_id=task.id,
                agent=assigned_agent_name,
                event="started"
            ))

            agent = AGENTS.get(assigned_agent_name)
            if agent:
                # Dispatch to correct agent
                agent.execute(task)
            else:
                task.status = TaskStatus.FAILED

            # Record 'completed' or 'failed' event
            final_event = "completed" if task.status == TaskStatus.COMPLETED else "failed"
            log.events.append(ExecutionEvent(
                timestamp=datetime.now(timezone.utc),
                task_id=task.id,
                agent=assigned_agent_name,
                event=final_event
            ))

        return mission_plan, log
