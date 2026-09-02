import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import KioskHome from './pages/kiosk/KioskHome';
import RegistrationPage from './pages/kiosk/RegistrationPage';
import ConsentPage from './pages/kiosk/ConsentPage';
import InterviewPage from './pages/kiosk/InterviewPage';
import ScannerPage from './pages/kiosk/ScannerPage';
import PatientReviewPage from './pages/kiosk/PatientReviewPage';
import SuccessPage from './pages/kiosk/SuccessPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDetailPage from './pages/doctor/PatientDetailPage';
import TriageDashboard from './pages/nurse/TriageDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import KioskManagementPage from './pages/admin/KioskManagementPage';
import AuditLogPage from './pages/admin/AuditLogPage';
import PatientPortalPage from './pages/patient/PatientPortalPage';
import SIHDemoDashboard from './pages/demo/SIHDemoDashboard';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<SIHDemoDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Kiosk Flow */}
          <Route path="/kiosk" element={<KioskHome />} />
          <Route path="/kiosk/registration" element={<RegistrationPage />} />
          <Route path="/kiosk/consent" element={<ConsentPage />} />
          <Route path="/kiosk/interview" element={<InterviewPage />} />
          <Route path="/kiosk/scanner" element={<ScannerPage />} />
          <Route path="/kiosk/patient-review" element={<PatientReviewPage />} />
          <Route path="/kiosk/complete" element={<SuccessPage />} />

          {/* Doctor Workstation */}
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/patient/:id" element={<PatientDetailPage />} />

          {/* Nurse Triage Workstation */}
          <Route path="/nurse" element={<TriageDashboard />} />

          {/* Admin Workstation */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/kiosks" element={<KioskManagementPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogPage />} />

          {/* Patient Portal */}
          <Route path="/patient/portal" element={<PatientPortalPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

