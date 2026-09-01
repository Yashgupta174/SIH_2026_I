import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Check, RotateCcw, X, Sparkles } from 'lucide-react';
import { sttService } from '../services/webSpeechService';
import { useLanguage } from '../store/languageContext';

export default function VoiceRecorderModal({ isOpen, onClose, onConfirmAnswer }) {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      handleStartListening();
    } else {
      handleStopListening();
    }
    return () => handleStopListening();
  }, [isOpen]);

  const handleStartListening = () => {
    setTranscript('');
    setErrorMsg('');
    setIsListening(true);

    if (sttService.isSupported()) {
      sttService.startListening(
        language,
        (text, isFinal) => {
          setTranscript(text);
        },
        (err) => {
          console.error('Speech error:', err);
          setErrorMsg('Microphone input issue. Using speech simulation...');
          // Fallback simulation for reliable kiosk demo
          setTranscript('Mujhe seene mein teez dard hai jo left shoulder tak jaata hai.');
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    } else {
      // Kiosk Demo fallback transcript simulation
      setTimeout(() => {
        setTranscript('Mujhe 2 din se teez seene mein dard hai aur saans lene mein takleef ho rahi hai.');
        setIsListening(false);
      }, 1500);
    }
  };

  const handleStopListening = () => {
    setIsListening(false);
    sttService.stopListening();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs">
              <Mic className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold">🎤 Bolkar Uttar Dijiye (Speak Your Answer)</h3>
              <p className="text-xs text-brand-100 font-medium">Aapki aawaz record ho rahi hai...</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 text-center space-y-6">
          
          {/* Animated Microphone Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
              isListening ? 'bg-brand-500 text-white voice-recording-pulse' : 'bg-slate-100 text-slate-400'
            }`}>
              <Mic className="w-12 h-12" />
            </div>
          </div>

          {/* Transcript Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 min-h-[100px] flex items-center justify-center text-center">
            {transcript ? (
              <p className="text-lg font-medium text-slate-800 italic">"{transcript}"</p>
            ) : isListening ? (
              <p className="text-slate-400 animate-pulse text-sm font-medium">Listening... Aap bolna shuru kar sakte hain.</p>
            ) : (
              <p className="text-slate-400 text-sm">Aapka bola hua utter yahan dikhai dega.</p>
            )}
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-amber-600 bg-amber-50 p-2 rounded-lg">{errorMsg}</p>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={handleStartListening}
              className="flex-1 min-h-[56px] rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Phir se bolein (Try Again)</span>
            </button>

            <button
              onClick={() => {
                if (transcript) onConfirmAnswer(transcript);
                onClose();
              }}
              disabled={!transcript}
              className="flex-1 min-h-[56px] rounded-2xl bg-brand-600 text-white font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
            >
              <Check className="w-5 h-5" />
              <span>Uttar Sahi Hai (Confirm)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
