# MediKiosk — AI Clinical Intake & Pre-Consultation Platform

MediKiosk is an AI-powered clinical intake and pre-consultation platform designed for high-volume Indian hospitals and AYUSH institutions. It enables patients to register via ABHA, give audio-guided consent, complete an adaptive voice/touch clinical interview, scan medical documents with OCR extraction, build chronological timelines, trigger real-time emergency red-flag triage alerts, and generate physician-verified clinical summaries.

---

## 🌟 Key Features

1. **Healthcare Safety Guarantee**: Operating strictly as an intake and pre-consultation tool. All AI summaries are tagged: *"AI-generated draft — requires clinician verification."*
2. **Pluggable AI Abstraction Layer**: Pluggable provider architecture featuring a deterministic, rule/ontology-driven `MockAIProvider` for 100% reliable offline/SIH demo operation alongside support for real LLM APIs (`RealAIProvider`).
3. **Multilingual Touch Kiosk Interface**: Supports Hindi, English, Hinglish, and regional Indian languages with Web Speech API audio instructions and dual Voice + Touch input controls.
4. **Adaptive Question Engine & AYUSH Mode**: Clinical ontology question trees for top complaints (Chest Pain, Headache, Fever, Abdominal Pain, Cough) as well as dedicated AYUSH history taking (Prakriti, Vikriti, Agni, Koshtha, Ahara-Vihara).
5. **OCR & Document Extraction Pipeline**: OCR service extracting medications, dates, lab values, and reference ranges alongside split-screen original image vs tabular verification review UI.
6. **Red-Flag Safety Engine & Nurse Triage**: Real-time Socket.IO alerts for emergency symptom combinations with triage acknowledgment and escalation workflows.
7. **Doctor Workstation & Version Control**: Editable summary cards with version history (V1 AI Draft -> V2 Doctor Edit -> V3 Approved), medical timeline visualization, Recharts lab trends, and one-click **"APPROVE CLINICAL HISTORY"**.
8. **ABDM / FHIR / HIS Sandbox**: Standardized FHIR resource bundle mapping and mock ABDM/HIS endpoints.
9. **Hospital Analytics & Kiosk Health**: Aggregate throughput analytics, AI precision metrics, kiosk device heartbeat monitoring, and immutable security audit logs.
10. **SIH Presentation Demo Mode**: Pre-seeded demo cases, test accounts, and side-by-side "Before vs After MediKiosk" measured impact dashboard.

---

## 🏗️ Project Architecture

```
SIH 2026 I/
├── client/                     # Vite + React + Tailwind CSS + Lucide Icons + Recharts
├── server/                     # Node.js + Express + MongoDB + Socket.IO + AI Layer
├── shared/                     # Shared validation schemas & constants
├── scripts/                    # Database seeder script (seed.js)
├── docs/                       # Architecture, API, DB, AI & Security Documentation
├── .env.example
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Installation
Clone the repository and install dependencies for both server and client:

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 2. Environment Setup
Create a `.env` file inside `server/` or copy from `.env.example`:

```bash
cp .env.example server/.env
```

### 3. Seed Database & Demo Data
Run the database seeder script to populate realistic fictional patients, doctors, nurses, prescriptions, and triage alerts:

```bash
node scripts/seed.js
```

### 4. Running Backend Server
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

### 5. Running Frontend Application
```bash
cd client
npm run dev
# Client running on http://localhost:3000
```

---

## 🔑 SIH Demo Test Accounts

| Role | Email | Password | Workstation Route |
| :--- | :--- | :--- | :--- |
| **Doctor (Cardiology)** | `doctor@medikiosk.org` | `password123` | `/doctor` |
| **AYUSH Doctor** | `ayush.doctor@medikiosk.org` | `password123` | `/doctor` |
| **Nurse / Triage** | `nurse@medikiosk.org` | `password123` | `/nurse` |
| **Hospital Admin** | `admin@medikiosk.org` | `password123` | `/admin` |
| **Patient Kiosk** | Self-Service | — | `/kiosk` |
| **SIH Presentation Mode** | — | — | `/` |

---

## 📜 Security & Safety Compliance
- **Human Sign-Off Required**: Clinical summaries cannot reach approved status without physician sign-off.
- **Audit Trails**: All data accesses, consent grants, and summary approvals are logged immutably in `AuditLog`.
- **ABDM Standards**: Built compliant with NDHM / ABDM Sandbox data privacy guidelines.
