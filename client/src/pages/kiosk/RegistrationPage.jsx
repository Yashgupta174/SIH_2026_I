import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Smartphone, User, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../store/languageContext';
import { useSession } from '../../store/sessionContext';
import axios from 'axios';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { startNewSession, intakeMode } = useSession();

  const [regMode, setRegMode] = useState('ABHA'); // 'ABHA' | 'DEMO' | 'MANUAL'
  const [abhaId, setAbhaId] = useState('91-8762-4321-1001');
  const [fullName, setFullName] = useState('Ramesh Kumar');
  const [dob, setDob] = useState('1976-04-12');
  const [gender, setGender] = useState('MALE');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/patients', {
        fullName,
        dob,
        gender,
        mobileNumber,
        abhaId,
        preferredLanguage: language,
      });

      const patient = res.data.patient;
      await startNewSession(patient, intakeMode, language);
      navigate('/kiosk/consent');
    } catch (err) {
      console.error('Registration fallback:', err);
      // Demo Patient Fallback
      const dummyPatient = {
        _id: 'pat_demo_' + Date.now(),
        fullName,
        dob,
        gender,
        mobileNumber,
        abhaId,
        hospitalId: 'HOSP-98214',
      };
      await startNewSession(dummyPatient, intakeMode, language);
      navigate('/kiosk/consent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-12 flex flex-col justify-between">
      
      {/* Top Header Bar */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase text-brand-600 tracking-wider">Step 1 of 5</span>
          <h2 className="text-2xl font-black text-slate-900">
            {language === 'hi' ? 'मरीज़ पहचान एवं पंजीकरण (Patient Identity)' : 'Patient Registration & Identity'}
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>ABHA Digital Gateway</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8">
        
        {/* Toggle Mode */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setRegMode('ABHA')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              regMode === 'ABHA' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span>ABHA / Aadhaar Scanner</span>
          </button>

          <button
            onClick={() => setRegMode('DEMO')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              regMode === 'DEMO' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Quick Demo Patient (SIH)</span>
          </button>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
          
          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* ABHA Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                14-Digit ABHA Health ID / QR Reference
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  placeholder="e.g. 91-8762-4321-1001"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-slate-200 focus:border-brand-500 text-lg font-bold text-slate-900 focus:outline-none"
                  required
                />
                <QrCode className="w-6 h-6 text-brand-600 absolute left-4 top-4" />
              </div>
            </div>

            {/* Patient Name & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name / पूरा नाम</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-14 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-500 text-lg font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth / जन्म तिथि</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-14 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-500 text-lg font-semibold"
                  required
                />
              </div>
            </div>

            {/* Gender & Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Gender / लिंग</label>
                <div className="grid grid-cols-3 gap-3">
                  {['MALE', 'FEMALE', 'OTHER'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`h-14 rounded-2xl font-bold text-sm transition-all border-2 ${
                        gender === g
                          ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {g === 'MALE' ? 'Male (पुरुष)' : g === 'FEMALE' ? 'Female (महिला)' : 'Other'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number (OTP Verification)</label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full h-14 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-500 text-lg font-semibold"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <span>{loading ? 'Verifying ABHA ID...' : 'Aage Badhein (Continue to Consent)'}</span>
              <ArrowRight className="w-6 h-6" />
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
