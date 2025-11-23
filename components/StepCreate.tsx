import React, { useState } from 'react';
import { EventDetails } from '../types';
import { Button } from './ui/Button';
import { useTranslation } from '../services/i18nContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Gift } from 'lucide-react';

interface StepCreateProps {
  onCreate: (details: EventDetails) => void;
}

// Robust ID Generator
const generateId = () => {
  // Use crypto.randomUUID if available and secure
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch (e) {
      console.warn('crypto.randomUUID failed, falling back', e);
    }
  }
  
  // Fallback for older browsers or insecure contexts (http)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const StepCreate: React.FC<StepCreateProps> = ({ onCreate }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0); // 0: Details, 1: Organizer
  
  const [details, setDetails] = useState<EventDetails>({
    id: generateId(),
    eventName: '',
    organizerEmail: '',
    budget: '',
    exchangeDate: '',
    drawDate: '',
    message: '',
  });
  
  // 'exchange' or 'draw' or null
  const [calendarMode, setCalendarMode] = useState<'exchange' | 'draw' | null>(null);

  const handleNext = () => {
    if (step === 0 && details.eventName && details.budget && details.exchangeDate && details.drawDate) {
      setStep(1);
    } else if (step === 1 && details.organizerEmail) {
      onCreate(details);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto animate-fade-in pt-8 md:pt-16 pb-20">
      
      {/* Decorative background blob */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-50/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-50/50 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
        {step === 0 && (
          <>
            {/* Branding / Hero Section */}
            <div className="mb-12 md:mb-20 px-2">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-800 text-xs font-bold tracking-widest uppercase mb-6 border border-red-100 shadow-sm">
                  <Sparkles size={14} className="text-red-600" />
                  Secret Santa Organizer
               </div>
               <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
                 The Modern <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Gift Exchange.</span>
               </h1>
               <p className="text-lg md:text-xl text-slate-500 max-w-md leading-relaxed font-medium">
                 Organize your Secret Santa in seconds. <br className="hidden md:block"/>No accounts. No ads. Just holiday cheer.
               </p>
            </div>

            {/* Conversational Form */}
            <div className="space-y-12 md:space-y-16 pl-0 md:pl-8 border-l-0 md:border-l-4 border-slate-100 px-2">
                <div className="text-3xl md:text-5xl lg:text-6xl font-medium leading-snug md:leading-tight tracking-tight text-stone-300">
                <p className="inline leading-normal">
                    <span className="text-stone-800 transition-colors duration-500">Our Secret Santa is called </span>
                    <DynamicInput 
                    placeholder="Family Party" 
                    value={details.eventName} 
                    onChange={e => setDetails({...details, eventName: e.target.value})}
                    />
                    <span className="text-stone-800 transition-colors duration-500"> with a budget of </span>
                    <DynamicInput 
                    placeholder="$20" 
                    value={details.budget} 
                    onChange={e => setDetails({...details, budget: e.target.value})}
                    minWidth="80px"
                    />
                    <span className="text-stone-800 transition-colors duration-500">, names will be drawn on </span>
                    <span 
                    className={`inline-block border-b-2 transition-colors cursor-pointer select-none ${details.drawDate ? 'border-stone-200 text-red-800' : 'border-stone-200 text-stone-300 hover:text-red-400'}`}
                    onClick={() => setCalendarMode('draw')}
                    >
                    {details.drawDate ? formatDateDisplay(details.drawDate) : "[ Draw Date ]"}
                    </span>
                    <span className="text-stone-800 transition-colors duration-500"> and gifts exchanged on </span>
                    <span 
                    className={`inline-block border-b-2 transition-colors cursor-pointer select-none ${details.exchangeDate ? 'border-stone-200 text-red-800' : 'border-stone-200 text-stone-300 hover:text-red-400'}`}
                    onClick={() => setCalendarMode('exchange')}
                    >
                    {details.exchangeDate ? formatDateDisplay(details.exchangeDate) : "[ Exchange Date ]"}
                    </span>
                    <span className="text-stone-800 transition-colors duration-500">.</span>
                </p>
                </div>
                
                <div className={`transition-opacity duration-500 ${details.eventName && details.budget && details.exchangeDate && details.drawDate ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Button 
                    size="lg" 
                    className="w-full md:w-auto rounded-full px-10 py-6 text-lg bg-red-900 hover:bg-red-950 shadow-2xl shadow-red-200 transition-all transform hover:scale-105"
                    onClick={handleNext}
                >
                    Next <ArrowRight className="ml-2" />
                </Button>
                </div>
            </div>
          </>
        )}

        {step === 1 && (
          <div className="space-y-12 md:space-y-16 animate-fade-in pt-10 px-2">
            <div className="text-3xl md:text-5xl lg:text-6xl font-medium leading-snug md:leading-tight tracking-tight text-stone-300">
              <p className="inline leading-normal">
                <span className="text-stone-800">My email is </span>
                <DynamicInput 
                  type="email"
                  placeholder="email address" 
                  value={details.organizerEmail} 
                  onChange={e => setDetails({...details, organizerEmail: e.target.value})}
                  autoFocus
                  minWidth="300px"
                />
                <span className="text-stone-800"> so I can manage the event.</span>
              </p>
              
              <div className="mt-12 text-xl md:text-2xl text-stone-800 font-normal">
                 <p className="mb-4 text-stone-400 text-lg uppercase tracking-widest font-bold flex items-center gap-2">
                    <Gift size={20} />
                    Optional Message
                 </p>
                 <textarea 
                   className="w-full bg-transparent border-l-4 border-stone-200 pl-6 py-2 focus:border-red-800 outline-none placeholder-stone-300/50 min-h-[120px] resize-none transition-colors"
                   placeholder="I'd like to add a note for everyone..."
                   value={details.message}
                   onChange={e => setDetails({...details, message: e.target.value})}
                 />
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <button onClick={() => setStep(0)} className="text-stone-400 hover:text-stone-800 font-medium px-4 py-2">
                 Back
              </button>
              <Button 
                size="lg" 
                className="flex-1 md:flex-none rounded-full px-10 py-6 text-lg bg-red-900 hover:bg-red-950 shadow-2xl shadow-red-200 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                onClick={handleNext}
                disabled={!details.organizerEmail}
              >
                Create Event
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Minimal Calendar Modal */}
      {calendarMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/10 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setCalendarMode(null)}>
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full border-4 border-white" onClick={e => e.stopPropagation()}>
             <div className="text-center mb-2 text-red-800 font-bold text-sm uppercase tracking-widest">
                {calendarMode === 'draw' ? 'Draw Date' : 'Exchange Date'}
             </div>
             <SimpleCalendar 
               selected={calendarMode === 'draw' ? details.drawDate : details.exchangeDate} 
               onSelect={(date) => {
                 if (calendarMode === 'draw') setDetails({...details, drawDate: date});
                 else setDetails({...details, exchangeDate: date});
                 setCalendarMode(null);
               }} 
             />
             <div className="mt-6 text-center">
               <button onClick={() => setCalendarMode(null)} className="text-sm text-stone-400 hover:text-stone-800 font-medium px-4 py-2">Cancel</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---

const DynamicInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  minWidth?: string;
  autoFocus?: boolean;
}> = ({ value, onChange, placeholder, type = "text", minWidth = "120px", autoFocus }) => {
  return (
    <span className="inline-grid items-center justify-items-start border-b-2 border-stone-200 focus-within:border-red-800 transition-colors mx-1 relative top-0 md:top-1">
      {/* Hidden span to measuring width */}
      <span className="col-start-1 row-start-1 opacity-0 px-1 pointer-events-none whitespace-pre font-medium h-full flex items-center overflow-hidden max-w-full">
        {value || placeholder}
      </span>
      <input
        autoFocus={autoFocus}
        className="col-start-1 row-start-1 w-full bg-transparent outline-none text-red-900 placeholder-stone-300/50 px-1 font-medium text-left lg:text-left truncate"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        style={{ minWidth }}
      />
    </span>
  );
};

// A minimalist calendar component
const SimpleCalendar: React.FC<{ selected: string, onSelect: (d: string) => void }> = ({ selected, onSelect }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(selected ? new Date(selected) : today);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handlePrev = () => setViewDate(new Date(year, month - 1, 1));
  const handleNext = () => setViewDate(new Date(year, month + 1, 1));

  const isSelected = (d: number) => {
    if (!selected) return false;
    const s = new Date(selected);
    return s.getDate() === d && s.getMonth() === month && s.getFullYear() === year;
  };

  const handleDayClick = (d: number) => {
    // Format YYYY-MM-DD manually to avoid timezone issues
    const m = (month + 1).toString().padStart(2, '0');
    const dayStr = d.toString().padStart(2, '0');
    onSelect(`${year}-${m}-${dayStr}`);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrev} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-800 transition-colors"><ChevronLeft size={20} /></button>
        <h3 className="text-lg font-bold text-stone-800">{monthNames[month]} {year}</h3>
        <button onClick={handleNext} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-800 transition-colors"><ChevronRight size={20} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-xs font-bold text-stone-300 p-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
           <div key={i} className="aspect-square flex items-center justify-center">
             {d ? (
               <button 
                 onClick={() => handleDayClick(d)}
                 className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${isSelected(d) ? 'bg-red-900 text-white shadow-lg shadow-red-200' : 'text-stone-600 hover:bg-stone-100'}`}
               >
                 {d}
               </button>
             ) : <div />}
           </div>
        ))}
      </div>
    </div>
  );
};

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  // Adjust for timezone to prevent showing previous day
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
  return adjustedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};