import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Activity, Clock, ShieldCheck, Stethoscope, HeartPulse, CheckCircle2, ArrowRight, Play } from 'lucide-react';

export default function SIHDemoDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12 space-y-10">
      
      {/* SIH Header */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>SIH 2026 Presentation & Evaluation Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">MediKiosk Demonstration Portal</h1>
          <p className="text-slate-300 text-lg font-medium mt-1">AI-Powered Clinical Intake & Pre-Consultation Platform for Indian Hospitals & AYUSH Institutions</p>
        </div>

        <button
          onClick={() => navigate('/kiosk')}
          className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-base shadow-xl shadow-brand-500/30 flex items-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Launch Patient Kiosk Demo →</span>
        </button>
      </div>

      {/* Before vs After Impact Comparison Grid */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Measured Impact Comparison</h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
            Demo / Simulated Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Before Card */}
          <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 space-y-4">
            <span className="text-xs font-black uppercase text-rose-400 bg-rose-950/50 px-3 py-1 rounded-full border border-rose-800/50">
              ❌ Before MediKiosk (Traditional Paper Intake)
            </span>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">⏱ Average doctor history taking time: 12-15 minutes</li>
              <li className="flex items-center gap-2">📄 Fragmented paper prescriptions & lost lab reports</li>
              <li className="flex items-center gap-2">🗣 Language barriers for low-literacy rural patients</li>
              <li className="flex items-center gap-2">🚨 No real-time emergency red flag detection before doctor visit</li>
            </ul>
          </div>

          {/* After Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-900/60 to-brand-800/40 border border-brand-500/40 space-y-4">
            <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800/50">
              ✓ After MediKiosk (AI Clinical Pre-Consultation)
            </span>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-center gap-2 font-semibold">⚡ Pre-consultation summary ready in 4.2 minutes</li>
              <li className="flex items-center gap-2 font-semibold">🔍 Digitized document OCR with side-by-side verification</li>
              <li className="flex items-center gap-2 font-semibold">🎤 Multi-lingual voice & touch input (Hindi, English, Hinglish)</li>
              <li className="flex items-center gap-2 font-semibold">🚨 Instant Socket.IO triage alerts for critical cardiac/stroke signs</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Demo Workflow Shortcuts */}
      <div className="max-w-6xl mx-auto space-y-4 pt-4">
        <h2 className="text-2xl font-black">Explore Key Product Workflows</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => navigate('/kiosk')}
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-2 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
              🎤
            </div>
            <h4 className="text-base font-extrabold text-white">1. Patient Voice Intake</h4>
            <p className="text-xs text-slate-400">ATM Kiosk with dynamic audio guidance and dual voice/touch controls.</p>
          </button>

          <button
            onClick={() => navigate('/kiosk/scanner')}
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-2 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              📄
            </div>
            <h4 className="text-base font-extrabold text-white">2. OCR Document Scanner</h4>
            <p className="text-xs text-slate-400">Prescription OCR extraction with quality scoring and review.</p>
          </button>

          <button
            onClick={() => navigate('/nurse')}
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-2 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
              🚨
            </div>
            <h4 className="text-base font-extrabold text-white">3. Triage Red Flags</h4>
            <p className="text-xs text-slate-400">Real-time Socket.IO emergency alert dashboard for triage nurses.</p>
          </button>

          <button
            onClick={() => navigate('/doctor')}
            className="p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left space-y-2 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold">
              🩺
            </div>
            <h4 className="text-base font-extrabold text-white">4. Doctor Workstation</h4>
            <p className="text-xs text-slate-400">Editable AI summary, version control, and one-click clinical approval.</p>
          </button>

        </div>
      </div>

    </div>
  );
}
