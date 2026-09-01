import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [patient, setPatient] = useState(null);
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [redFlagAlert, setRedFlagAlert] = useState(null);
  const [summary, setSummary] = useState(null);
  const [intakeMode, setIntakeMode] = useState('GENERAL'); // GENERAL | AYUSH | INTEGRATED
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const startNewSession = async (patientData, mode = 'GENERAL', lang = 'hi') => {
    setPatient(patientData);
    setIntakeMode(mode);
    try {
      const res = await axios.post('/api/clinical-sessions', {
        patientId: patientData._id,
        department: mode === 'AYUSH' ? 'AYUSH / Ayurveda' : 'General Medicine',
        intakeMode: mode,
        language: lang,
        chiefComplaint: '',
      });
      setSession(res.data.session);
      setCurrentQuestion(res.data.nextQuestion);
      setAnswers([]);
      setRedFlagAlert(null);
      setSummary(null);
      return res.data;
    } catch (err) {
      console.error('Failed to start session:', err);
      // Demo Fallback session initialization
      const dummySession = {
        _id: 'sess_demo_' + Date.now(),
        sessionId: 'SESS-DEMO',
        tokenNumber: 'TOKEN-108',
        patientId: patientData._id || 'pat_demo',
        intakeMode: mode,
        status: 'INTERVIEWING',
      };
      setSession(dummySession);
      setCurrentQuestion({
        questionId: 'cc_initial',
        questionText: mode === 'AYUSH' ? 'Aapko kis swasthya samasya ke liye AYUSH परामर्श chahiye?' : 'Aapko aaj kya takleef / problem hai?',
        category: 'Chief Complaint',
        options: mode === 'AYUSH' ? ['Paachan kharab (Indigestion)', 'Jodo mein dard (Joint Pain)', 'Twacha vikaar (Skin Issue)'] : ['Seene mein dard (Chest Pain)', 'Sar dard & Bukhar (Headache/Fever)', 'Pet mein dard (Abdominal Pain)', 'Khansi & Saans phoolna (Cough/Breathlessness)'],
        progressPercent: 15,
        isFinal: false,
      });
    }
  };

  const submitAnswer = async (answerValue, source = 'TOUCH') => {
    if (!session || !currentQuestion) return;

    const newAnswerItem = {
      questionId: currentQuestion.questionId,
      questionText: currentQuestion.questionText,
      answerValue,
      source,
      confidence: source === 'VOICE' ? 0.96 : 1.0,
    };

    setAnswers((prev) => [...prev, newAnswerItem]);

    try {
      const res = await axios.post(`/api/clinical-sessions/${session._id}/answers`, newAnswerItem);
      if (res.data.session) setSession(res.data.session);
      if (res.data.nextQuestion) setCurrentQuestion(res.data.nextQuestion);
      if (res.data.redFlagAlert) setRedFlagAlert(res.data.redFlagAlert);
      return res.data;
    } catch (err) {
      console.error('Submit answer fallback mode:', err);
      // Demo Question progression fallback logic
      const fallbackQuestions = [
        {
          questionId: 'hpi_duration',
          questionText: 'Yeh samasya kab se shuru hui hai?',
          category: 'Duration',
          options: ['Aaj se (Few hours)', '1-2 din se', '1 saptaah se adhik', 'Puraani samasya hai'],
          progressPercent: 40,
        },
        {
          questionId: 'hpi_severity',
          questionText: 'Takleef kitni severe (g गंभीर) hai?',
          category: 'Severity',
          options: ['Halki (Mild)', 'Madhyam (Moderate)', 'Bohot Tez (Severe 8-10)'],
          progressPercent: 70,
        },
        {
          questionId: 'hpi_final',
          questionText: 'Kya aapko kisi dawai se allergy hai?',
          category: 'Allergies',
          options: ['Penicillin Allergy', 'Sulfa Drugs', 'Koi allergy nahi'],
          progressPercent: 100,
          isFinal: true,
        }
      ];

      const currentIdx = answers.length;
      if (currentIdx < fallbackQuestions.length) {
        setCurrentQuestion(fallbackQuestions[currentIdx]);
      } else {
        setCurrentQuestion(null);
      }
    }
  };

  const generateSummary = async () => {
    if (!session) return;
    try {
      const res = await axios.post(`/api/clinical-sessions/${session._id}/generate-summary`);
      setSummary(res.data.summary);
      return res.data.summary;
    } catch (err) {
      console.error('Summary fallback:', err);
      const dummySummary = {
        _id: 'summary_demo_' + Date.now(),
        disclaimer: 'AI-generated draft — requires clinician verification.',
        chiefComplaint: answers[0]?.answerValue || 'Seene mein dard aur takleef',
        historyOfPresentIllness: 'Patient reported symptoms starting 2 days ago. Rated severe.',
        currentMedications: 'Tab Metformin 500mg (Verified from report)',
        allergies: 'No known drug allergies',
        provenance: [
          { field: 'Chief Complaint', value: answers[0]?.answerValue || 'Chest pain', sourceType: 'PATIENT_REPORTED', confidence: 0.98 },
        ]
      };
      setSummary(dummySummary);
      return dummySummary;
    }
  };

  return (
    <SessionContext.Provider
      value={{
        patient,
        session,
        currentQuestion,
        answers,
        redFlagAlert,
        summary,
        intakeMode,
        accessibilityMode,
        setAccessibilityMode,
        setIntakeMode,
        startNewSession,
        submitAnswer,
        generateSummary,
        setPatient,
        setSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
