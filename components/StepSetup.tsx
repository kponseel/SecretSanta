
import React from 'react';
import { EventDetails } from '../types';
import { Input, TextArea } from './ui/Input';
import { useTranslation } from '../services/i18nContext';
import { Settings, Calendar, DollarSign } from 'lucide-react';

interface StepSetupProps {
  details: EventDetails;
  setDetails: (d: EventDetails) => void;
}

export const StepSetup: React.FC<StepSetupProps> = ({ details, setDetails }) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof EventDetails, value: string) => {
    setDetails({ ...details, [field]: value });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border-2 border-red-50 p-6 md:p-10 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-green-600 to-red-500"></div>
      
      <div className="flex items-center gap-5 mb-8 border-b border-slate-100 pb-6">
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl shadow-inner">
          <Settings size={28} />
        </div>
        <div>
           <h2 className="text-3xl font-bold text-slate-800">{t('setup.title')}</h2>
           <p className="text-slate-500 mt-1">Define the rules for your holiday exchange</p>
        </div>
      </div>

      <div className="space-y-6">
        <Input
          label={t('setup.name')}
          value={details.eventName}
          onChange={(e) => handleChange('eventName', e.target.value)}
          placeholder="North Pole Party 2024"
          className="border-slate-200"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <Input
              label={t('setup.budget')}
              value={details.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              placeholder="$20"
            />
          </div>
          <Input
            label={t('setup.draw_date') || 'Draw Date'}
            type="date"
            value={details.drawDate || ''}
            onChange={(e) => handleChange('drawDate', e.target.value)}
          />
          <Input
            label={t('setup.date')}
            type="date"
            value={details.exchangeDate}
            onChange={(e) => handleChange('exchangeDate', e.target.value)}
          />
        </div>

        <TextArea
          label={t('setup.message')}
          value={details.message}
          onChange={(e) => handleChange('message', e.target.value)}
          rows={4}
          placeholder="Merry Christmas! We will meet at..."
        />
      </div>
    </div>
  );
};
