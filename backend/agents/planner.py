try:
    from backend.services.gemini import GeminiService
    from backend.schemas.mission import MissionPlan
except ModuleNotFoundError:
    from services.gemini import GeminiService
    from schemas.mission import MissionPlan

class PlannerAgent:
    @staticmethod
    def execute(mission: str, document_context: str = None) -> MissionPlan:
        """
        Executes the planning phase of the mission by prompting the Gemini model.
        """
        return GeminiService.plan_mission(mission, document_context)
