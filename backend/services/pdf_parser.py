import fitz

def extract_pdf_context(pdf_bytes: bytes) -> dict:
    """
    Extracts text and page count from a PDF byte stream using PyMuPDF.
    Returns:
        dict containing 'text' (str) and 'page_count' (int)
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text() + "\n"
    
    return {
        "text": text.strip(),
        "page_count": doc.page_count
    }
