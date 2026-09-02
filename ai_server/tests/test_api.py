import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "aiProvider" in data


def test_next_question_general():
    payload = {
        "sessionState": {
            "chiefComplaint": "Chest pain radiating to left arm",
            "intakeMode": "GENERAL",
            "language": "hi",
            "answers": []
        }
    }
    response = client.post("/api/v1/interview/next-question", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "questionId" in data
    assert "questionText" in data
    assert "category" in data
    assert isinstance(data["options"], list)


def test_next_question_ayush():
    payload = {
        "sessionState": {
            "chiefComplaint": "Acidity and indigestion",
            "intakeMode": "AYUSH",
            "language": "hi",
            "answers": []
        }
    }
    response = client.post("/api/v1/interview/next-question", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "AYUSH" in data["category"]


def test_evaluate_red_flags():
    payload = {
        "chiefComplaint": "Chest pain",
        "answers": [
            {"questionText": "Radiation", "answerValue": "Left arm pain and breathlessness"}
        ]
    }
    response = client.post("/api/v1/clinical/evaluate-red-flags", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["hasRedFlags"] is True
    assert len(data["alerts"]) > 0
    assert data["alerts"][0]["severity"] == "CRITICAL"


def test_generate_summary():
    payload = {
        "chiefComplaint": "Chest discomfort",
        "intakeMode": "GENERAL",
        "answers": [
            {"questionText": "Duration", "answerValue": "2 days"}
        ],
        "documents": []
    }
    response = client.post("/api/v1/summary/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "disclaimer" in data
    assert "AI-generated draft" in data["disclaimer"]
    assert "provenance" in data
    assert len(data["provenance"]) > 0


def test_ocr_parse_document():
    files = {
        "file": ("prescription_test.png", b"Fake Image Data", "image/png")
    }
    response = client.post("/api/v1/ocr/parse-document", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "docType" in data
    assert "extractedEntities" in data
    assert "qualityScore" in data
