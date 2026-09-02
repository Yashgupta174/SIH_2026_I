import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, PhoneCall, AlertTriangle, HeartPulse, Brain, QrCode,
  ShieldCheck, User, ExternalLink, Building2, CheckCircle2, Shield,
  Info, X, ChevronRight, FileText
} from 'lucide-react';

export default function Footer() {
  const [showAllHelplinesModal, setShowAllHelplinesModal] = useState(false);
  const [showAllSchemesModal, setShowAllSchemesModal] = useState(false);

  // Government Helplines Data
  const govtHelplines = [
    { number: '104', name: 'National Health Helpline', desc: 'Free 24x7 medical advice, blood availability & health guidance', icon: PhoneCall, color: 'text-emerald-800 bg-emerald-100 border-emerald-300' },
    { number: '112', name: 'National Emergency Number', desc: 'Single emergency helpline for Police, Fire & Medical Response', icon: AlertTriangle, color: 'text-rose-800 bg-rose-100 border-rose-300' },
    { number: '108', name: 'Emergency Ambulance Service', desc: 'Free emergency ambulance dispatch & disaster relief', icon: HeartPulse, color: 'text-rose-800 bg-rose-100 border-rose-300' },
    { number: '14416', name: 'Tele-MANAS Mental Health', desc: '24x7 free tele-mental health counseling across India', icon: Brain, color: 'text-purple-800 bg-purple-100 border-purple-300' },
    { number: '1800-11-4477', name: 'ABHA / ABDM Toll-Free', desc: 'Ayushman Bharat Digital Mission support & Health ID help', icon: QrCode, color: 'text-blue-800 bg-blue-100 border-blue-300' },
    { number: '181', name: 'Women Helpline', desc: '24x7 emergency response for women in distress', icon: ShieldCheck, color: 'text-pink-800 bg-pink-100 border-pink-300' },
    { number: '14567', name: 'Elder Line (Senior Citizens)', desc: 'National helpline for senior citizen care & support', icon: User, color: 'text-amber-800 bg-amber-100 border-amber-300' }
  ];

  // Government Health Schemes Data
  const govtSchemes = [
    {
      title: 'Ayushman Bharat PM-JAY',
      fullName: 'Pradhan Mantri Jan Arogya Yojana',
      benefit: '₹5 Lakh free health coverage per family/year',
      desc: 'World’s largest government-funded health assurance scheme covering secondary & tertiary hospitalization.',
      link: 'https://pmjay.gov.in',
      badge: '29,000+ Impaneled Hospitals'
    },
    {
      title: 'ABHA (Digital Health Account)',
      fullName: 'Ayushman Bharat Digital Mission (ABDM)',
      benefit: 'Unique 14-digit Digital Health ID for every Indian',
      desc: 'Link all your medical prescriptions, lab reports, and EMR records seamlessly across hospitals nationwide.',
      link: 'https://abha.abdm.gov.in',
      badge: 'ABDM FHIR Integrated'
    },
    {
      title: 'PM Bharatiya Janaushadhi Pariyojana',
      fullName: 'PMBJP Affordable Generic Medicines',
      benefit: '50% to 90% discount on quality generic drugs',
      desc: 'Access high-quality generic medicines and surgical products at affordable prices via Jan Aushadhi Kendras.',
      link: 'https://janaushadhi.gov.in',
      badge: '10,000+ Jan Aushadhi Stores'
    },
    {
      title: 'National AYUSH Mission (NAM)',
      fullName: 'Ministry of AYUSH Integration',
      benefit: 'Ayurveda, Yoga, Unani, Siddha & Homeopathy',
      desc: 'Promoting traditional Indian healthcare systems and holistic pre-consultation wellness integrated into EMR.',
      link: 'https://ayush.gov.in',
      badge: 'AYUSH EMR Ready'
    },
    {
      title: 'eSanjeevani & Tele-MANAS',
      fullName: 'National Tele-Consultation Service',
      benefit: 'Free Doctor Tele-consultation from home',
      desc: 'eSanjeevani OPD connects patients directly to government hospital doctors via video consultation.',
      link: 'https://esanjeevani.mohfw.gov.in',
      badge: '150 Million+ Consultations'
    }
  ];

  return (
    <footer className="bg-slate-100 text-slate-800 border-t border-slate-300 pt-12 pb-8 font-sans relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* SECTION A: FOOTER HEADER & BRAND INFO */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-300 pb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  MediKiosk
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-300">
                    MoHFW / ABDM Compliant
                  </span>
                </span>
                <span className="text-xs text-slate-600 block font-semibold">National Health Portal • Multilingual Pre-Consultation Engine</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Developed for Indian Government Hospitals & AYUSH Institutions under SIH 2026. Empowering patients with voice-based intake, optical prescription OCR, and real-time triage emergency detection.
            </p>
          </div>

          {/* Action Modals Launch Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAllHelplinesModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Govt Helplines Directory</span>
            </button>

            <button
              onClick={() => setShowAllSchemesModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>National Health Schemes</span>
            </button>
          </div>
        </div>

        {/* SECTION B: GOVERNMENT EMERGENCY HELPLINES GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-700" /> Official Government Emergency & Healthcare Helpline Directory
            </span>
            <button
              onClick={() => setShowAllHelplinesModal(true)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              View All Numbers <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {govtHelplines.slice(0, 4).map((h, idx) => {
              const Icon = h.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-300 hover:border-emerald-500 transition-all space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${h.color} flex items-center gap-1`}>
                      <Icon className="w-3 h-3" /> {h.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={`tel:${h.number.replace(/\s+/g, '')}`}
                      className="text-lg font-black text-emerald-700 hover:text-emerald-800 font-mono tracking-wider"
                    >
                      📞 {h.number}
                    </a>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">24x7 Toll Free</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION C: GOVERNMENT HEALTH SCHEMES GRID */}
        <div className="space-y-4 pt-4 border-t border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" /> National Health Schemes & PM-JAY Initiatives
            </span>
            <button
              onClick={() => setShowAllSchemesModal(true)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              View All Schemes <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {govtSchemes.slice(0, 3).map((scheme, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-300 hover:border-emerald-500 transition-all space-y-3 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300">
                      {scheme.badge}
                    </span>
                    <a
                      href={scheme.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-slate-800"
                      title="Visit Official Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{scheme.title}</h4>
                  <p className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>{scheme.benefit}</span>
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{scheme.desc}</p>
                </div>

                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noreferrer"
                  className="pt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Official Govt Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION D: QUICK LINKS & FOOTER BOTTOM */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-300 text-xs">
          
          <div className="space-y-2">
            <h5 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Platform Portals</h5>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li><Link to="/patient/portal" className="text-emerald-800 font-bold hover:text-emerald-900">Patient Portal & Health Locker</Link></li>
              <li><Link to="/kiosk" className="hover:text-slate-900">Patient Kiosk Mode</Link></li>
              <li><Link to="/kiosk/scanner" className="hover:text-slate-900">OCR Document Scanner</Link></li>
              <li><Link to="/nurse" className="hover:text-slate-900">Nurse Triage Workstation</Link></li>
              <li><Link to="/doctor" className="hover:text-slate-900">Doctor EMR Workstation</Link></li>
              <li><Link to="/admin" className="hover:text-slate-900">Admin Management</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Govt Emergency Nos.</h5>
            <ul className="space-y-1.5 text-slate-600 font-mono">
              <li><a href="tel:104" className="hover:text-emerald-700 font-bold">104 — Health Advice</a></li>
              <li><a href="tel:112" className="hover:text-rose-700 font-bold">112 — National Emergency</a></li>
              <li><a href="tel:108" className="hover:text-rose-700 font-bold">108 — Ambulance Dispatch</a></li>
              <li><a href="tel:14416" className="hover:text-purple-700 font-bold">14416 — Tele-MANAS</a></li>
              <li><a href="tel:1800114477" className="hover:text-blue-700 font-bold">1800-11-4477 — ABHA ID</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Govt Health Missions</h5>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li><a href="https://pmjay.gov.in" target="_blank" rel="noreferrer" className="hover:text-slate-900">Ayushman Bharat PM-JAY</a></li>
              <li><a href="https://abha.abdm.gov.in" target="_blank" rel="noreferrer" className="hover:text-slate-900">ABDM Health ID (ABHA)</a></li>
              <li><a href="https://janaushadhi.gov.in" target="_blank" rel="noreferrer" className="hover:text-slate-900">Jan Aushadhi Kendras</a></li>
              <li><a href="https://ayush.gov.in" target="_blank" rel="noreferrer" className="hover:text-slate-900">Ministry of AYUSH</a></li>
              <li><a href="https://esanjeevani.mohfw.gov.in" target="_blank" rel="noreferrer" className="hover:text-slate-900">eSanjeevani OPD</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Security & Standards</h5>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li>ABDM FHIR Compliant</li>
              <li>AES-256 Data Encryption</li>
              <li>DPDP Privacy Architecture</li>
              <li>Socket.IO Triage Alerts</li>
              <li>SIH 2026 Presentation</li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-6 border-t border-slate-300 text-center text-xs text-slate-600 space-y-1 font-medium">
          <p>© 2026 MediKiosk — Smart Multilingual Pre-Consultation & Clinical Intake Platform. Built for Indian Healthcare Systems.</p>
          <p className="text-[11px] text-slate-500">Integrated with Ministry of Health & Family Welfare (MoHFW) guidelines and National Health Authority (NHA) ABDM standards.</p>
        </div>

      </div>

      {/* MODAL 1: FULL HELPLINES MODAL */}
      {showAllHelplinesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center font-bold">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">National Emergency & Health Helplines</h3>
                  <p className="text-xs text-slate-500">Official 24x7 Government of India helpline directory</p>
                </div>
              </div>

              <button
                onClick={() => setShowAllHelplinesModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {govtHelplines.map((h, idx) => {
                const Icon = h.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${h.color} flex items-center gap-1`}>
                        <Icon className="w-3.5 h-3.5" /> {h.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={`tel:${h.number.replace(/\s+/g, '')}`}
                        className="text-base font-black text-emerald-700 hover:text-emerald-800 font-mono"
                      >
                        📞 {h.number}
                      </a>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{h.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900">
                <strong>Emergency Warning:</strong> If you or someone near you is experiencing critical chest pain, stroke, or sudden breathing distress, call <strong>112</strong> or <strong>108</strong> immediately.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAllHelplinesModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Directory
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: FULL SCHEMES MODAL */}
      {showAllSchemesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Government Healthcare Schemes Directory</h3>
                  <p className="text-xs text-slate-500">National Health Authority & Ministry of Health & Family Welfare</p>
                </div>
              </div>

              <button
                onClick={() => setShowAllSchemesModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {govtSchemes.map((scheme, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                        {scheme.badge}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{scheme.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{scheme.fullName}</p>
                    </div>

                    <a
                      href={scheme.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Primary Benefit: {scheme.benefit}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{scheme.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAllSchemesModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Directory
              </button>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
}
