const AIProviderInterface = require('./aiProviderInterface');
const { RED_FLAG_RULES } = require('../../constants/redFlags');

class MockAIProvider extends AIProviderInterface {
  async transcribeAudio(audioBuffer, language = 'hi') {
    // Simulates high-accuracy speech-to-text processing for Indian English & Hindi
    const transcriptions = {
      hi: 'Mujhe pichle 2 din se seene mein dard aur saans lene mein taklif ho rahi hai.',
      en: 'I have been experiencing chest pain and shortness of breath for the past 2 days.',
      hinglish: 'Seene mein sharp pain hai jo left arm tak jaata hai.',
    };
    return {
      text: transcriptions[language] || transcriptions['hi'],
      confidence: 0.96,
      languageDetected: language,
    };
  }

  async getNextQuestion(sessionState, lastAnswer) {
    const answers = sessionState.answers || [];
    const chiefComplaint = (sessionState.chiefComplaint || '').toLowerCase();
    const isAyush = sessionState.intakeMode === 'AYUSH';
    const lang = sessionState.language || 'hi';

    // Count answered questions
    const count = answers.length;

    // AYUSH History Tree
    if (isAyush) {
      const ayushQuestions = [
        {
          id: 'ayush_prakriti_body',
          questionText: {
            hi: 'Aapka shareerik gathan (body build) kaisa hai?',
            en: 'What is your natural body constitution build?',
          },
          category: 'AYUSH Prakriti',
          options: ['Patla/Halka (Vata)', 'Madhyam/Garmi jyada (Pitta)', 'Bhaari/Shaant (Kapha)'],
        },
        {
          id: 'ayush_agni_appetite',
          questionText: {
            hi: 'Aapki paachan shakti (Agni/Bhookh) kaisi rehti hai?',
            en: 'How is your digestion and appetite (Agni)?',
          },
          category: 'AYUSH Agni',
          options: ['Kabhibhi badalti hai (Vishama)', 'Teez bhookh (Tikshna)', 'Mandi/Dhimi (Manda)', 'Samanya (Sama)'],
        },
        {
          id: 'ayush_koshtha_bowel',
          questionText: {
            hi: 'Aapka pet (Koshtha/Bowel movement) saaf hone ki sthiti kya hai?',
            en: 'What is your bowel movement tendency (Koshtha)?',
          },
          category: 'AYUSH Koshtha',
          options: ['Katha/Kabz (Kroura)', 'Mridu/Roz saaf (Mridu)', 'Samanya (Madhyama)'],
        },
        {
          id: 'ayush_ahara_diet',
          questionText: {
            hi: 'Aapke aahaar (bojan) mein kis rasa ki pradhanata hai?',
            en: 'What taste predominates in your daily diet?',
          },
          category: 'AYUSH Ahara',
          options: ['Teekha/Masaledar', 'Meetha/Ghee-Doodh', 'Khatta/Namkeen', 'Kasaaya/Karwa'],
        },
      ];

      if (count < ayushQuestions.length) {
        const q = ayushQuestions[count];
        return {
          questionId: q.id,
          questionText: q.questionText[lang] || q.questionText['en'],
          category: q.category,
          options: q.options,
          progressPercent: Math.round(((count + 1) / 8) * 100),
          isFinal: false,
        };
      }
    }

    // General Clinical Question Engine based on Chief Complaint
    let questionTree = [];

    if (chiefComplaint.includes('chest') || chiefComplaint.includes('seene') || chiefComplaint.includes('dard') || chiefComplaint.includes('pain')) {
      questionTree = [
        {
          id: 'cc_duration',
          questionText: {
            hi: 'Yeh dard kitne samay se ho raha hai?',
            en: 'How long have you had this pain?',
          },
          category: 'HPI Duration',
          options: ['Aaj se (Few hours)', '1-2 din se', '1 saptaah se', 'Puraane 1 mahine se'],
        },
        {
          id: 'cc_radiation',
          questionText: {
            hi: 'Kya yeh dard kandhe, left arm ya jabde (jaw) ki taraf jaata hai?',
            en: 'Does the pain radiate to your left arm, shoulder, or jaw?',
          },
          category: 'HPI Radiation',
          options: ['Haan, Left Arm mein', 'Haan, Jabde (Jaw) mein', 'Peeth (Back) mein', 'Nahi, sirf seene mein'],
        },
        {
          id: 'cc_associated',
          questionText: {
            hi: 'Kya dard ke saath saans phoolna (breathlessness) ya pasina (sweating) aa raha hai?',
            en: 'Are you experiencing breathlessness, sweating, or dizziness?',
          },
          category: 'Associated Symptoms',
          options: ['Saans phoolna & Pasina', 'Sirf Saans phoolna', 'Chakkar aana', 'Nahi, kuchh nahi'],
        },
        {
          id: 'cc_cardiac_history',
          questionText: {
            hi: 'Kya aapko High Blood Pressure, Sugar, ya pehle se Cardiac problem hai?',
            en: 'Do you have a prior history of Hypertension, Diabetes, or Heart conditions?',
          },
          category: 'Past History',
          options: ['High BP', 'Diabetes (Sugar)', 'Dono (BP + Sugar)', 'Koi bimari nahi'],
        },
      ];
    } else if (chiefComplaint.includes('headache') || chiefComplaint.includes('sir') || chiefComplaint.includes('fever') || chiefComplaint.includes('bukhar')) {
      questionTree = [
        {
          id: 'fever_duration',
          questionText: {
            hi: 'Bukhar kitne samay se hai aur kitna tez hai?',
            en: 'How long have you had fever and how severe is it?',
          },
          category: 'HPI Duration',
          options: ['1-2 din (Halka)', '3-5 din (Tez)', '1 saptaah se adhik', 'Thand lagkar aata hai'],
        },
        {
          id: 'fever_symptoms',
          questionText: {
            hi: 'Kya bukhar ke saath sar dard, ulti ya shreed dard hai?',
            en: 'Do you have accompanying headache, vomiting, or body aches?',
          },
          category: 'Associated Symptoms',
          options: ['Sar dard + Badan dard', 'Ulti/Ghabrahat', 'Khansi + Gale mein kharash', 'Sirf bukhar'],
        },
      ];
    } else {
      // Default general clinical flow
      questionTree = [
        {
          id: 'gen_duration',
          questionText: {
            hi: 'Yeh samasya kab se shuru hui hai?',
            en: 'When did this issue first start?',
          },
          category: 'HPI Duration',
          options: ['Aaj se (Recently)', '2-3 din se', '1-2 saptaah se', 'Puraani samasya hai'],
        },
        {
          id: 'gen_severity',
          questionText: {
            hi: 'Aap is takleef ko 1 se 10 ke paimane (scale) par kitna severely rate karenge?',
            en: 'How severe is your discomfort on a scale of 1 to 10?',
          },
          category: 'HPI Severity',
          options: ['1-3 (Halka / Mild)', '4-6 (Madhyam / Moderate)', '7-10 (Bohot Tez / Severe)'],
        },
        {
          id: 'gen_meds',
          questionText: {
            hi: 'Kya aap abhi koi dawai (medication) le rahe hain?',
            en: 'Are you currently taking any regular medications?',
          },
          category: 'Current Medications',
          options: ['Haan, Regular medicines', 'Nahi, koi medicine nahi', 'Kabhi-kabhi painkiller'],
        },
      ];
    }

    if (count < questionTree.length) {
      const q = questionTree[count];
      return {
        questionId: q.id,
        questionText: q.questionText[lang] || q.questionText['en'],
        category: q.category,
        options: q.options,
        progressPercent: Math.round(((count + 1) / (questionTree.length + 2)) * 100),
        isFinal: false,
      };
    }

    // Final wrapping question
    return {
      questionId: 'final_allergies',
      questionText: {
        hi: 'Kya aapko kisi dawai ya cheez se allergy hai?',
        en: 'Do you have any known drug or substance allergies?',
      }[lang] || 'Do you have any known drug or substance allergies?',
      category: 'Allergies',
      options: ['Penicillin / Antibiotics allergy', 'Sulfa drugs', 'Food allergy', 'Koi allergy nahi'],
      progressPercent: 100,
      isFinal: true,
    };
  }

