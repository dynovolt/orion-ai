import os
import json
from pydantic import ValidationError
from dotenv import dotenv_values
from google import genai
from google.genai import errors, types

try:
    from backend.schemas.mission import MissionPlan
except ModuleNotFoundError:
    from schemas.mission import MissionPlan

# Define path to .env file relative to this script
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(CURRENT_DIR, "..", ".env")

# Read from .env strictly (do not fall back to system env variables)
env_vars = dotenv_values(ENV_PATH)
api_key = env_vars.get("GEMINI_API_KEY")
model_name = env_vars.get("MODEL_NAME")

if not api_key:
    raise ValueError("GEMINI_API_KEY is missing from .env")

if not model_name:
    raise ValueError("MODEL_NAME is missing from .env")

# Initialize client once
client = genai.Client(api_key=api_key)

class GeminiService:
    @staticmethod
    def plan_mission(mission: str, document_context: str = None) -> MissionPlan:
        prompt = (
            "You are an expert project manager.\n"
            "Break the following mission into a structured plan.\n"
            "Include an overall objective, priority, estimated time, and subtasks.\n"
            "Assign a recommended agent for each task.\n"
            "Determine the execution_order by listing the IDs of the tasks in the order they should be executed.\n"
            "You MUST return ONLY valid JSON matching the required schema. Do not include markdown formatting.\n\n"
        )
        
        if document_context:
            context_excerpt = document_context[:20000]
            prompt += f"Document Context (excerpt):\n{context_excerpt}\n\n"
            
        prompt += f"Mission: {mission}"
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=MissionPlan,
                )
            )
            
            # Use SDK's parsed structured output or fallback to JSON loads if response.parsed is missing
            if hasattr(response, "parsed") and response.parsed is not None:
                return response.parsed
            else:
                return MissionPlan.model_validate_json(response.text)
                
        except (ValueError, ValidationError) as e:
            raise ValueError(f"Failed to parse or validate JSON from model output: {str(e)}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Model returned invalid JSON: {str(e)}")
        except errors.APIError as e:
            raise RuntimeError(f"Gemini API Error: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"Unexpected error in Gemini service: {str(e)}")

    @staticmethod
    def research(*args, **kwargs):
        raise NotImplementedError("Research is not implemented yet.")

    @staticmethod
    def summarize(*args, **kwargs):
        raise NotImplementedError("Summarize is not implemented yet.")

    @staticmethod
    def review(*args, **kwargs):
        raise NotImplementedError("Review is not implemented yet.")
