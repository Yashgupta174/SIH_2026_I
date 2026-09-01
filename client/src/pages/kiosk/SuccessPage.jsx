import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Ticket, Printer, ArrowRight, Home, Stethoscope } from 'lucide-react';
import { useLanguage } from '../../store/languageContext';
import { useSession } from '../../store/sessionContext';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { patient, session } = useSession();

  const tokenNumber = session?.tokenNumber || 'TOKEN-001';

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 md:p-12 text-center relative overflow-hidden">
      
      <div className="max-w-2xl mx-auto my-auto space-y-8 z-10">
        
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-14 h-14" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            {language === 'hi' ? 'आपकी हिस्ट्री सफलतापूर्वक सबमिट हो गई है!' : 'Clinical Intake History Submitted Successfully!'}
          </h2>
          <p className="text-slate-300 text-lg">
            Your summary has been pushed to the doctor's queue. Please take your token slip.
          </p>
        </div>

        {/* Token Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl space-y-4 max-w-md mx-auto border-4 border-brand-500">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase text-slate-500">OPD Consultation Token</span>
            <Ticket className="w-5 h-5 text-brand-600" />
          </div>

          <div className="text-5xl font-black text-brand-700 tracking-tight py-2">
            {tokenNumber}
          </div>

          <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm space-y-1">
            <div><span className="font-bold">Patient:</span> {patient?.fullName || 'Ramesh Kumar'}</div>
            <div><span className="font-bold">Department:</span> {session?.department || 'Cardiology OPD'}</div>
            <div><span className="font-bold">Doctor Room:</span> Room 104 (1st Floor)</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 max-w-md mx-auto pt-4">
          <button
            onClick={() => window.print()}
            className="flex-1 h-14 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 flex items-center justify-center gap-2 border border-slate-700"
          >
            <Printer className="w-5 h-5" />
            <span>Print Token Slip</span>
          </button>

          <button
            onClick={() => navigate('/kiosk')}
            className="flex-1 h-14 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
          >
            <Home className="w-5 h-5" />
            <span>Finish & Kiosk Home</span>
          </button>
        </div>

      </div>

    </div>
  );
}
