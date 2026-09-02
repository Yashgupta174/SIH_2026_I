from typing import Dict, Any, List, Optional
from app.services.providers.base import BaseAIProvider
from app.schemas.ocr import ParsedDocumentResponse, ExtractedEntity
from app.schemas.interview import QuestionResponse, SessionState, AnswerItem
from app.schemas.summary import SummaryResponse, AyushAssessment, ProvenanceItem
from app.schemas.red_flags import RedFlagRuleTrigger
from app.schemas.speech import STTResponse


class MockAIProvider(BaseAIProvider):
    async def transcribe_audio(self, audio_bytes: bytes, language: str = "hi") -> STTResponse:
        transcriptions = {
            "hi": "Mujhe pichle 2 din se seene mein dard aur saans lene mein taklif ho rahi hai.",
            "en": "I have been experiencing chest pain and shortness of breath for the past 2 days.",
            "hinglish": "Seene mein sharp pain hai jo left arm tak jaata hai.",
        }
        return STTResponse(
            text=transcriptions.get(language, transcriptions["hi"]),
            confidence=0.96,
            languageDetected=language,
        )

    async def get_next_question(
        self, session_state: SessionState, last_answer: Optional[AnswerItem] = None
    ) -> QuestionResponse:
        answers = session_state.answers or []
        chief_complaint = (session_state.chiefComplaint or "").lower()
        is_ayush = session_state.intakeMode == "AYUSH"
        lang = session_state.language or "hi"
        count = len(answers)

        # AYUSH Questionnaire Flow
        if is_ayush:
            ayush_questions = [
                {
                    "id": "ayush_prakriti_body",
                    "questionText": {
                        "hi": "Aapka shareerik gathan (body build) kaisa hai?",
                        "en": "What is your natural body constitution build?",
                    },
                    "category": "AYUSH Prakriti",
                    "options": ["Patla/Halka (Vata)", "Madhyam/Garmi jyada (Pitta)", "Bhaari/Shaant (Kapha)"],
                },
                {
                    "id": "ayush_agni_appetite",
                    "questionText": {
                        "hi": "Aapki paachan shakti (Agni/Bhookh) kaisi rehti hai?",
                        "en": "How is your digestion and appetite (Agni)?",
                    },
                    "category": "AYUSH Agni",
                    "options": ["Kabhibhi badalti hai (Vishama)", "Teez bhookh (Tikshna)", "Mandi/Dhimi (Manda)", "Samanya (Sama)"],
                },
                {
                    "id": "ayush_koshtha_bowel",
                    "questionText": {
                        "hi": "Aapka pet (Koshtha/Bowel movement) saaf hone ki sthiti kya hai?",
                        "en": "What is your bowel movement tendency (Koshtha)?",
                    },
                    "category": "AYUSH Koshtha",
                    "options": ["Katha/Kabz (Kroura)", "Mridu/Roz saaf (Mridu)", "Samanya (Madhyama)"],
                },
                {
                    "id": "ayush_ahara_diet",
                    "questionText": {
                        "hi": "Aapke aahaar (bojan) mein kis rasa ki pradhanata hai?",
                        "en": "What taste predominates in your daily diet?",
                    },
                    "category": "AYUSH Ahara",
                    "options": ["Teekha/Masaledar", "Meetha/Ghee-Doodh", "Khatta/Namkeen", "Kasaaya/Karwa"],
                },
            ]
            if count < len(ayush_questions):
                q = ayush_questions[count]
                return QuestionResponse(
                    questionId=q["id"],
                    questionText=q["questionText"].get(lang, q["questionText"]["en"]),
                    category=q["category"],
                    options=q["options"],
                    progressPercent=int(((count + 1) / 5) * 100),
                    isFinal=False,
                )

        # General Clinical Questionnaire Trees
        if "chest" in chief_complaint or "seene" in chief_complaint or "cardiac" in chief_complaint or "pain" in chief_complaint or "dard" in chief_complaint:
            tree = [
                {
                    "id": "cc_duration",
                    "questionText": {
                        "hi": "Yeh dard kitne samay se ho raha hai?",
                        "en": "How long have you had this pain?",
                    },
                    "category": "HPI Duration",
                    "options": ["Aaj se (Few hours)", "1-2 din se", "1 saptaah se", "Puraane 1 mahine se"],
                },
                {
                    "id": "cc_radiation",
                    "questionText": {
                        "hi": "Kya yeh dard kandhe, left arm ya jabde (jaw) ki taraf jaata hai?",
                        "en": "Does the pain radiate to your left arm, shoulder, or jaw?",
                    },
                    "category": "HPI Radiation",
                    "options": ["Haan, Left Arm mein", "Haan, Jabde (Jaw) mein", "Peeth (Back) mein", "Nahi, sirf seene mein"],
                },
                {
                    "id": "cc_associated",
                    "questionText": {
                        "hi": "Kya dard ke saath saans phoolna (breathlessness) ya pasina (sweating) aa raha hai?",
                        "en": "Are you experiencing breathlessness, sweating, or dizziness?",
                    },
                    "category": "Associated Symptoms",
                    "options": ["Saans phoolna & Pasina", "Sirf Saans phoolna", "Chakkar aana", "Nahi, kuchh nahi"],
                },
                {
                    "id": "cc_cardiac_history",
                    "questionText": {
                        "hi": "Kya aapko High Blood Pressure, Sugar, ya pehle se Cardiac problem hai?",
                        "en": "Do you have a prior history of Hypertension, Diabetes, or Heart conditions?",
                    },
                    "category": "Past History",
                    "options": ["High BP", "Diabetes (Sugar)", "Dono (BP + Sugar)", "Koi bimari nahi"],
                },
            ]
        elif "headache" in chief_complaint or "sir" in chief_complaint or "fever" in chief_complaint or "bukhar" in chief_complaint:
            tree = [
                {
                    "id": "fever_duration",
                    "questionText": {
                        "hi": "Bukhar kitne samay se hai aur kitna tez hai?",
                        "en": "How long have you had fever and how severe is it?",
                    },
                    "category": "HPI Duration",
                    "options": ["1-2 din (Halka)", "3-5 din (Tez)", "1 saptaah se adhik", "Thand lagkar aata hai"],
                },
                {
                    "id": "fever_symptoms",
                    "questionText": {
                        "hi": "Kya bukhar ke saath sar dard, ulti ya shreed dard hai?",
                        "en": "Do you have accompanying headache, vomiting, or body aches?",
                    },
                    "category": "Associated Symptoms",
                    "options": ["Sar dard + Badan dard", "Ulti/Ghabrahat", "Khansi + Gale mein kharash", "Sirf bukhar"],
                },
            ]
        else:
            tree = [
                {
                    "id": "gen_duration",
                    "questionText": {
                        "hi": "Yeh samasya kab se shuru hui hai?",
                        "en": "When did this issue first start?",
                    },
                    "category": "HPI Duration",
                    "options": ["Aaj se (Recently)", "2-3 din se", "1-2 saptaah se", "Puraani samasya hai"],
                },
                {
                    "id": "gen_severity",
                    "questionText": {
                        "hi": "Aap is takleef ko 1 se 10 ke paimane par kitna severely rate karenge?",
                        "en": "How severe is your discomfort on a scale of 1 to 10?",
                    },
                    "category": "HPI Severity",
                    "options": ["1-3 (Halka / Mild)", "4-6 (Madhyam / Moderate)", "7-10 (Bohot Tez / Severe)"],
                },
                {
                    "id": "gen_meds",
                    "questionText": {
                        "hi": "Kya aap abhi koi dawai (medication) le rahe hain?",
                        "en": "Are you currently taking any regular medications?",
                    },
                    "category": "Current Medications",
                    "options": ["Haan, Regular medicines", "Nahi, koi medicine nahi", "Kabhi-kabhi painkiller"],
                },
            ]

        if count < len(tree):
            q = tree[count]
            return QuestionResponse(
                questionId=q["id"],
                questionText=q["questionText"].get(lang, q["questionText"]["en"]),
                category=q["category"],
                options=q["options"],
                progressPercent=int(((count + 1) / (len(tree) + 1)) * 100),
                isFinal=False,
            )

        # Final Question
        return QuestionResponse(
            questionId="final_allergies",
            questionText={
                "hi": "Kya aapko kisi dawai ya cheez se allergy hai?",
                "en": "Do you have any known drug or substance allergies?",
            }.get(lang, "Do you have any known drug or substance allergies?"),
            category="Allergies",
            options=["Penicillin / Antibiotics allergy", "Sulfa drugs", "Food allergy", "Koi allergy nahi"],
            progressPercent=100,
            isFinal=True,
        )

    async def process_document_ocr(
        self, file_bytes: bytes, file_name: str = "", content_type: str = ""
    ) -> ParsedDocumentResponse:
        is_lab = "lab" in file_name.lower() or "report" in file_name.lower()

        if is_lab:
            return ParsedDocumentResponse(
                docType="LAB_REPORT",
                qualityScore=0.92,
                rawOcrText="Thyrocare Labs\nTest: Hemoglobin\nResult: 10.2 g/dL (Ref: 13.0 - 17.0)\nBlood Glucose Fasting: 142 mg/dL (Ref: 70 - 100)",
                extractedEntities=[
                    ExtractedEntity(field="Lab Test", value="Hemoglobin 10.2", unit="g/dL", referenceRange="13.0 - 17.0 g/dL", confidence=0.96, sourceSnippet="Hemoglobin 10.2 g/dL", page=1),
                    ExtractedEntity(field="Lab Test", value="Blood Glucose Fasting 142", unit="mg/dL", referenceRange="70 - 100 mg/dL", confidence=0.95, sourceSnippet="Glucose 142 mg/dL", page=1),
                ],
                confidence=0.94,
            )
        
        return ParsedDocumentResponse(
            docType="PRESCRIPTION",
            qualityScore=0.96,
            rawOcrText="Dr. Sharma Clinic - Metro Hospital, New Delhi\nDate: 12-Aug-2025\nRx: Metformin 500mg BD x 1 month\nAmlodipine 5mg OD\nParacetamol 650mg SOS",
            extractedEntities=[
                ExtractedEntity(field="Doctor", value="Dr. Sharma", confidence=0.98, page=1),
                ExtractedEntity(field="Hospital", value="Metro Hospital", confidence=0.97, page=1),
                ExtractedEntity(field="Date", value="12-Aug-2025", confidence=0.99, page=1),
                ExtractedEntity(field="Medication", value="Metformin 500 mg", unit="mg", confidence=0.95, sourceSnippet="Metformin 500mg BD", page=1),
                ExtractedEntity(field="Medication", value="Amlodipine 5 mg", unit="mg", confidence=0.94, sourceSnippet="Amlodipine 5mg OD", page=1),
                ExtractedEntity(field="Medication", value="Paracetamol 650 mg", unit="mg", confidence=0.96, sourceSnippet="Paracetamol 650mg SOS", page=1),
            ],
            confidence=0.95,
        )

    async def generate_clinical_summary(
        self,
        chief_complaint: str,
        answers: List[Dict[str, Any]],
        documents: List[Dict[str, Any]],
        mode: str = "GENERAL",
    ) -> SummaryResponse:
        is_ayush = mode == "AYUSH"
        cc = chief_complaint or "Chest pain & mild breathlessness"
        
        hpi = "; ".join([f"{a.get('questionText', 'Question')}: {a.get('answerValue', 'N/A')}" for a in answers]) if answers else (
            "Patient presents with sharp retrosternal chest pain starting 2 days ago, rated 7/10 in severity. "
            "Pain radiates intermittently to left shoulder accompanied by mild breathlessness during physical exertion."
        )

        provenance = [
            ProvenanceItem(field="Chief Complaint", value=cc, sourceType="PATIENT_REPORTED", confidence=0.98),
            ProvenanceItem(field="Medications", value="Metformin 500mg BD, Amlodipine 5mg OD", sourceType="DOCUMENT_EXTRACTED", confidence=0.95),
            ProvenanceItem(field="Cardiac Risk Factors", value="Hypertension, exertion dyspnea", sourceType="AI_INFERRED", confidence=0.89),
        ]

        ayush_data = AyushAssessment(
            prakriti="Pitta-Vata Predominant",
            vikriti="Vata Vriddhi & Agni Mandya",
            agni="Vishama Agni",
            koshtha="Madhyama Koshtha",
            aharaVihara="Prefers warm spicy food; irregular sleep schedule.",
        ) if is_ayush else None

        return SummaryResponse(
            disclaimer="AI-generated draft — requires clinician verification.",
            chiefComplaint=cc,
            historyOfPresentIllness=hpi,
            pastMedicalHistory="Hypertension (diagnosed 2022), Type 2 Diabetes Mellitus.",
            pastSurgicalHistory="No history of prior thoracic or major surgical procedures reported.",
            currentMedications="Tab Metformin 500mg BD, Tab Amlodipine 5mg OD (verified from prescription OCR).",
            allergies="No known drug allergies reported.",
            familyHistory="Father had history of Coronary Artery Disease.",
            personalHistory="Non-smoker, normal sleep pattern.",
            reviewOfSystems="Cardiovascular: Chest discomfort present. Respiratory: Mild exertional dyspnea. GI: Normal.",
            ayushAssessment=ayush_data,
            redFlags="ALERT: Left arm pain radiation detected during intake." if "arm" in hpi.lower() or "left" in hpi.lower() else "None detected.",
            missingOrUnclearInfo="Exact onset time of chest pain episode today; ECG from last hospital visit.",
            provenance=provenance,
        )

    async def evaluate_red_flags(
        self, answers: List[Dict[str, Any]], chief_complaint: str = ""
    ) -> List[RedFlagRuleTrigger]:
        all_text = (chief_complaint + " " + " ".join([str(a.get("answerValue", "")) for a in answers])).lower()
        alerts = []

        if ("chest" in all_text or "seene" in all_text) and ("arm" in all_text or "left" in all_text or "saans" in all_text or "breath" in all_text):
            alerts.append(
                RedFlagRuleTrigger(
                    ruleId="rf_cardiac_chest_pain_radiating",
                    title="Potential Acute Coronary Syndrome (ACS)",
                    category="CARDIAC_EMERGENCY",
                    severity="CRITICAL",
                    recommendedAction="Immediate Triage Escalation: Perform STAT 12-lead ECG, check Vitals (BP, SpO2), notify Emergency Duty Doctor.",
                    patientMessage="Please remain seated. A nurse is coming immediately to check your vitals.",
                    triggeredAnswers=[{"question": "Chief Complaint / Answer", "answer": all_text[:100]}],
                )
            )

        if "fever" in all_text and ("stiff" in all_text or "gardan" in all_text):
            alerts.append(
                RedFlagRuleTrigger(
                    ruleId="rf_neuro_fever_stiff_neck",
                    title="Potential Meningeal Irritation / CNS Infection",
                    category="NEUROLOGICAL_EMERGENCY",
                    severity="CRITICAL",
                    recommendedAction="Immediate Isolation & Physician Triage.",
                    patientMessage="A clinical team member will assist you shortly.",
                    triggeredAnswers=[{"question": "Symptoms", "answer": all_text[:100]}],
                )
            )

        return alerts
