import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Edit3, Mic, ShieldAlert, Sparkles, User, FileText, Pill } from 'lucide-react';
import { useLanguage } from '../../store/languageContext';
import { useSession } from '../../store/sessionContext';
import TTSPlayer from '../../components/TTSPlayer';

export default function PatientReviewPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { patient, session, summary, answers } = useSession();

  const [loading, setLoading] = useState(false);

  const chiefComplaint = summary?.chiefComplaint || answers[0]?.answerValue || 'Chest pain radiating to left shoulder';
  const hpi = summary?.historyOfPresentIllness || 'Pain rated 7/10 starting 2 days ago accompanied by mild breathlessness.';

  const handleConfirmAndSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/kiosk/complete');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col justify-between">
      
      {/* Header Bar */}
      <div className="max-w-4xl mx-auto w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase text-brand-600 tracking-wider">Step 5 of 5 — Final Confirmation</span>
          <h2 className="text-2xl font-black text-slate-900">
            {language === 'hi' ? 'जानकारी की पुष्टि करें (Confirm Your Recorded History)' : 'Confirm Your Recorded Information'}
          </h2>
        </div>
        <TTSPlayer textToSpeak="Kripya doctor se milne se pehle apni recorded jankari ki pushti karein." />
      </div>

      {/* Main Review Summary Card */}
      <div className="max-w-4xl mx-auto w-full my-auto py-6 space-y-6">
        
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
          
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
            <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div className="text-xs font-bold">
              <span>{summary?.disclaimer || "AI-generated draft — requires clinician verification."}</span>
              <p className="font-medium text-amber-800 mt-0.5">Below is a summary of what you reported. Please verify before token submission.</p>
            </div>
          </div>

          {/* Patient Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">{patient?.fullName || 'Ramesh Kumar'}</h4>
                <p className="text-xs text-slate-500 font-semibold">ABHA ID: {patient?.abhaId || '91-8762-4321-1001'} | Gender: {patient?.gender || 'MALE'}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 border border-brand-200 mt-2 sm:mt-0">
              Token: {session?.tokenNumber || 'TOKEN-001'}
            </span>
          </div>

          {/* Key Extracted Findings */}
          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl border border-slate-200 bg-white">
              <span className="text-xs font-extrabold text-slate-500 uppercase block mb-1">Chief Complaint (मुख्य समस्या)</span>
              <p className="text-lg font-black text-slate-900">{chiefComplaint}</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white">
              <span className="text-xs font-extrabold text-slate-500 uppercase block mb-1">Symptoms Overview (लक्षण विवरण)</span>
              <p className="text-sm font-semibold text-slate-800">{hpi}</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white">
              <span className="text-xs font-extrabold text-slate-500 uppercase block mb-1">Current Medications (दवाइयां)</span>
              <p className="text-sm font-semibold text-slate-800">{summary?.currentMedications || 'Tab Metformin 500mg, Tab Amlodipine 5mg'}</p>
            </div>

          </div>

          {/* Confirmation Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            
            <button
              onClick={() => navigate('/kiosk/interview')}
              className="h-16 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-lg hover:bg-slate-200 flex items-center justify-center gap-2"
            >
              <Edit3 className="w-5 h-5 text-slate-600" />
              <span>✏️ Correct Answer (उत्तर सुधारें)</span>
            </button>

            <button
              onClick={handleConfirmAndSubmit}
              disabled={loading}
              className="h-16 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Check className="w-6 h-6 text-white" />
              <span>{loading ? 'Submitting to Queue...' : '✓ Confirm & Get Doctor OPD Token'}</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
