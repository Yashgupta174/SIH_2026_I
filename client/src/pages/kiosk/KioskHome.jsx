import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Languages, Mic, Sparkles, Stethoscope, HeartPulse, HelpCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../store/languageContext';
import { useSession } from '../../store/sessionContext';

export default function KioskHome() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { setIntakeMode } = useSession();

  const handleStart = (mode) => {
    setIntakeMode(mode);
    navigate('/kiosk/registration');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      
      {/* Background Graphic Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>

      {/* Header Bar */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">MediKiosk</h1>
            <p className="text-xs text-slate-400 font-medium">Digital Hospital & AYUSH Intake Counter</p>
          </div>
        </div>

        {/* Language Selection Bar */}
        <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setLanguage('hi')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              language === 'hi' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              language === 'en' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto text-center space-y-8 my-auto z-10 py-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-brand-400 text-sm font-semibold border border-slate-700">
          <Sparkles className="w-4 h-4" />
          <span>AI Voice & Touch Clinical Assistant</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          {language === 'hi'
            ? 'अस्पताल परामर्श के लिए अपनी मेडिकल हिस्ट्री रिकॉर्ड करें'
            : 'Record Your Clinical Intake History for Doctor Consultation'}
        </h2>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'hi'
            ? 'बोलकर या स्क्रीन पर टैप करके अपनी समस्याएं बताएं। डॉक्टर से मिलने से पहले आपका रिकॉर्ड तैयार हो जाएगा।'
            : 'Speak or tap to describe symptoms. Your history summary will be ready for physician review.'}
        </p>

        {/* Large Touch Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-6">
          
          {/* General OPD Intake Button */}
          <button
            onClick={() => handleStart('GENERAL')}
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white shadow-2xl shadow-brand-500/25 transition-all transform active:scale-98 flex flex-col items-center text-center gap-4 border border-brand-400/30 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Stethoscope className="w-9 h-9" />
            </div>
            <div>
              <span className="text-2xl font-extrabold block">
                {language === 'hi' ? 'सामान्य ओपीडी परामर्श (General OPD)' : 'General OPD Intake'}
              </span>
              <span className="text-xs text-brand-100 font-medium">Allopathic / Multi-Specialty Consultation</span>
            </div>
          </button>

          {/* AYUSH Ayurveda Intake Button */}
          <button
            onClick={() => handleStart('AYUSH')}
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white shadow-2xl shadow-emerald-500/25 transition-all transform active:scale-98 flex flex-col items-center text-center gap-4 border border-emerald-400/30 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <HeartPulse className="w-9 h-9" />
            </div>
            <div>
              <span className="text-2xl font-extrabold block">
                {language === 'hi' ? 'आयुष / आयुर्वेद परामर्श (AYUSH OPD)' : 'AYUSH / Ayurveda Intake'}
              </span>
              <span className="text-xs text-emerald-100 font-medium">Prakriti, Agni & Herbal Treatment History</span>
            </div>
          </button>

        </div>

      </div>

      {/* Footer Info & Accessibility Trigger */}
      <div className="flex justify-between items-center text-xs text-slate-400 z-10 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ABDM & Ayushman Bharat Compliant Kiosk System</span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">
          <HelpCircle className="w-4 h-4 text-brand-400" />
          <span>❓ Help / सहायता</span>
        </button>
      </div>

    </div>
  );
}
