try:
    from backend.schemas.mission import Task, TaskStatus
except ModuleNotFoundError:
    from schemas.mission import Task, TaskStatus

class ReviewerAgent:
    def execute(self, task: Task) -> Task:
        """
        Placeholder execution for Reviewer tasks.
        Updates task status to COMPLETED.
        """
        task.status = TaskStatus.COMPLETED
        return task
