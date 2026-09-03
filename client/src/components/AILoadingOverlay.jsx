import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Database, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

const DEFAULT_STEPS = [
  '🤖 AI Assistant is processing your response...',
  '⚡ Evaluating clinical rules & emergency triage flags...',
  '💾 Syncing record with hospital EMR database...',
  '✨ Synthesizing physician-ready clinical history...',
];

export default function AILoadingOverlay({
  isLoading,
  title = 'AI Clinical Assistant Active',
  customSteps,
}) {
  const steps = customSteps && customSteps.length > 0 ? customSteps : DEFAULT_STEPS;
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStepIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % steps.length);
    }, 1400);

    return () => clearInterval(interval);
  }, [isLoading, steps.length]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center space-y-6 relative overflow-hidden">
        
        {/* Top Decorative Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-500 via-emerald-400 to-indigo-600 animate-pulse" />

        {/* Central Animated Pulse Aura */}
        <div className="relative inline-flex items-center justify-center pt-2">
          {/* Outer Pulsing Aura */}
          <div className="absolute w-28 h-28 rounded-full bg-brand-500/20 animate-ping" />
          <div className="absolute w-24 h-24 rounded-full bg-indigo-500/20 animate-pulse" />

          {/* Core Icon Container */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-brand-500/30 relative z-10">
            <Sparkles className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        {/* Title & Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-black uppercase text-brand-700">
            <Cpu className="w-3.5 h-3.5" />
            <span>{title}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">MediKiosk AI Engine</h3>
        </div>

        {/* Dynamic Stepped Message Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[64px] flex items-center justify-center text-center transition-all duration-300">
          <p className="text-sm font-bold text-slate-800 animate-fadeIn key={currentStepIdx}">
            {steps[currentStepIdx]}
          </p>
        </div>

        {/* Animated Progress Line */}
        <div className="space-y-1">
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-brand-600 to-emerald-500 h-full rounded-full animate-progress" />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase px-1">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-brand-600" /> Database Sync
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Clinical Safety Guard
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
