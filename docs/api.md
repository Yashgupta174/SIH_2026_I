# MediKiosk REST API Documentation

## Auth Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Authenticate user & get JWT
- `GET /api/auth/me` - Get logged-in user profile

## Patient & Registration Endpoints
- `POST /api/patients` - Create patient profile
- `POST /api/patients/verify-abha` - ABDM ABHA ID sandbox lookup
- `GET /api/patients/:id` - Fetch patient profile
- `GET /api/patients/:id/timeline` - Retrieve merged medical timeline

## Clinical Session & Interview Endpoints
- `POST /api/clinical-sessions` - Start new clinical intake session
- `GET /api/clinical-sessions/:id` - Get session details & answers
- `POST /api/clinical-sessions/:id/answers` - Submit question answer & run Red Flag check
- `POST /api/clinical-sessions/transcribe` - Audio STT transcription
- `POST /api/clinical-sessions/:id/generate-summary` - Trigger AI Summary Engine

## Doctor & Verification Endpoints
- `GET /api/doctor/queue` - Fetch doctor patient intake queue
- `PATCH /api/doctor/summary/:summaryId` - Doctor summary edit & versioning
- `POST /api/doctor/summary/:summaryId/approve` - Approve clinical history & push to HIS/ABDM

## Triage & Emergency Alerts Endpoints
- `GET /api/triage/alerts` - Fetch real-time red flag triage alerts
- `PATCH /api/triage/alerts/:alertId` - Acknowledge, escalate, or resolve triage alert

## Document OCR Endpoints
- `POST /api/documents/upload` - Upload document, run quality check & OCR extraction
- `GET /api/documents/:id` - View document details
- `PATCH /api/documents/:docId/entities/:entityId` - Verify/edit extracted entity field
