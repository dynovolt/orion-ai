import { MissionResponse } from "../types/mission";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function uploadDocument(file: File): Promise<{ document_id: string, message: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Error uploading document: ${response.statusText}`);
    }

    return await response.json();
}

export async function launchMission(missionText: string, documentId?: string | null): Promise<MissionResponse> {
    const body: any = { mission: missionText };
    if (documentId) {
        body.document_id = documentId;
    }

    const response = await fetch(`${API_URL}/mission`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Error launching mission: ${response.statusText}`);
    }

    return await response.json();
}

export async function downloadReportPdf(report: any): Promise<void> {
    const response = await fetch(`${API_URL}/report/download`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(report)
    });

    if (!response.ok) {
        throw new Error(`Error downloading PDF: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    
    const disposition = response.headers.get('content-disposition');
    let filename = "AIGENTIC_Executive_Report.pdf";
    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
            filename = matches[1].replace(/['"]/g, '');
        }
    }
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
