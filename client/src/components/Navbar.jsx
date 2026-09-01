import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Languages, Shield, LogOut, User, Sparkles, AlertTriangle } from 'lucide-react';
import { useAuth } from '../store/authContext';
import { useLanguage } from '../store/languageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const isKioskMode = location.pathname.startsWith('/kiosk');

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                MediKiosk <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-semibold border border-brand-200">AYUSH / EMR</span>
              </span>
              <span className="text-xs text-slate-500 block font-medium">AI Clinical Intake & Pre-Consultation</span>
            </div>
          </Link>

          {/* Center SIH Demo Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>SIH 2026 Presentation Mode</span>
          </div>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
            >
              <Languages className="w-4 h-4 text-brand-600" />
              <span>{language === 'hi' ? 'हिंदी (Hindi)' : 'English'}</span>
            </button>

            {/* Quick Demo Navigation Shortcuts */}
            <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-3">
              <Link to="/kiosk" className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100">
                Kiosk Mode
              </Link>
              <Link to="/doctor" className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                Doctor Queue
              </Link>
              <Link to="/nurse" className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100">
                Nurse Triage
              </Link>
              <Link to="/admin" className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">
                Admin
              </Link>
            </div>

            {/* User Profile / Logout */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900">{user.name}</div>
                  <div className="text-[10px] uppercase font-bold text-brand-600">{user.role}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
