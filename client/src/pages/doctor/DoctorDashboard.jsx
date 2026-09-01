import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, AlertTriangle, CheckCircle2, Search, Filter, ChevronRight, Activity, Stethoscope, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'RED_FLAGS' | 'AYUSH' | 'GENERAL'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/doctor/queue');
      setQueue(res.data.queue || []);
    } catch (e) {
      console.log('Using seeded fallback queue:', e);
      // Demo Fallback Doctor Queue Data
      setQueue([
        {
          _id: 'sess_1',
          sessionId: 'SESS-1001',
          tokenNumber: 'TOKEN-001',
          department: 'Cardiology OPD',
          status: 'READY_FOR_DOCTOR',
          intakeMode: 'GENERAL',
          chiefComplaint: 'Seene mein tez dard aur left arm tak phailna (Chest Pain)',
          createdAt: new Date(),
          patientId: {
            _id: 'p1',
            fullName: 'Ramesh Kumar',
            hospitalId: 'HOSP-98214',
            dob: '1976-04-12',
            gender: 'MALE',
            abhaId: '91-8762-4321-1001',
          },
          redFlagAlerts: [
            { _id: 'rf1', title: 'Potential Acute Cardiac Event', severity: 'CRITICAL' }
          ],
          summaryId: {
            _id: 'sum1',
            chiefComplaint: 'Retrosternal chest pain radiating to left arm',
            historyOfPresentIllness: '50-year-old male with severe chest pain (7/10) for 2 days radiating to left shoulder with breathlessness.',
            currentMedications: 'Tab Metformin 500mg, Tab Amlodipine 5mg',
            status: 'DRAFT_AI',
          }
        },
        {
          _id: 'sess_2',
          sessionId: 'SESS-1002',
          tokenNumber: 'AYUSH-004',
          department: 'AYUSH / Ayurveda',
          status: 'READY_FOR_DOCTOR',
          intakeMode: 'AYUSH',
          chiefComplaint: 'Purana paachan kharab (Chronic Indigestion / Amla Pitta)',
          createdAt: new Date(Date.now() - 3600000),
          patientId: {
            _id: 'p2',
            fullName: 'Sunita Sharma',
            hospitalId: 'HOSP-74102',
            dob: '1988-11-20',
            gender: 'FEMALE',
            abhaId: '91-1234-5678-2002',
          },
          redFlagAlerts: [],
          summaryId: {
            _id: 'sum2',
            chiefComplaint: 'Amla Pitta (Acid Reflux)',
            historyOfPresentIllness: '37-year-old female complaining of epigastric burning sensation after spicy meals.',
            status: 'DRAFT_AI',
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredQueue = queue.filter(item => {
    const nameMatch = (item.patientId?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const tokenMatch = (item.tokenNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (filterMode === 'RED_FLAGS') return (nameMatch || tokenMatch) && item.redFlagAlerts?.length > 0;
    if (filterMode === 'AYUSH') return (nameMatch || tokenMatch) && item.intakeMode === 'AYUSH';
    return nameMatch || tokenMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-1">
            <Stethoscope className="w-4 h-4 text-brand-600" />
            <span>Physician Workstation Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Today's Patient Intake Queue</h1>
          <p className="text-sm text-slate-500 font-medium">Review AI pre-consultation summaries, verify histories, and approve clinical records.</p>
        </div>

        <button
          onClick={fetchQueue}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm shadow-xs flex items-center gap-2"
        >
          <Activity className="w-4 h-4 text-brand-600 animate-spin" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Top Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500 block">Total Patients Intake</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{queue.length}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500 block">Waiting For Verification</span>
            <span className="text-3xl font-black text-amber-600 mt-1 block">
              {queue.filter(q => q.status === 'READY_FOR_DOCTOR').length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500 block">Red-Flag Safety Alerts</span>
            <span className="text-3xl font-black text-rose-600 mt-1 block">
              {queue.filter(q => q.redFlagAlerts?.length > 0).length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500 block">Approved Records</span>
            <span className="text-3xl font-black text-emerald-600 mt-1 block">
              {queue.filter(q => q.status === 'APPROVED').length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
        
        <div className="relative flex-1 min-w-[280px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name, ABHA ID, or Token number..."
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 font-medium text-sm focus:outline-none focus:border-brand-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'RED_FLAGS', 'AYUSH', 'GENERAL'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterMode === mode
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mode === 'ALL' ? 'All Records' : mode === 'RED_FLAGS' ? '🚨 Red Flags' : mode === 'AYUSH' ? '🌿 AYUSH OPD' : 'General OPD'}
            </button>
          ))}
        </div>

      </div>

      {/* Queue Patient Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <th className="p-4">Token & Patient</th>
                <th className="p-4">Demographics</th>
                <th className="p-4">Department & Mode</th>
                <th className="p-4">Chief Complaint & AI Summary Draft</th>
                <th className="p-4">Safety Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredQueue.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Token & Patient Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-sm border border-brand-200">
                        {item.tokenNumber}
                      </span>
                      <div>
                        <span className="font-extrabold text-slate-900 block">{item.patientId?.fullName || 'Ramesh Kumar'}</span>
                        <span className="text-xs text-slate-500 font-mono">ID: {item.patientId?.hospitalId || 'HOSP-98214'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Demographics */}
                  <td className="p-4 font-medium text-slate-700">
                    <div>{item.patientId?.gender || 'MALE'} ({item.patientId?.dob ? new Date().getFullYear() - new Date(item.patientId.dob).getFullYear() : 48} yrs)</div>
                    <div className="text-xs text-slate-500">ABHA: {item.patientId?.abhaId || '91-8762-4321-1001'}</div>
                  </td>

                  {/* Department & Mode */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      item.intakeMode === 'AYUSH' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.intakeMode === 'AYUSH' ? '🌿 AYUSH OPD' : '🩺 General Medicine'}
                    </span>
                  </td>

                  {/* Chief Complaint & AI Draft */}
                  <td className="p-4 max-w-md">
                    <span className="font-extrabold text-slate-900 block text-xs truncate">
                      {item.chiefComplaint || item.summaryId?.chiefComplaint}
                    </span>
                    <span className="text-xs text-slate-500 line-clamp-1">
                      {item.summaryId?.historyOfPresentIllness || 'AI Draft summary ready for physician review.'}
                    </span>
                  </td>

                  {/* Safety Status */}
                  <td className="p-4">
                    {item.redFlagAlerts?.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs animate-pulse border border-rose-300">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Red Flag Alert</span>
                      </span>
                    ) : item.status === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approved</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Approval</span>
                      </span>
                    )}
                  </td>

                  {/* Action Button */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate(`/doctor/patient/${item.patientId?._id || 'p1'}?session=${item._id}`)}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Review & Approve</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