  async extractClinicalEntities(rawText, context = {}) {
    return {
      chiefComplaint: 'Chest pain radiating to left shoulder',
      duration: '2 days',
      severity: '7/10 Severe',
      associatedSymptoms: ['Shortness of breath', 'Mild sweating'],
      riskFactors: ['Hypertension', 'Age > 50'],
      confidence: 0.94,
    };
  }

  async processDocumentOCR(fileBuffer, fileMetadata = {}) {
    const documentTypes = {
      prescription: {
        docType: 'PRESCRIPTION',
        qualityScore: 0.96,
        rawOcrText: 'Dr. Sharma Clinic - Metro Hospital, New Delhi\nDate: 12-Aug-2025\nRx: Metformin 500mg BD x 1 month\nAmlodipine 5mg OD\nParacetamol 650mg SOS',
        extractedEntities: [
          { field: 'Doctor', value: 'Dr. Sharma', confidence: 0.98, page: 1 },
          { field: 'Hospital', value: 'Metro Hospital', confidence: 0.97, page: 1 },
          { field: 'Date', value: '12-Aug-2025', confidence: 0.99, page: 1 },
          { field: 'Medication', value: 'Metformin 500 mg', unit: 'mg', confidence: 0.95, sourceSnippet: 'Metformin 500mg BD' },
          { field: 'Medication', value: 'Amlodipine 5 mg', unit: 'mg', confidence: 0.94, sourceSnippet: 'Amlodipine 5mg OD' },
          { field: 'Medication', value: 'Paracetamol 650 mg', unit: 'mg', confidence: 0.96, sourceSnippet: 'Paracetamol 650mg SOS' },
        ],
      },
      lab: {
        docType: 'LAB_REPORT',
        qualityScore: 0.92,
        rawOcrText: 'Thyrocare Labs\nTest: Hemoglobin\nResult: 10.2 g/dL (Ref: 13.0 - 17.0)\nBlood Glucose Fasting: 142 mg/dL (Ref: 70 - 100)',
        extractedEntities: [
          { field: 'Lab Test', value: 'Hemoglobin', unit: 'g/dL', referenceRange: '13.0 - 17.0 g/dL', confidence: 0.96, sourceSnippet: 'Hemoglobin 10.2 g/dL' },
          { field: 'Lab Test', value: 'Blood Glucose Fasting', unit: 'mg/dL', referenceRange: '70 - 100 mg/dL', confidence: 0.95, sourceSnippet: 'Glucose 142 mg/dL' },
        ],
      },
    };

    const docTypeKey = (fileMetadata.fileName || '').toLowerCase().includes('lab') ? 'lab' : 'prescription';
    return documentTypes[docTypeKey];
  }

