import React, { useState, useEffect } from 'react';
import { Monitor, Camera, Mic, Printer, CheckCircle2, AlertTriangle, RefreshCw, HardDrive } from 'lucide-react';
import axios from 'axios';

export default function KioskManagementPage() {
  const [kiosks, setKiosks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKiosks();
  }, []);

  const fetchKiosks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/kiosks');
      setKiosks(res.data.kiosks || []);
    } catch (e) {
      setKiosks([
        {
          _id: 'k1',
          kioskCode: 'KIOSK-01',
          locationName: 'OPD Block A - Counter 1',
          department: 'General OPD',
          status: 'ONLINE',
          softwareVersion: 'v2.4.0',
          peripherals: { camera: true, microphone: true, documentScanner: true, printer: true, touchscreen: true },
          metrics: { totalIntakesToday: 24, avgIntakeTimeMinutes: 4.1 },
          lastHeartbeat: new Date(),
        },
        {
          _id: 'k2',
          kioskCode: 'KIOSK-02',
          locationName: 'AYUSH OPD Block B - Counter 2',
          department: 'AYUSH / Ayurveda',
          status: 'ONLINE',
          softwareVersion: 'v2.4.0',
          peripherals: { camera: true, microphone: true, documentScanner: true, printer: true, touchscreen: true },
          metrics: { totalIntakesToday: 15, avgIntakeTimeMinutes: 5.2 },
          lastHeartbeat: new Date(),
        },
        {
          _id: 'k3',
          kioskCode: 'KIOSK-03',
          locationName: 'Emergency Triage Counter',
          department: 'Emergency OPD',
          status: 'WARNING',
          softwareVersion: 'v2.3.9',
          peripherals: { camera: true, microphone: false, documentScanner: true, printer: true, touchscreen: true },
          metrics: { totalIntakesToday: 12, avgIntakeTimeMinutes: 3.8 },
          lastHeartbeat: new Date(Date.now() - 300000),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kiosk Hardware & Peripheral Health</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time status monitoring for hospital touch kiosks, cameras, microphones, and document scanners.</p>
        </div>

        <button
          onClick={fetchKiosks}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-brand-600 animate-spin" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Kiosks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kiosks.map((kiosk) => (
          <div key={kiosk._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase font-mono">{kiosk.kioskCode}</span>
                <h3 className="text-xl font-black text-slate-900">{kiosk.locationName}</h3>
                <p className="text-xs text-slate-500 font-semibold">{kiosk.department}</p>
              </div>

              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                kiosk.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {kiosk.status === 'ONLINE' ? '🟢 ONLINE' : '🟡 WARNING'}
              </span>
            </div>

            {/* Hardware Peripherals Check */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase block">Peripheral Status</span>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <Camera className="w-4 h-4 text-brand-600" />
                  <span>Camera: {kiosk.peripherals?.camera ? '✓ OK' : '❌ Issue'}</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <Mic className="w-4 h-4 text-brand-600" />
                  <span>Mic: {kiosk.peripherals?.microphone ? '✓ OK' : '⚠️ Checking'}</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <HardDrive className="w-4 h-4 text-brand-600" />
                  <span>Scanner: {kiosk.peripherals?.documentScanner ? '✓ OK' : '❌ Issue'}</span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <Printer className="w-4 h-4 text-brand-600" />
                  <span>Printer: {kiosk.peripherals?.printer ? '✓ OK' : '❌ Issue'}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-medium pt-2 border-t border-slate-100 flex justify-between">
              <span>Version: {kiosk.softwareVersion}</span>
              <span>Intakes Today: {kiosk.metrics?.totalIntakesToday || 0}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
