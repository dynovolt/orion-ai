from fastapi import APIRouter, UploadFile, File, HTTPException
from uuid import uuid4
try:
    from backend.services.pdf_parser import extract_pdf_context
    from backend.services.context_store import KnowledgeBase
except ModuleNotFoundError:
    from services.pdf_parser import extract_pdf_context
    from services.context_store import KnowledgeBase

router = APIRouter()

MAX_FILE_SIZE = 25 * 1024 * 1024 # 25 MB

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only application/pdf files are supported.")
        
    contents = await file.read()
    
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds the 25 MB limit.")
        
    try:
        parsed_data = extract_pdf_context(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")
        
    doc_id = str(uuid4())
    KnowledgeBase.add_document(
        document_id=doc_id,
        filename=file.filename,
        page_count=parsed_data["page_count"],
        text=parsed_data["text"]
    )
    
    return {"document_id": doc_id, "message": "Document uploaded successfully"}
