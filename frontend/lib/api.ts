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
