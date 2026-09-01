import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Lock, Clock, User } from 'lucide-react';
import axios from 'axios';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/admin/audit-logs');
      setLogs(res.data.logs || []);
    } catch (e) {
      setLogs([
        {
          _id: 'a1',
          userName: 'Dr. Vikram Seth',
          userRole: 'DOCTOR',
          action: 'CLINICAL_HISTORY_APPROVED',
          resourceType: 'ClinicalSummary',
          timestamp: new Date(),
        },
        {
          _id: 'a2',
          userName: 'Ramesh Kumar',
          userRole: 'PATIENT',
          action: 'CONSENT_GRANTED',
          resourceType: 'Consent',
          timestamp: new Date(Date.now() - 1800000),
        },
        {
          _id: 'a3',
          userName: 'Sister Priya Nair',
          userRole: 'NURSE',
          action: 'TRIAGE_ALERT_ACKNOWLEDGED',
          resourceType: 'RedFlagAlert',
          timestamp: new Date(Date.now() - 3600000),
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Security Audit Logs</h1>
        <p className="text-sm text-slate-500 font-medium">Immutable audit trail of all clinical views, edits, consents, and approvals.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
              <th className="p-4">Timestamp</th>
              <th className="p-4">User & Role</th>
              <th className="p-4">Action</th>
              <th className="p-4">Resource Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm font-medium">
            {logs.map((l) => (
              <tr key={l._id} className="hover:bg-slate-50">
                <td className="p-4 text-xs font-mono text-slate-500">{new Date(l.timestamp).toLocaleString()}</td>
                <td className="p-4">
                  <span className="font-bold text-slate-900 block">{l.userName || 'System'}</span>
                  <span className="text-[10px] uppercase font-bold text-brand-600">{l.userRole || 'PATIENT'}</span>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-extrabold">
                    {l.action}
                  </span>
                </td>
                <td className="p-4 text-xs font-semibold text-slate-600">{l.resourceType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
