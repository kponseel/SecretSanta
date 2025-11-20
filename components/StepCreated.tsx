import React from 'react';
import { EventDetails } from '../types';
import { Button } from './ui/Button';
import { useTranslation } from '../services/i18nContext';
import { CheckCircle, Mail, ArrowRight, Link as LinkIcon, Cloud } from 'lucide-react';

interface StepCreatedProps {
  details: EventDetails;
  onContinue: () => void;
}

export const StepCreated: React.FC<StepCreatedProps> = ({ details, onContinue }) => {
  const { t } = useTranslation();
  
  // Construct the management link
  const baseUrl = window.location.href.split('?')[0];
  const manageUrl = `${baseUrl}?manage=${details.id}`;

  const handleEmail = () => {
    const subject = encodeURIComponent(`Secret Santa Management Link: ${details.eventName}`);
    const body = encodeURIComponent(`Hi!\n\nHere is the link to manage your Secret Santa event "${details.eventName}".\n\nManagement Link: ${manageUrl}\n\nKeep this link safe!`);
    window.location.href = `mailto:${details.organizerEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in px-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-emerald-50 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-50 p-8 text-center border-b border-emerald-100">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
             <CheckCircle size={40} />
           </div>
           <h2 className="text-3xl font-black text-emerald-900">{t('created.title')}</h2>
           <p className="text-emerald-700 mt-2 font-medium max-w-md mx-auto">{t('created.desc')}</p>
        </div>

        <div className="p-8 md:p-12 space-y-8">
           {/* Link Section */}
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <LinkIcon size={14} /> {t('created.link_label')}
              </label>
              <div className="flex gap-3 flex-col md:flex-row">
                <code className="flex-1 bg-slate-100 border border-slate-200 p-4 rounded-xl text-slate-700 font-mono text-sm break-all flex items-center">
                   {manageUrl}
                </code>
                <Button onClick={() => navigator.clipboard.writeText(manageUrl)} variant="outline">
                   Copy
                </Button>
              </div>
           </div>

           {/* QR Code & Email */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
                 <p className="text-sm font-bold text-slate-800 mb-4">{t('created.qr_label')}</p>
                 <img 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(manageUrl)}`} 
                   alt="QR Code" 
                   className="rounded-lg border border-slate-200"
                 />
              </div>
              
              <div className="flex flex-col justify-center gap-4">
                 <Button fullWidth variant="secondary" onClick={handleEmail}>
                    <Mail size={18} className="mr-2" /> {t('created.email_btn')}
                 </Button>
                 <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex gap-2 items-start text-left">
                   <Cloud size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                   <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                     Your event is saved in our database. You can access the dashboard from any device using your management link.
                   </p>
                 </div>
              </div>
           </div>

           <div className="pt-4 border-t border-slate-100">
              <Button fullWidth size="lg" onClick={onContinue} className="group">
                 {t('created.dashboard_btn')} <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
};