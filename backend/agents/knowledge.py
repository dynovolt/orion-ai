try:
    from backend.schemas.mission import Task, TaskStatus
except ModuleNotFoundError:
    from schemas.mission import Task, TaskStatus

class KnowledgeAgent:
    def execute(self, task: Task) -> Task:
        """
        Placeholder execution for Knowledge tasks.
        Updates task status to COMPLETED.
        """
        task.status = TaskStatus.COMPLETED
        return task
