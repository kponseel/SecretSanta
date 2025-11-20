import React, { useState } from 'react';
import { Input, TextArea } from './ui/Input';
import { Button } from './ui/Button';
import { useTranslation } from '../services/i18nContext';
import { encodeTicket } from '../services/santaService';
import { TicketData } from '../types';
import { Gift, Copy, Check, Ticket, Snowflake } from 'lucide-react';

export const JoinView: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<TicketData>({ n: '', e: '', d: '', w: '' });
  const [ticket, setTicket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!form.n || !form.e) return;
    const code = encodeTicket(form);
    setTicket(code);
  };

  const copyToClipboard = () => {
    if (ticket) {
      navigator.clipboard.writeText(ticket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-10 left-10 text-red-200/30"><Snowflake size={64} /></div>
         <div className="absolute bottom-20 right-10 text-emerald-200/30"><Snowflake size={96} /></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 border-4 border-red-50 relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-white ring-4 ring-red-100">
            <Gift size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('join.title')}</h1>
          <p className="text-slate-500 mt-2 text-base leading-relaxed font-medium">{t('join.desc')}</p>
        </div>

        {!ticket ? (
          <div className="space-y-5">
            <Input
              label={t('part.name')}
              value={form.n}
              onChange={(e) => setForm({ ...form, n: e.target.value })}
              placeholder="Jane Doe"
            />
            <Input
              label={t('part.email')}
              type="email"
              value={form.e}
              onChange={(e) => setForm({ ...form, e: e.target.value })}
              placeholder="jane@example.com"
            />
            <Input
              label={t('part.dept')}
              value={form.d}
              onChange={(e) => setForm({ ...form, d: e.target.value })}
              placeholder="Marketing"
            />
            <TextArea
              label={t('part.wish')}
              value={form.w}
              onChange={(e) => setForm({ ...form, w: e.target.value })}
              placeholder="Socks, books, chocolate..."
              rows={3}
            />
            <Button fullWidth size="lg" onClick={generate} disabled={!form.n || !form.e} className="mt-4 shadow-xl shadow-red-100">
              {t('join.generate')}
            </Button>
          </div>
        ) : (
          <div className="bg-red-50 rounded-2xl p-8 border border-red-100 text-center animate-fade-in relative">
            <div className="flex justify-center mb-4 text-red-600">
              <Ticket size={40} />
            </div>
            <label className="block text-sm font-bold text-red-900 mb-3 uppercase tracking-wider">
              {t('join.code_label')}
            </label>
            <div 
              onClick={copyToClipboard}
              className="bg-white border-2 border-red-200 rounded-xl p-5 font-mono text-sm break-all text-slate-700 cursor-pointer hover:border-red-400 hover:shadow-md transition-all relative group text-left"
            >
              {ticket}
              <div className="absolute top-2 right-2 text-emerald-600 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </div>
            </div>
            <div className={`h-6 mt-3 text-sm font-bold transition-opacity duration-300 ${copied ? 'opacity-100 text-emerald-600' : 'opacity-0'}`}>
               {t('join.copied')}
            </div>
            <div className="mt-6">
              <Button variant="ghost" onClick={() => setTicket(null)} size="sm">
                Edit Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};