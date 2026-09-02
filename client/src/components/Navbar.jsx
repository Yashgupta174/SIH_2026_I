import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Languages, LogOut, User, Sparkles, Phone, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../store/authContext';
import { useLanguage } from '../store/languageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Patient Portal', path: '/patient/portal', highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs font-sans">
      
      {/* 1. TOP OFFICIAL GOVERNMENT HEALTHCARE STRIP */}
      <div className="bg-slate-900 text-slate-200 text-[11px] font-semibold py-1 px-4 sm:px-8 border-t-4 border-emerald-600 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold">भारत सरकार | Government of India</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-300">Ministry of Health & Family Welfare (MoHFW)</span>
        </div>

        <div className="flex items-center gap-4 text-[10.5px] font-mono">
          <span className="hidden sm:inline">🚑 Helpline: <strong className="text-emerald-400 font-bold">104</strong></span>
          <span>🚨 Emergency: <strong className="text-rose-400 font-bold">112</strong></span>
          <span className="hidden lg:inline">🆔 ABDM Toll-Free: <strong className="text-blue-300 font-bold">1800-11-4477</strong></span>
        </div>
      </div>

      {/* 2. MAIN MINIMAL NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Government Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                MediKiosk
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-300">
                  ABDM / MoHFW Ready
                </span>
              </span>
              <span className="text-[11px] text-slate-500 block font-semibold">National Health Authority • Pre-Consultation Engine</span>
            </div>
          </Link>

          {/* Right Side: Navigation Links + Language Switcher + Authentication */}
          <div className="flex items-center gap-3">
            
            {/* Right Aligned Navigation Links */}
            <nav className="flex items-center gap-2 border-r border-slate-200 pr-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      link.highlight
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        : isActive
                        ? 'bg-slate-100 text-emerald-800 font-extrabold border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'हिंदी (Hindi)' : 'English'}</span>
            </button>

            {/* User Profile State */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900">{user.name}</div>
                  <div className="text-[10px] uppercase font-extrabold text-emerald-700">{user.role}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-slate-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
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
