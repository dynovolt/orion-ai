try:
    from backend.schemas.mission import MissionPlan, Task, TaskStatus
    from backend.schemas.report import ExecutiveReport
    from backend.services.gemini import GeminiService
except ModuleNotFoundError:
    from schemas.mission import MissionPlan, Task, TaskStatus
    from schemas.report import ExecutiveReport
    from services.gemini import GeminiService

class ReviewerAgent:
    def execute(self, task: Task, context: dict = None) -> ExecutiveReport:
        if not context:
            raise ValueError("ReviewerAgent requires a context dictionary.")
            
        report = GeminiService.generate_report(
            mission=context["mission"],
            mission_plan=context["mission_plan"],
            knowledge_results=context.get("knowledge_results", {}),
            execution_log=context.get("execution_log", {})
        )
        task.status = TaskStatus.COMPLETED
        return report