  async generateClinicalSummary(session, answers = [], documents = [], mode = 'GENERAL') {
    const chiefComplaint = session.chiefComplaint || 'Chest discomfort & mild breathlessness';
    const isAyush = mode === 'AYUSH' || session.intakeMode === 'AYUSH';

    const provenance = [
      { field: 'Chief Complaint', value: chiefComplaint, sourceType: 'PATIENT_REPORTED', confidence: 0.98 },
      { field: 'Medications', value: 'Metformin 500mg, Amlodipine 5mg', sourceType: 'DOCUMENT_EXTRACTED', confidence: 0.95 },
      { field: 'Cardiac Risk', value: 'Elevated due to radiating chest pain & BP history', sourceType: 'AI_INFERRED', confidence: 0.88 },
    ];

    const hpiAnswers = answers.map(a => `${a.questionText}: ${a.answerValue}`).join('; ');

    return {
      disclaimer: 'AI-generated draft — requires clinician verification.',
      chiefComplaint,
      historyOfPresentIllness: hpiAnswers || 'Patient presents with sharp retrosternal chest pain starting 2 days ago, rated 7/10 in severity. Pain radiates intermittently to left shoulder accompanied by mild breathlessness during physical exertion.',
      pastMedicalHistory: 'Hypertension (diagnosed 2022), Type 2 Diabetes Mellitus.',
      pastSurgicalHistory: 'No history of prior thoracic or major surgical procedures reported.',
      currentMedications: 'Tab Metformin 500mg BD, Tab Amlodipine 5mg OD (verified from uploaded prescription dated Aug 2025).',
      allergies: 'No known drug allergies reported.',
      familyHistory: 'Father had history of Coronary Artery Disease.',
      personalHistory: 'Non-smoker, occasional tea drinker, normal sleep pattern.',
      reviewOfSystems: 'Cardiovascular: Chest discomfort present. Respiratory: Mild exertional breathlessness. Gastrointestinal: Normal. Neurological: No syncope.',
      ayushAssessment: isAyush ? {
        prakriti: 'Pitta-Vata Predominant',
        vikriti: 'Vata Vriddhi & Agni Mandya',
        agni: 'Vishama Agni',
        koshtha: 'Madhyama Koshtha',
        aharaVihara: 'Prefers warm spicy food; irregular sleep schedule.',
      } : null,
      redFlags: session.redFlagAlerts?.length ? 'CRITICAL ALERT: Chest pain radiating to arm detected.' : 'None detected during initial intake.',
      missingOrUnclearInfo: 'Exact onset time of chest pain episode today; ECG report from last visit.',
      provenance,
    };
  }

  async evaluateRedFlags(answers = [], chiefComplaint = '') {
    const triggered = [];
    const combinedAnswers = [...answers, { questionText: 'Chief Complaint', answerValue: chiefComplaint }];

    for (const rule of RED_FLAG_RULES) {
      if (rule.condition(combinedAnswers)) {
        triggered.push({
          ruleId: rule.id,
          title: rule.title,
          category: rule.category,
          severity: rule.severity,
          recommendedAction: rule.action,
          patientMessage: rule.patientMessage,
          triggeredAnswers: combinedAnswers.map(a => ({ question: a.questionText || 'Complaint', answer: a.answerValue || '' })),
        });
      }
    }
    return triggered;
  }

  async translateText(text, targetLanguage = 'hi') {
    const dict = {
      'Chest pain': 'छाती में दर्द (Chest pain)',
      'Shortness of breath': 'सांस लेने में तकलीफ (Shortness of breath)',
      'High Blood Pressure': 'उच्च रक्तचाप (High BP)',
      'Fever': 'बुखार (Fever)',
    };
    return dict[text] || text;
  }
}

module.exports = MockAIProvider;
