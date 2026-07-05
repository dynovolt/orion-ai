from datetime import datetime, timezone
from typing import Tuple, Optional

try:
    from backend.schemas.mission import MissionPlan, ExecutionLog, ExecutionEvent, TaskStatus
    from backend.schemas.report import ExecutiveReport
    from backend.agents.research import ResearchAgent
    from backend.agents.knowledge import KnowledgeAgent
    from backend.agents.reviewer import ReviewerAgent
except ModuleNotFoundError:
    from schemas.mission import MissionPlan, ExecutionLog, ExecutionEvent, TaskStatus
    from schemas.report import ExecutiveReport
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
    def orchestrate(mission: str, mission_plan: MissionPlan) -> Tuple[MissionPlan, ExecutionLog, Optional[ExecutiveReport]]:
        log = ExecutionLog(events=[])
        executive_report = None
        
        # Build a lookup for tasks by their ID
        tasks_by_id = {task.id: task for task in mission_plan.tasks}
        
        knowledge_results = {}

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
                if assigned_agent_name == "Reviewer":
                    # Build context for reviewer
                    context = {
                        "mission": mission,
                        "mission_plan": mission_plan,
                        "knowledge_results": knowledge_results,
                        "execution_log": [e.model_dump() for e in log.events]
                    }
                    executive_report = agent.execute(task, context=context)
                else:
                    # Other agents (placeholder execution)
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

        return mission_plan, log, executive_report
