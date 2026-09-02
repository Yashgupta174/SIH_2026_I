from typing import List, Dict, Any, Optional
from app.schemas.interview import QuestionResponse, SessionState, AnswerItem


class ClinicalQuestionTree:
    AYUSH_QUESTIONS = [
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

    GENERAL_TREES = {
        "chest_pain": [
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
        ],
        "fever": [
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
        ],
        "default": [
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
        ],
    }

    @classmethod
    def get_tree_for_complaint(cls, complaint: str) -> List[Dict[str, Any]]:
        c = (complaint or "").lower()
        if "chest" in c or "seene" in c or "cardiac" in c or "pain" in c or "dard" in c:
            return cls.GENERAL_TREES["chest_pain"]
        elif "fever" in c or "bukhar" in c or "headache" in c or "sir" in c:
            return cls.GENERAL_TREES["fever"]
        return cls.GENERAL_TREES["default"]
