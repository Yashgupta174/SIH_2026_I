# MediKiosk Database Schemas & Data Model

## Mongo Collections Overview
1. **User**: Hashed credentials, system roles (`PATIENT`, `DOCTOR`, `NURSE`, `RECEPTIONIST`, `HOSPITAL_ADMIN`, `KIOSK_ADMIN`, `SUPER_ADMIN`), department.
2. **Patient**: Demographics, ABHA ID, mobile number, emergency contacts, medical summary refs.
3. **ClinicalSession**: State machine tracking (`CREATED` -> `INTERVIEWING` -> `SUMMARY_GENERATING` -> `READY_FOR_DOCTOR` -> `APPROVED`), mode (`GENERAL`, `AYUSH`), answer items array with confidence & voice source tags.
4. **Consent**: Audit-compliant consent records (purpose, language, timestamp, status).
5. **Document**: Medical prescriptions/lab reports, quality scores, raw OCR text, extracted entities array.
6. **RedFlagAlert**: Emergency alerts (`CRITICAL`, `HIGH`), rule ID, triggered symptom answers, assigned nurse.
7. **ClinicalSummary**: Physician summary card, disclaimer tag, version array (V1 AI -> V2 Doctor Edit -> V3 Approved), provenance details.
8. **AuditLog**: Immutable action trailing log.
9. **Kiosk**: Device hardware health, heartbeat ping, camera/mic/scanner statuses.
