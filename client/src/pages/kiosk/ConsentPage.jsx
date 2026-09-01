import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Check, X, FileText, Volume2, HelpCircle, Lock } from 'lucide-react';
import { useLanguage } from '../../store/languageContext';
import { useSession } from '../../store/sessionContext';
import TTSPlayer from '../../components/TTSPlayer';
import axios from 'axios';

export default function ConsentPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { patient, session } = useSession();
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const consentText = language === 'hi'
    ? "हम आपकी मेडिकल हिस्ट्री, लक्षण एवं स्कैन किए गए पर्चे रिकॉर्ड कर रहे हैं ताकि अस्पताल के डॉक्टर आपकी परामर्श में सहायता कर सकें। आपका डेटा सुरक्षित और गोपनीय रखा जाएगा।"
    : "We are recording your clinical symptoms, past medical history, and scanned prescriptions to assist hospital physicians during consultation. Your information remains strictly confidential and secure under ABDM data privacy guidelines.";

  const handleGrantConsent = async () => {
    setLoading(true);
    try {
      if (patient) {
        await axios.post('/api/consents', {
          patientId: patient._id,
          sessionId: session?._id,
          language,
          method: 'TOUCH',
        });
      }
    } catch (e) {
      console.log('Consent API handled');
    } finally {
      setLoading(false);
      navigate('/kiosk/interview');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-12 flex flex-col justify-between">
      
      {/* Header Bar */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase text-brand-600 tracking-wider">Step 2 of 5</span>
          <h2 className="text-2xl font-black text-slate-900">
            {language === 'hi' ? 'स्वास्थ्य डेटा सहमति (Patient Consent)' : 'Patient Data Consent'}
          </h2>
        </div>
        <TTSPlayer textToSpeak={consentText} />
      </div>

      {/* Main Consent Card */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
          
          <div className="flex items-center gap-4 bg-brand-50 border border-brand-200 p-4 rounded-2xl text-brand-900">
            <ShieldCheck className="w-8 h-8 text-brand-600 flex-shrink-0" />
            <p className="text-sm font-semibold leading-relaxed">
              {consentText}
            </p>
          </div>

          {/* 4 Consent Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>1. क्या जानकारी ली जाएगी? (What Info?)</span>
              </h4>
              <p className="text-xs text-slate-600">आपके लक्षण, पुरानी बीमारियां, ली जा रही दवाइयां एवं स्कैन किए गए पर्चे।</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1">
                <HelpCircle className="w-4 h-4 text-brand-600" />
                <span>2. यह क्यों ली जा रही है? (Why Collected?)</span>
              </h4>
              <p className="text-xs text-slate-600">डॉक्टर परामर्श का समय घटाने एवं सटीक पूर्व-समरी तैयार करने के लिए।</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-brand-600" />
                <span>3. इसे कौन देख सकता है? (Who Accesses?)</span>
              </h4>
              <p className="text-xs text-slate-600">केवल अस्पताल के अधिकृत डॉक्टर एवं नर्स स्टाफ।</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>4. सुरक्षा (Safety Rule)</span>
              </h4>
              <p className="text-xs text-slate-600 font-bold text-amber-700">एआई-ड्राफ्ट समरी केवल डॉक्टर द्वारा जांचे जाने के बाद ही मान्य होगी।</p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => navigate('/')}
              className="h-16 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-lg hover:bg-slate-200 flex items-center justify-center gap-2"
            >
              <X className="w-6 h-6 text-slate-500" />
              <span>अस्वीकार करें (Decline)</span>
            </button>

            <button
              onClick={handleGrantConsent}
              disabled={loading}
              className="h-16 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-lg shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-6 h-6 text-white" />
              <span>{loading ? 'Processing...' : 'स्वीकार करें (I Give Consent)'}</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
