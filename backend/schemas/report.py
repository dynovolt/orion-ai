from pydantic import BaseModel, Field
from typing import List
from datetime import datetime, timezone

class ExecutiveReport(BaseModel):
    title: str = Field(..., description="Title of the executive report")
    executive_summary: str = Field(..., description="High-level summary of the mission and findings")
    key_findings: List[str] = Field(..., description="List of key findings from the execution")
    agent_contributions: List[str] = Field(..., description="Summary of each agent's contribution")
    risks: List[str] = Field(..., description="Identified risks or limitations")
    recommendations: List[str] = Field(..., description="Actionable recommendations")
    next_steps: List[str] = Field(..., description="Suggested next steps")
    confidence: float = Field(..., description="Overall confidence score (0.0 to 1.0) of the findings")
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat(), description="Generation timestamp")
