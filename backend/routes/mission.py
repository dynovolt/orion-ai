from fastapi import APIRouter, HTTPException
from uuid import uuid4
try:
    from backend.schemas.mission import MissionRequest, MissionResponse
    from backend.agents.planner import PlannerAgent
    from backend.orchestrator.mission_orchestrator import MissionOrchestrator
    from backend.services.context_store import KnowledgeBase
except ModuleNotFoundError:
    from schemas.mission import MissionRequest, MissionResponse
    from agents.planner import PlannerAgent
    from orchestrator.mission_orchestrator import MissionOrchestrator
    from services.context_store import KnowledgeBase

router = APIRouter()

@router.post("/mission", response_model=MissionResponse)
def create_mission(payload: MissionRequest):
    try:
        document_context = None
        if payload.document_id:
            doc_data = KnowledgeBase.get_document(payload.document_id)
            if doc_data:
                document_context = doc_data["text"]

        # Call the planner agent
        initial_plan = PlannerAgent.execute(payload.mission, document_context)
        
        # Pass to orchestrator for execution
        updated_plan, execution_log, executive_report = MissionOrchestrator.orchestrate(payload.mission, initial_plan)
        
        # Generate a mission ID
        mission_id = str(uuid4())
        
        return MissionResponse(
            mission_id=mission_id,
            status="completed",
            planner_output=updated_plan,
            execution_log=execution_log,
            executive_report=executive_report
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
