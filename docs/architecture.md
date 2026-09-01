# MediKiosk System Architecture & Technical Specification

## Overview
MediKiosk is an AI-powered clinical intake and pre-consultation platform designed for high-volume Indian hospitals and AYUSH institutions. It empowers patients to perform self-service digital identification via ABHA, receive audio-guided multi-lingual consent, complete AI-assisted clinical intake (Voice + Touch), upload medical reports for OCR extraction, and generate physician-ready clinical histories.

## Key Architectural Principles
1. **Safety Rule & Human-in-the-Loop**: The platform strictly collects, structures, and extracts information. It does **not** autonomously diagnose or prescribe. All summaries are tagged `"AI-generated draft — requires clinician verification."`
2. **Pluggable AI Abstraction Layer**: AI services (`speechService`, `conversationService`, `clinicalExtractionService`, `documentAIService`, `summaryService`, `redFlagService`, `translationService`) consume a clean `AIProvider` interface. Switching between `MockAIProvider` (offline/SIH demo logic) and `RealAIProvider` (OpenAI/Gemini LLMs) requires zero frontend or controller changes.
3. **Role-Based Access Control (RBAC)**: Backend authorization strictly verifies roles (`PATIENT`, `DOCTOR`, `NURSE`, `RECEPTIONIST`, `HOSPITAL_ADMIN`, `KIOSK_ADMIN`, `SUPER_ADMIN`).
4. **Socket.IO Real-Time Triage Sync**: Emergency red flag rules automatically broadcast alerts to active Nurse/Triage workstations.
5. **ABDM / FHIR / HIS Mock Sandbox**: Data structures map seamlessly to standard FHIR bundles and hospital EMR integration adapters.
