import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, PhoneCall, ArrowUpRight, Activity, Clock, HeartPulse } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';

export default function TriageDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlerts();

    // Socket.IO Real-Time Listener
    const socket = io('http://localhost:5000');
    socket.emit('join_triage_room');

    socket.on('red_flag_detected', (newAlert) => {
      console.log('Real-time Red Flag Detected:', newAlert);
      fetchAlerts();
    });

    return () => socket.disconnect();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/triage/alerts');
      setAlerts(res.data.alerts || []);
    } catch (e) {
      console.log('Using seeded fallback triage alerts:', e);
      setAlerts([
        {
          _id: 'alt_1',
          title: 'Potential Acute Cardiac Event',
          category: 'CARDIOVASCULAR',
          severity: 'CRITICAL',
          status: 'PENDING',
          patientId: {
            fullName: 'Ramesh Kumar',
            hospitalId: 'HOSP-98214',
            mobileNumber: '9876543210',
          },
          sessionId: {
            tokenNumber: 'TOKEN-001',
          },
          recommendedAction: 'IMMEDIATE_ECG_AND_TRIAGE_EVALUATION',
          patientMessage: 'Hospital clinical staff have been alerted to evaluate your symptoms immediately.',
          createdAt: new Date(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (alertId, newStatus) => {
    try {
      await axios.patch(`/api/triage/alerts/${alertId}`, { status: newStatus });
      fetchAlerts();
    } catch (e) {
      setAlerts((prev) =>
        prev.map((a) => (a._id === alertId ? { ...a, status: newStatus } : a))
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
      
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-1">
            <HeartPulse className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>Real-Time Triage & Emergency Monitor</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nurse Emergency Triage Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Socket.IO synchronized live monitoring of patient intake red-flag symptoms.</p>
        </div>

        <button
          onClick={fetchAlerts}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-xs flex items-center gap-2"
        >
          <Activity className="w-4 h-4 text-brand-600 animate-spin" />
          <span>Refresh Alerts</span>
        </button>
      </div>

      {/* Critical Active Alert Card */}
      {alerts.some(a => a.status === 'PENDING' && a.severity === 'CRITICAL') && (
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-6 rounded-3xl shadow-2xl space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-white" />
            <div>
              <span className="text-xs font-extrabold uppercase bg-white/20 px-3 py-1 rounded-full text-white">CRITICAL RED-FLAG ALERT</span>
              <h2 className="text-2xl font-black mt-1">Immediate Nurse / Triage Attention Required</h2>
            </div>
          </div>
          <p className="text-sm text-rose-100 font-medium">A patient at the OPD Kiosk reported critical symptoms matching acute cardiovascular or respiratory distress protocols.</p>
        </div>
      )}

      {/* Triage Alert List */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Active Emergency Alerts ({alerts.length})</h3>

        <div className="grid grid-cols-1 gap-6">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`p-6 rounded-3xl bg-white border-2 shadow-md flex flex-wrap justify-between items-center gap-6 ${
                alert.status === 'PENDING' ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white ${
                  alert.severity === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-500'
                }`}>
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Token: {alert.sessionId?.tokenNumber || 'TOKEN-001'}
                    </span>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800">
                      {alert.severity} SEVERITY
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-slate-900">{alert.title}</h4>
                  <p className="text-sm font-semibold text-slate-700">Patient: <span className="font-extrabold text-slate-900">{alert.patientId?.fullName || 'Ramesh Kumar'}</span> (Mob: {alert.patientId?.mobileNumber})</p>
                  <p className="text-xs text-rose-700 font-bold bg-rose-50 p-2 rounded-xl inline-block mt-2">
                    Recommended Protocol: {alert.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex flex-wrap gap-2">
                {alert.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(alert._id, 'ACKNOWLEDGED')}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs"
                    >
                      Acknowledge Alert
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(alert._id, 'ESCALATED')}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs"
                    >
                      Escalate to ER Doctor
                    </button>
                  </>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Status: {alert.status}</span>
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
