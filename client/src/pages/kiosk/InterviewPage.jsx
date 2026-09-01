import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Touchpad, Activity, AlertTriangle, ArrowRight, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../store/languageContext';
import { useSession } from '../../store/sessionContext';
import TTSPlayer from '../../components/TTSPlayer';
import VoiceRecorderModal from '../../components/VoiceRecorderModal';

export default function InterviewPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { currentQuestion, answers, submitAnswer, redFlagAlert, intakeMode, generateSummary } = useSession();

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOptionSelect = async (optValue, source = 'TOUCH') => {
    setLoading(true);
    try {
      await submitAnswer(optValue, source);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishInterview = async () => {
    setLoading(true);
    try {
      await generateSummary();
      navigate('/kiosk/scanner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col justify-between">
      
      {/* Top Header with Progress */}
      <div className="max-w-4xl mx-auto w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase text-brand-600 tracking-wider">
              {intakeMode === 'AYUSH' ? 'AYUSH Prakriti & Clinical Intake' : 'AI Clinical Intake Session'}
            </span>
            <h2 className="text-xl font-black text-slate-900">Step 3 of 5 — History Interview</h2>
          </div>
        </div>

        {/* Progress percent */}
        <div className="flex items-center gap-3">
          <div className="w-32 bg-slate-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full transition-all duration-300"
              style={{ width: `${currentQuestion?.progressPercent || 30}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-slate-700">{currentQuestion?.progressPercent || 30}%</span>
        </div>
      </div>

      {/* Red Flag Alert Banner */}
      {redFlagAlert && (
        <div className="max-w-4xl mx-auto w-full mt-4 bg-rose-50 border-2 border-rose-500 text-rose-900 p-4 rounded-2xl flex items-center gap-3 animate-bounce">
          <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0" />
          <div className="text-sm font-bold">
            <span>🚨 {redFlagAlert.title}: </span>
            <span className="font-medium">{redFlagAlert.patientMessage}</span>
          </div>
        </div>
      )}

      {/* Main Conversational Interface */}
      <div className="max-w-4xl mx-auto w-full my-auto py-6 space-y-6">
        
        {/* Assistant Avatar Header */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-brand-600 to-brand-700 p-6 rounded-3xl text-white shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold border border-white/30">
            🤖
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-brand-100 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Clinical Assistant</span>
            </div>
            <p className="text-lg md:text-xl font-bold">
              "Namaste, main aapki medical history record karne mein madad karunga."
            </p>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-8 animate-fadeIn">
            
            {/* Question Text & TTS */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                  Category: {currentQuestion.category || 'General'}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug">
                  {currentQuestion.questionText}
                </h3>
              </div>
              <TTSPlayer textToSpeak={currentQuestion.questionText} />
            </div>

            {/* Dual Input Section (Voice OR Touch) */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              
              {/* Option A: Voice Speak Button */}
              <div className="text-center bg-brand-50/50 p-6 rounded-3xl border border-brand-100">
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="w-full max-w-md mx-auto h-16 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-lg shadow-lg shadow-brand-500/25 flex items-center justify-center gap-3 active:scale-98 transition-all cursor-pointer"
                >
                  <Mic className="w-6 h-6 animate-pulse" />
                  <span>🎤 Bolkar Uttar Dijiye (Speak Answer)</span>
                </button>
                <span className="text-xs text-slate-500 font-medium block mt-2">Speak naturally in Hindi, English or Hinglish</span>
              </div>

              {/* Option B: Touch Tap Option Chips */}
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block text-center mb-3">
                  Ya Neeche Diye Gaye Option Par Tap Karein (Tap An Option)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(opt, 'TOUCH')}
                      disabled={loading}
                      className="kiosk-btn bg-slate-50 border-2 border-slate-200 text-slate-900 hover:border-brand-500 hover:bg-brand-50 font-extrabold text-lg text-left justify-start px-6 py-4 rounded-2xl transition-all"
                    >
                      <Touchpad className="w-5 h-5 text-brand-600 flex-shrink-0" />
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Skip / Finish shortcut */}
            {currentQuestion.isFinal && (
              <button
                onClick={handleFinishInterview}
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                <span>Full History Complete — Proceed to Documents</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            )}

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center space-y-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-2xl font-black text-slate-900">Clinical History Questions Complete!</h3>
            <p className="text-slate-600">Now you can upload or scan any old prescriptions, lab reports, or discharge summaries.</p>
            <button
              onClick={handleFinishInterview}
              className="w-full max-w-md mx-auto h-16 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xl shadow-lg shadow-brand-500/25"
            >
              Scan / Upload Medical Documents →
            </button>
          </div>
        )}

      </div>

      {/* Voice Recorder Modal Popup */}
      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onConfirmAnswer={(spokenText) => handleOptionSelect(spokenText, 'VOICE')}
      />

    </div>
  );
}
