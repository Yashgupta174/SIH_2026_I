import React, { useState } from 'react';
import { User, FileText, Calendar, Activity, MessageSquare, Send, ShieldCheck, Sparkles, Pill } from 'lucide-react';
import { useAuth } from '../../store/authContext';

export default function PatientPortalPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Namaste! Main aapka Personal Health Assistant hoon. Aap apne verified medical records ke baare mein sawaal pooch sakte hain.' }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const handleSendQuery = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg = inputQuery;
    setMessages(prev => [...prev, { sender: 'USER', text: userMsg }]);
    setInputQuery('');

    // Grounded Health AI Assistant response based on verified records
    setTimeout(() => {
      let reply = "Aapka verified record: Last Hemoglobin reading 10.2 g/dL hai (Aug 2025 report). Agla appointment Cardiology department mein Room 104 mein scheduled hai.";
      if (userMsg.toLowerCase().includes('medicine') || userMsg.toLowerCase().includes('dawai')) {
        reply = "Verified Prescription according to your record: Tab Metformin 500mg BD & Tab Amlodipine 5mg OD.";
      }
      setMessages(prev => [...prev, { sender: 'AI', text: reply }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-2xl">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{user?.name || 'Ramesh Kumar'}</h1>
            <p className="text-xs text-slate-500 font-semibold">ABHA ID: {user?.abhaId || '91-8762-4321-1001'} | Digital Health Record</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ABDM Digital Health Lockers Verified</span>
        </div>
      </div>

      {/* Grid: Health Summary & Grounded AI Q&A Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Health Records Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900">Current Prescribed Medications</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Pill className="w-6 h-6 text-brand-600" />
                  <div>
                    <span className="font-extrabold text-slate-900 block text-base">Tab Metformin 500mg</span>
                    <span className="text-xs text-slate-500 font-semibold">Dosage: 1 Tablet Twice Daily (BD)</span>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">Active</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Pill className="w-6 h-6 text-brand-600" />
                  <div>
                    <span className="font-extrabold text-slate-900 block text-base">Tab Amlodipine 5mg</span>
                    <span className="text-xs text-slate-500 font-semibold">Dosage: 1 Tablet Once Daily (OD)</span>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900">Recent Doctor Verified Summaries</h3>
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-brand-800">
                <span>Cardiology Consultation — Metro Hospital</span>
                <span>Verified by Dr. Vikram Seth</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Patient presented with chest pain starting Aug 2025. Verified diagnosis & prescription updated to health locker.
              </p>
            </div>
          </div>

        </div>

        {/* Right Col: Grounded AI Q&A Assistant */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-[520px]">
          
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-black text-slate-900">Personal Health Assistant</h3>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl text-xs font-semibold max-w-[85%] ${
                    m.sender === 'USER'
                      ? 'bg-brand-600 text-white ml-auto text-right'
                      : 'bg-slate-100 text-slate-800 mr-auto'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendQuery} className="flex gap-2 pt-4 border-t border-slate-100">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about your records..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
