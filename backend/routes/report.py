from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io
from datetime import datetime

try:
    from backend.schemas.report import ExecutiveReport
    from backend.services.pdf_generator import PDFGeneratorService
except ModuleNotFoundError:
    from schemas.report import ExecutiveReport
    from services.pdf_generator import PDFGeneratorService

router = APIRouter()

@router.post("/report/download")
def download_report(report: ExecutiveReport):
    try:
        pdf_bytes = PDFGeneratorService.generate_executive_report_pdf(report)
        
        date_str = datetime.now().strftime("%Y-%m-%d")
        filename = f"AIGENTIC_Executive_Report_{date_str}.pdf"
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")
