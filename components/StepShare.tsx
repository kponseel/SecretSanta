import React, { useState } from 'react';
import { Pairing, EventDetails } from '../types';
import { Button } from './ui/Button';
import { useTranslation } from '../services/i18nContext';
import { useToast } from '../services/toastContext';
import { Mail, Copy, Gift, Eye, EyeOff, ExternalLink, Star } from 'lucide-react';

interface StepShareProps {
  pairings: Pairing[];
  eventDetails: EventDetails;
}

export const StepShare: React.FC<StepShareProps> = ({ pairings, eventDetails }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [selectedViewer, setSelectedViewer] = useState<string>('');
  const [revealed, setRevealed] = useState(false);

  // Helper to generate message
  const getMessage = (p: Pairing) => {
    return `Ho ho ho ${p.giver.name}! 🎅\n\n` +
      `You are the Secret Santa for: ${p.receiver.name}!\n\n` +
      `Event: ${eventDetails.eventName}\n` +
      `Date: ${eventDetails.exchangeDate}\n` +
      `Budget: ${eventDetails.budget}\n\n` +
      (p.receiver.wishlist ? `They wished for: ${p.receiver.wishlist}\n\n` : '') +
      `${eventDetails.message}`;
  };

  const handleEmail = (p: Pairing) => {
    const subject = encodeURIComponent(`Secret Santa: ${eventDetails.eventName}`);
    const body = encodeURIComponent(getMessage(p));
    window.location.href = `mailto:${p.giver.email}?subject=${subject}&body=${body}`;
    showToast("Email client opened!", "info");
  };

  const handleCopy = (p: Pairing) => {
    navigator.clipboard.writeText(getMessage(p));
    showToast(`Message for ${p.giver.name} copied!`, "success");
  };

  const viewerPairing = pairings.find(p => p.giver.id === selectedViewer);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Preview Section */}
      <div className="bg-white rounded-3xl shadow-xl border-4 border-emerald-800/10 overflow-hidden">
        <div className="bg-emerald-800 px-6 py-5 text-white flex flex-col md:flex-row justify-between items-center gap-4 border-b-4 border-amber-400">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-lg">
                <Gift className="text-amber-300" />
             </div>
             <h2 className="font-bold text-xl tracking-wide">{t('share.title')}</h2>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <label className="text-emerald-100 text-sm whitespace-nowrap font-medium">{t('share.preview_as')}</label>
             <select 
               className="bg-emerald-900 border border-emerald-700 text-white text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none cursor-pointer shadow-sm"
               value={selectedViewer}
               onChange={(e) => { setSelectedViewer(e.target.value); setRevealed(false); }}
             >
               <option value="">-- Select Elf --</option>
               {pairings.map(p => (
                 <option key={p.giver.id} value={p.giver.id}>{p.giver.name}</option>
               ))}
             </select>
          </div>
        </div>
        
        <div className="p-8 min-h-[400px] flex items-center justify-center bg-stone-100 relative">
          
          {viewerPairing ? (
             <div className="max-w-md w-full bg-white rounded-sm shadow-xl p-8 text-center transform transition-all relative border-t-8 border-red-700">
                {/* Stamp */}
                <div className="absolute top-4 right-4 w-16 h-20 bg-red-100 border-2 border-dashed border-red-300 flex items-center justify-center rotate-3">
                    <Star size={24} className="text-red-400" fill="currentColor" />
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-2 font-serif">Dearest {viewerPairing.giver.name},</h3>
                <p className="text-slate-500 mb-8 italic font-serif">A special mission from the North Pole...</p>
                
                <div className="bg-red-50 rounded-xl p-8 mb-8 relative overflow-hidden border-2 border-red-100 group">
                  {!revealed ? (
                    <div className="flex flex-col items-center justify-center py-4 cursor-pointer" onClick={() => setRevealed(true)}>
                       <EyeOff size={48} className="text-red-300 mb-4 group-hover:text-red-500 transition-colors" />
                       <p className="text-red-700 font-bold text-lg group-hover:scale-105 transition-transform uppercase tracking-widest">{t('share.reveal')}</p>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                       <p className="text-xs text-red-400 uppercase font-bold tracking-widest mb-2">You are gifting to</p>
                       <h2 className="text-3xl font-black text-slate-900 mb-3 font-serif">{viewerPairing.receiver.name}</h2>
                       {viewerPairing.receiver.wishlist ? (
                         <div className="mt-4 text-sm bg-white p-4 rounded-xl text-slate-700 italic border border-red-100 shadow-sm relative">
                           <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 text-[10px] px-2 rounded-full font-bold">WISHLIST</div>
                           "{viewerPairing.receiver.wishlist}"
                         </div>
                       ) : (
                         <p className="text-sm text-slate-400 italic mt-2">No wishlist provided</p>
                       )}
                       <button 
                         onClick={() => setRevealed(false)}
                         className="absolute top-2 right-2 text-red-300 hover:text-red-500 bg-white/50 hover:bg-white rounded-full p-1 transition-all"
                       >
                         <EyeOff size={16}/>
                       </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-center">
                  <Button size="md" variant="outline" onClick={() => handleCopy(viewerPairing)}>
                    <Copy size={18} className="mr-2"/> {t('share.copy')}
                  </Button>
                </div>
             </div>
          ) : (
             <div className="text-slate-400 text-center max-w-sm">
               <div className="bg-emerald-100/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 border-4 border-white shadow-sm">
                 <ExternalLink size={40} />
               </div>
               <p className="text-xl font-bold text-slate-600 mb-2">Simulator Mode</p>
               <p className="text-base leading-relaxed">Select a participant from the top right to preview what they will see when they open their secret assignment.</p>
             </div>
          )}
        </div>
      </div>

      {/* Admin Distribution List */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
           <h3 className="text-xl font-bold text-slate-900">Master List</h3>
           <span className="px-2 py-1 bg-slate-800 text-white text-xs rounded-md font-bold uppercase tracking-wider">Admin</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pairings.map((p, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-emerald-200 transition-all group bg-white">
               <div className="flex justify-between items-start mb-3">
                 <div className="font-bold text-slate-800 text-lg">{p.giver.name}</div>
                 <div className="text-[10px] uppercase tracking-wider font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">Santa</div>
               </div>
               
               <div className="flex items-center gap-2 mb-5 text-emerald-600/50">
                  <div className="h-px flex-1 bg-emerald-100"></div>
                  <Gift size={14} />
                  <div className="h-px flex-1 bg-emerald-100"></div>
               </div>

               <div className="flex justify-between items-start mb-4">
                 <div className="font-bold text-slate-800 text-lg">{p.receiver.name}</div>
                 <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Receiver</div>
               </div>

               <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                 <Button size="sm" variant="secondary" className="flex-1 py-2 rounded-lg" onClick={() => handleEmail(p)}>
                   <Mail size={14} className="mr-1.5"/> Email
                 </Button>
                 <Button size="sm" variant="outline" className="flex-1 py-2 rounded-lg" onClick={() => handleCopy(p)}>
                   <Copy size={14} className="mr-1.5"/> Copy
                 </Button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};