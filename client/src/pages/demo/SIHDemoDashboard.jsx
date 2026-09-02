import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Languages, Scan, AlertTriangle, ShieldCheck, Smartphone, Play,
  Stethoscope, HeartPulse, CheckCircle2, ArrowRight, FileText, QrCode, Mic,
  Clock, Users, Zap, ChevronRight, HelpCircle, Check, Volume2, Shield, Activity,
  ArrowDown, Lock, FileSpreadsheet, RefreshCw, User, ExternalLink, Building2, Phone
} from 'lucide-react';

export default function SIHDemoDashboard() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');

  // Patient Intake Steps with Contextual Images
  const patientSteps = [
    {
      step: 1,
      title: 'Choose Your Language & Login',
      badge: 'Voice & Touch Supported',
      icon: Languages,
      color: 'from-blue-600 to-indigo-700',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      description: 'Select your preferred language (Hindi, English, Hinglish, Marathi, Tamil, etc.). Login quickly with your Mobile Number, Aadhaar, or ABHA (Ayushman Bharat Health ID).',
      patientTip: 'Audio instructions guide you through every step in your chosen language!',
      details: ['Voice guidance enabled automatically', 'No password needed—instant OTP login', 'ABHA health ID pulls past records']
    },
    {
      step: 2,
      title: 'Voice or Touch Symptom Interview',
      badge: 'Multilingual Clinical AI',
      icon: Mic,
      color: 'from-emerald-600 to-teal-700',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
      description: 'Simply speak aloud how you feel! (e.g. "Mujhe 2 din se sar dard aur bukhar hai"). Our AI listens, understands local colloquial terms, and asks gentle follow-up questions.',
      patientTip: 'Speak naturally just like talking to a village health worker or doctor.',
      details: ['Understands 12+ Indian languages & dialects', 'Adapts questions based on your symptoms', 'Converts spoken words to clinical terms']
    },
    {
      step: 3,
      title: 'Red-Flag Safety Emergency Triage',
      badge: 'Instant Nurse Alert',
      icon: AlertTriangle,
      color: 'from-rose-600 to-red-700',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
      description: 'If you report severe symptoms (chest pain, breathing difficulty, high fever), the kiosk instantly flags an emergency warning and alerts the OPD nurse station.',
      patientTip: 'You do not have to wait in line if your condition is critical!',
      details: ['Automated Red-Flag algorithm check', 'Triggers immediate audio-visual nurse alert', 'Prioritizes urgent emergency cases']
    },
    {
      step: 4,
      title: 'Scan Paper Prescriptions & Lab Reports',
      badge: 'Optical OCR Scanner',
      icon: Scan,
      color: 'from-purple-600 to-violet-700',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      description: 'Place your paper prescription under the kiosk scanner or upload a PDF report. The system automatically reads medicine names, dosages, and lab test values.',
      patientTip: 'No need to type long medicine names manually! Just scan your paper documents.',
      details: ['Extracts current & past medications', 'Parses lab test reports (Blood Sugar, CBC)', 'High/low lab values highlighted']
    },
    {
      step: 5,
      title: 'Review Summary & Get OPD Token',
      badge: 'Instant Token Generated',
      icon: CheckCircle2,
      color: 'from-amber-600 to-orange-700',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
      description: 'Review your extracted symptoms and scanned medicines on the screen. Confirm your intake to receive your digital OPD token number and wait time estimate.',
      patientTip: 'If anything looks incorrect, you can edit or re-record with one tap before submitting.',
      details: ['Shows extracted summary on screen', 'Issues OPD Queue Token Number', 'Sends SMS notification to your mobile']
    },
    {
      step: 6,
      title: 'Doctor Consultation Visit',
      badge: 'Faster, Better Care',
      icon: Stethoscope,
      color: 'from-emerald-700 to-green-800',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      description: 'Step into the doctor room! Your doctor already has a structured AI clinical summary on their screen, so they spend consultation time listening to you instead of typing.',
      patientTip: 'You get a more attentive, thorough doctor visit with zero wasted history-taking time!',
      details: ['Doctor reviews summary before you enter', 'Red flag safety warnings highlighted', 'Final prescription saved to your timeline']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 selection:bg-emerald-600 selection:text-white">

      {/* ---------------------------------------------------- */}
      {/* 1. GOVERNMENT PORTAL HERO BANNER WITH REAL IMAGE (LIGHT THEME) */}
      {/* ---------------------------------------------------- */}
      <header className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-slate-50 text-slate-900 py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        
        {/* Background Subtle Medical Image Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80"
            alt="Hospital Kiosk Background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold tracking-wide shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>MINISTRY OF HEALTH & FAMILY WELFARE (MoHFW) | ABDM COMPLIANT KIOSK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            How MediKiosk Helps You <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-indigo-700 bg-clip-text text-transparent">Get Faster & Better Healthcare</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed">
            MediKiosk is your official digital hospital assistant. Speak your symptoms in your native language, scan your paper prescriptions, and let AI prepare your clinical record before you see the doctor.
          </p>

          {/* Call to Action Buttons */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => navigate('/patient/portal')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <User className="w-5 h-5 text-white" />
              <span>Access Patient Portal & Health Locker</span>
            </button>

            <button
              onClick={() => navigate('/kiosk')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current text-emerald-400" />
              <span>Start Kiosk Intake Demo</span>
            </button>

            <button
              onClick={() => navigate('/kiosk/scanner')}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold text-base flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Scan className="w-5 h-5 text-purple-600" />
              <span>Prescription Scanner</span>
            </button>
          </div>

          {/* Quick Key Badges */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                🎤
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Native Voice Support</div>
                <div className="text-[11px] text-slate-500">Hindi, English & Regional</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                ⏱
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">4-Minute Intake</div>
                <div className="text-[11px] text-slate-500">Save waiting & history time</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 font-bold">
                🚨
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Red-Flag Safety</div>
                <div className="text-[11px] text-slate-500">Instant nurse alerts</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 font-bold">
                🆔
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">ABHA Integrated</div>
                <div className="text-[11px] text-slate-500">National Health Records</div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. PATIENT VALUE PROPOSITION SECTION WITH PICTURE CARDS */}
      {/* ---------------------------------------------------- */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Patient Value Proposition
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">Why Patients & Doctors Love MediKiosk</h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto font-medium">
            Designed specifically for busy Indian OPD waiting halls to reduce doctor burden and give patients maximum care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow overflow-hidden group">
            <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 relative">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
                alt="Patient Intake Kiosk"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-800 text-white font-bold text-[10px] uppercase">
                Patient Kiosk
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Speak in Your Native Language</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                No need to struggle with complex medical forms. Just talk to the kiosk in Hindi, English, or your local dialect. Audio prompts assist you at every step.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow overflow-hidden group">
            <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 relative">
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
                alt="Prescription OCR Scanner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-700 text-white font-bold text-[10px] uppercase">
                OCR Prescription Scan
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Scan Old Paper Prescriptions</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Place your paper doctor slips or lab reports under the scanner. High-accuracy OCR extracts your ongoing medicines so your doctor knows your full history.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow overflow-hidden group">
            <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 relative">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
                alt="Doctor Consultation Workstation"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-700 text-white font-bold text-[10px] uppercase">
                Doctor Workstation
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">More Attentive Doctor Visit</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Your doctor receives a structured AI SOAP clinical summary before you enter. Consultation time is spent examining and talking to you instead of typing on a computer.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. VERTICAL ALTERNATING TIMELINE - LIGHT THEME WITH MEDICAL BACKGROUND */}
      {/* ---------------------------------------------------- */}
      <section className="py-14 bg-white border-y border-slate-200 relative overflow-hidden">
        
        {/* Background Subtle Medical Image Overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-multiply">
          <img
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1600&q=80"
            alt="Hospital Pathway Background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              6-Step Patient Intake Journey
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">How Your OPD Visit Works Step-by-Step</h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
              From entering the hospital waiting hall to receiving your final prescription.
            </p>
          </div>

          {/* Central Vertical Alternating Timeline Container */}
          <div className="relative">
            
            {/* Center Dashed Axis Line */}
            <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 border-r-2 border-dashed border-emerald-500 hidden md:block"></div>

            <div className="space-y-8 md:space-y-12">
              {patientSteps.map((s, idx) => {
                const Icon = s.icon;
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={s.step}
                    className={`flex flex-col md:flex-row items-center gap-6 md:gap-0 ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    
                    {/* Left/Right Card Content */}
                    <div className="w-full md:w-[45%]">
                      <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                            {s.badge}
                          </span>
                          <span className="text-xs font-bold text-slate-400">Step 0{s.step}</span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Icon className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>{s.title}</span>
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {s.description}
                        </p>

                        <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>Patient Tip:</strong> {s.patientTip}</span>
                        </div>
                      </div>
                    </div>

                    {/* Center Node Circle */}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-emerald-600 border-4 border-white text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                      0{s.step}
                    </div>

                    {/* Opposite Side: Contextual Content Image Card */}
                    <div className="w-full md:w-[45%]">
                      <div className="bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group h-full flex flex-col justify-between">
                        <div className="h-44 sm:h-48 overflow-hidden relative bg-slate-100">
                          <img
                            src={s.image}
                            alt={s.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                            <span>Step 0{s.step} Visual Guide</span>
                          </div>
                        </div>
                        <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            {s.badge}
                          </span>
                          <span className="text-[11px] text-emerald-800 font-extrabold">MoHFW Verified Flow</span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. GOVERNMENT FAQ SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Common Patient Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              What if I cannot read or write?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              MediKiosk features full audio guidance. You can listen to every question aloud in your language and reply by speaking directly into the microphone.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Is my health data kept private?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Yes! All information is encrypted using bank-grade AES-256 encryption. Only your treating doctor and authorized hospital staff can view your clinical file.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Does the AI replace the doctor?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              No, absolutely not. The AI only assists by organizing your intake symptoms into a draft summary. Your doctor always reviews, edits, and makes final medical decisions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              How do I scan paper prescriptions?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Simply place your paper prescription flat under the optical scanner window at the kiosk. The camera snaps a photo and extracts medicine names automatically.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
