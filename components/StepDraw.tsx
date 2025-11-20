import React, { useState } from 'react';
import { Participant, Pairing } from '../types';
import { Button } from './ui/Button';
import { generateDraw } from '../services/santaService';
import { useTranslation } from '../services/i18nContext';
import { Wand2, AlertTriangle, Snowflake } from 'lucide-react';

interface StepDrawProps {
  participants: Participant[];
  setPairings: (p: Pairing[]) => void;
  onComplete: () => void;
}

export const StepDraw: React.FC<StepDrawProps> = ({ participants, setPairings, onComplete }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = async () => {
    setIsDrawing(true);
    setError(null);
    
    // Simulate a small delay for "magic"
    await new Promise(r => setTimeout(r, 1500));

    const result = generateDraw(participants);
    
    if (result) {
      setPairings(result);
      onComplete();
    } else {
      setError(t('draw.fail'));
    }
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in px-4">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-4 border-red-100 text-center max-w-lg w-full relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute -top-10 -right-10 text-red-50 opacity-50">
          <Snowflake size={150} />
        </div>
        <div className="absolute -bottom-10 -left-10 text-emerald-50 opacity-50">
          <Snowflake size={150} />
        </div>

        <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg border-4 border-red-100">
            <Wand2 size={40} className={isDrawing ? "animate-pulse" : ""} />
            </div>
            
            <h2 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">{t('draw.title')}</h2>
            <p className="text-slate-500 mb-8 text-lg font-medium">
            Ready to assign {participants.length} elves their secret missions?
            {participants.length < 2 && <span className="text-red-600 font-bold block mt-2 bg-red-50 py-2 rounded-lg">Need at least 2 people!</span>}
            </p>

            {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-3 text-left border border-red-200 shadow-sm">
                <AlertTriangle size={24} className="shrink-0 text-red-600" />
                <span className="text-sm font-bold">{error}</span>
            </div>
            )}

            <Button 
            size="lg" 
            fullWidth 
            onClick={handleDraw} 
            disabled={isDrawing || participants.length < 2}
            className="text-lg py-5 shadow-xl shadow-red-200 bg-gradient-to-r from-red-600 to-red-800 border-t border-red-400 hover:from-red-700 hover:to-red-900 transform hover:-translate-y-1 transition-all"
            >
            {isDrawing ? 'Mixing Hot Cocoa...' : t('draw.btn')}
            </Button>
        </div>
      </div>
    </div>
  );
};