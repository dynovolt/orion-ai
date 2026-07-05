from datetime import datetime, timezone

# In-memory document storage
STORE = {}

class KnowledgeBase:
    @staticmethod
    def add_document(document_id: str, filename: str, page_count: int, text: str, summary: str = None) -> dict:
        doc_data = {
            "document_id": document_id,
            "filename": filename,
            "uploaded_at": datetime.now(timezone.utc).isoformat(),
            "page_count": page_count,
            "text": text,
            "summary": summary
        }
        STORE[document_id] = doc_data
        return doc_data

    @staticmethod
    def get_document(document_id: str) -> dict:
        return STORE.get(document_id)

    @staticmethod
    def list_documents() -> list:
        return list(STORE.values())
