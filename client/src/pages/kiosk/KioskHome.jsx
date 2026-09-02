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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      
      {/* Background Hospital Image & Light Accents */}
      <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80"
          alt="Hospital Lobby Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-200/50 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <div className="flex justify-between items-center z-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">MediKiosk</h1>
            <p className="text-xs text-slate-600 font-bold">Digital Hospital & AYUSH Intake Counter</p>
          </div>
        </div>

        {/* Language Selection Bar */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setLanguage('hi')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              language === 'hi'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            हिंदी (Hindi)
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto text-center space-y-8 my-auto z-10 py-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-900 text-sm font-extrabold border border-emerald-300 shadow-xs">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>AI Voice & Touch Clinical Assistant</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          {language === 'hi'
            ? 'अस्पताल परामर्श के लिए अपनी मेडिकल हिस्ट्री रिकॉर्ड करें'
            : 'Record Your Clinical Intake History for Doctor Consultation'}
        </h2>

        <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed">
          {language === 'hi'
            ? 'बोलकर या स्क्रीन पर टैप करके अपनी समस्याएं बताएं। डॉक्टर से मिलने से पहले आपका रिकॉर्ड तैयार हो जाएगा।'
            : 'Speak or tap to describe symptoms. Your history summary will be ready for physician review.'}
        </p>

        {/* Large Touch Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-6">
          
          {/* General OPD Intake Button */}
          <button
            onClick={() => handleStart('GENERAL')}
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-xl shadow-emerald-600/20 transition-all transform active:scale-98 flex flex-col items-center text-center gap-4 border border-emerald-400/40 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Stethoscope className="w-9 h-9" />
            </div>
            <div>
              <span className="text-2xl font-extrabold block">
                {language === 'hi' ? 'सामान्य ओपीडी परामर्श (General OPD)' : 'General OPD Intake'}
              </span>
              <span className="text-xs text-emerald-100 font-semibold">Allopathic / Multi-Specialty Consultation</span>
            </div>
          </button>

          {/* AYUSH Ayurveda Intake Button */}
          <button
            onClick={() => handleStart('AYUSH')}
            className="group relative p-8 rounded-3xl bg-gradient-to-br from-teal-700 to-cyan-800 hover:from-teal-600 hover:to-cyan-700 text-white shadow-xl shadow-teal-700/20 transition-all transform active:scale-98 flex flex-col items-center text-center gap-4 border border-teal-400/40 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <HeartPulse className="w-9 h-9" />
            </div>
            <div>
              <span className="text-2xl font-extrabold block">
                {language === 'hi' ? 'आयुष / आयुर्वेद परामर्श (AYUSH OPD)' : 'AYUSH / Ayurveda Intake'}
              </span>
              <span className="text-xs text-teal-100 font-semibold">Prakriti, Agni & Herbal Treatment History</span>
            </div>
          </button>

        </div>

      </div>

      {/* Footer Info & Accessibility Trigger */}
      <div className="flex justify-between items-center text-xs text-slate-600 z-10 pt-4 border-t border-slate-300 font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ABDM & Ayushman Bharat Compliant Kiosk System</span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold shadow-xs">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>❓ Help / सहायता</span>
        </button>
      </div>

    </div>
  );
}
