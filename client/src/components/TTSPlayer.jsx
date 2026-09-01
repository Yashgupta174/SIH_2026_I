import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Gauge } from 'lucide-react';
import { ttsService } from '../services/speechSynthesisService';
import { useLanguage } from '../store/languageContext';

export default function TTSPlayer({ textToSpeak }) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.9); // Default slow/normal for clear intake audio

  const handlePlay = () => {
    if (!textToSpeak) return;
    setIsPlaying(true);
    ttsService.speak(textToSpeak, language, speed);
  };

  const handleStop = () => {
    setIsPlaying(false);
    ttsService.cancel();
  };

  const toggleSpeed = () => {
    const nextSpeed = speed === 0.9 ? 0.75 : 0.9;
    setSpeed(nextSpeed);
    if (isPlaying) {
      ttsService.speak(textToSpeak, language, nextSpeed);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-brand-50 border border-brand-200 text-brand-800 shadow-sm">
      <button
        onClick={isPlaying ? handleStop : handlePlay}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
          isPlaying ? 'bg-brand-600 text-white animate-pulse' : 'bg-white text-brand-700 hover:bg-brand-100 shadow-xs'
        }`}
      >
        {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-brand-600" />}
        <span>{isPlaying ? 'Pause Audio' : '🔊 Hear Question'}</span>
      </button>

      <button
        onClick={handlePlay}
        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 transition-colors"
        title="Repeat Audio"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        onClick={toggleSpeed}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
        title="Audio Speed"
      >
        <Gauge className="w-3.5 h-3.5 text-brand-600" />
        <span>{speed === 0.75 ? 'Slow 🐢' : 'Normal ⚡'}</span>
      </button>
    </div>
  );
}
