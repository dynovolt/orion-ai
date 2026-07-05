import io
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib import colors

try:
    from backend.schemas.report import ExecutiveReport
except ModuleNotFoundError:
    from schemas.report import ExecutiveReport

class PDFGeneratorService:
    @staticmethod
    def generate_executive_report_pdf(report: ExecutiveReport) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=letter,
            rightMargin=72, leftMargin=72,
            topMargin=72, bottomMargin=18
        )

        styles = getSampleStyleSheet()
        
        # AIGENTIC Branding styles
        styles.add(ParagraphStyle(
            name='AigenticTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.HexColor("#4F46E5"), # Indigo-600
            alignment=1 # Center
        ))
        
        styles.add(ParagraphStyle(
            name='SectionHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor("#1F2937"), # Gray-800
            spaceBefore=15,
            spaceAfter=10,
        ))
        
        styles.add(ParagraphStyle(
            name='BodyTextCustom',
            parent=styles['Normal'],
            fontSize=11,
            leading=16,
            textColor=colors.HexColor("#374151") # Gray-700
        ))

        story = []

        # Header / Branding
        story.append(Paragraph("<b>AIGENTIC</b> MISSION REPORT", styles["AigenticTitle"]))
        
        # Title
        story.append(Paragraph(report.title, styles["Title"]))
        story.append(Spacer(1, 12))
        
        # Timestamp
        story.append(Paragraph(f"Generated at: {report.generated_at}", styles["BodyTextCustom"]))
        story.append(Spacer(1, 24))

        # Executive Summary
        story.append(Paragraph("Executive Summary", styles["SectionHeading"]))
        story.append(Paragraph(report.executive_summary, styles["BodyTextCustom"]))
        story.append(Spacer(1, 12))

        # Key Findings
        story.append(Paragraph("Key Findings", styles["SectionHeading"]))
        for finding in report.key_findings:
            story.append(Paragraph(f"• {finding}", styles["BodyTextCustom"]))
        story.append(Spacer(1, 12))
        
        # Agent Contributions
        story.append(Paragraph("Agent Contributions", styles["SectionHeading"]))
        for contribution in report.agent_contributions:
            story.append(Paragraph(f"• {contribution}", styles["BodyTextCustom"]))
        story.append(Spacer(1, 12))

        # Risks
        story.append(Paragraph("Risks & Limitations", styles["SectionHeading"]))
        for risk in report.risks:
            story.append(Paragraph(f"• {risk}", styles["BodyTextCustom"]))
        story.append(Spacer(1, 12))

        # Recommendations
        story.append(Paragraph("Recommendations", styles["SectionHeading"]))
        for rec in report.recommendations:
            story.append(Paragraph(f"• {rec}", styles["BodyTextCustom"]))
        story.append(Spacer(1, 12))
        
        # Next Steps
        story.append(Paragraph("Next Steps", styles["SectionHeading"]))
        for step in report.next_steps:
            story.append(Paragraph(f"• {step}", styles["BodyTextCustom"]))
        story.append(Spacer(1, 12))

        # Confidence Score
        story.append(Paragraph(f"<b>Overall Confidence Score:</b> {report.confidence * 100:.1f}%", styles["BodyTextCustom"]))

        # Build PDF
        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
