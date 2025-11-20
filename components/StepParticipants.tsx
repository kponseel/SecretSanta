import React, { useState } from 'react';
import { Participant } from '../types';
import { Input, TextArea } from './ui/Input';
import { Button } from './ui/Button';
import { useTranslation } from '../services/i18nContext';
import { decodeTicket, parseCSV } from '../services/santaService';
import { Users, Trash2, Plus, FileText, Ticket, UserPlus, Gift, Link as LinkIcon, Copy, Check } from 'lucide-react';

interface StepParticipantsProps {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}

export const StepParticipants: React.FC<StepParticipantsProps> = ({ participants, setParticipants }) => {
  const { t } = useTranslation();
  const [newP, setNewP] = useState<Partial<Participant>>({});
  const [importMode, setImportMode] = useState<'none' | 'ticket' | 'csv'>('none');
  const [importText, setImportText] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Generate a generic join link (points to #join)
  const inviteLink = `${window.location.origin}${window.location.pathname}#join`;

  const addParticipant = () => {
    if (!newP.name || !newP.email) return;
    const p: Participant = {
      id: crypto.randomUUID(),
      name: newP.name,
      email: newP.email,
      group: newP.group,
      department: newP.department,
      wishlist: newP.wishlist
    };
    setParticipants([...participants, p]);
    setNewP({});
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleImport = () => {
    if (importMode === 'ticket') {
      const data = decodeTicket(importText.trim());
      if (data) {
        const p: Participant = {
          id: crypto.randomUUID(),
          name: data.n,
          email: data.e,
          group: data.g,
          department: data.d,
          wishlist: data.w,
        };
        setParticipants([...participants, p]);
        setImportMode('none');
        setImportText('');
      } else {
        alert("Invalid Ticket Code");
      }
    } else if (importMode === 'csv') {
      const parsed = parseCSV(importText);
      const mapped: Participant[] = parsed.map(p => ({
        id: crypto.randomUUID(),
        name: p.name!,
        email: p.email!,
        group: p.group,
        department: '',
        wishlist: ''
      }));
      setParticipants([...participants, ...mapped]);
      setImportMode('none');
      setImportText('');
    }
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Invite Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-white rounded-3xl shadow-sm border border-emerald-100 p-6 flex flex-col md:flex-row items-center gap-6">
         <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
            <LinkIcon size={24} />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-slate-800 text-lg">{t('part.invite_link')}</h3>
            <p className="text-slate-500 text-sm">{t('part.invite_desc')}</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <div className="bg-white border border-emerald-200 px-4 py-2 rounded-xl text-sm text-slate-600 font-mono truncate max-w-[200px] select-all">
               {inviteLink}
            </div>
            <Button variant="secondary" size="sm" onClick={copyInvite}>
               {linkCopied ? <Check size={18}/> : <Copy size={18}/>}
            </Button>
         </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-50 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shadow-sm">
              <UserPlus size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{t('part.title')}</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Build your list</p>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={() => setImportMode('ticket')} title={t('part.import')}>
               <Ticket size={16} className="mr-1.5"/> Ticket
             </Button>
             <Button variant="outline" size="sm" onClick={() => setImportMode('csv')} title={t('part.import_csv')}>
               <FileText size={16} className="mr-1.5"/> CSV
             </Button>
          </div>
        </div>

        {importMode !== 'none' && (
           <div className="mb-8 p-5 bg-slate-50 rounded-xl border-2 border-slate-200 animate-fade-in">
              <h3 className="text-base font-bold mb-3 text-slate-800">
                {importMode === 'ticket' ? t('part.import') : t('part.import_csv')}
              </h3>
              <TextArea 
                value={importText} 
                onChange={e => setImportText(e.target.value)} 
                placeholder={importMode === 'ticket' ? "Paste Base64 code here..." : "Name,Email,Group(optional)"}
                className="mb-4 bg-white"
                rows={3}
              />
              <div className="flex gap-3">
                <Button size="sm" onClick={handleImport}>Import Data</Button>
                <Button size="sm" variant="ghost" onClick={() => setImportMode('none')}>Cancel</Button>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-4">
             <Input placeholder={t('part.name')} value={newP.name || ''} onChange={e => setNewP({...newP, name: e.target.value})} />
          </div>
          <div className="lg:col-span-4">
             <Input placeholder={t('part.email')} value={newP.email || ''} onChange={e => setNewP({...newP, email: e.target.value})} />
          </div>
          <div className="lg:col-span-4">
             <Input placeholder={t('part.group')} value={newP.group || ''} onChange={e => setNewP({...newP, group: e.target.value})} />
          </div>
          <div className="lg:col-span-12">
             <Input placeholder={t('part.wish')} value={newP.wishlist || ''} onChange={e => setNewP({...newP, wishlist: e.target.value})} />
          </div>
          <div className="lg:col-span-12 pt-2">
            <Button fullWidth variant="secondary" onClick={addParticipant} disabled={!newP.name || !newP.email}>
              <Plus size={18} className="mr-2" /> {t('part.add')}
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
           <div className="flex items-center gap-2 text-red-800 font-bold">
              <Users size={18} />
              <span>{t('part.count')}: {participants.length}</span>
           </div>
           <div className="text-red-300">
              <Gift size={20} />
           </div>
        </div>
        <div className="divide-y divide-slate-50">
          {participants.length === 0 ? (
             <div className="p-12 text-center">
               <div className="text-slate-200 mb-4"><Users size={64} className="mx-auto"/></div>
               <p className="text-slate-400 text-lg font-medium">The list is currently empty.</p>
               <p className="text-slate-400 text-sm">Check it twice!</p>
             </div>
          ) : (
            participants.map((p) => (
              <div key={p.id} className="px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-red-50/30 transition-colors group gap-4">
                <div className="flex-1">
                   <div className="flex items-baseline gap-2">
                      <h3 className="font-bold text-slate-800 text-lg">{p.name}</h3>
                      <span className="text-sm text-slate-500">{p.email}</span>
                   </div>
                   
                   <div className="flex flex-wrap gap-2 mt-2">
                     {p.group && (
                       <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200 shadow-sm">
                         Group: {p.group}
                       </span>
                     )}
                     {p.department && (
                       <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium border border-slate-200">
                         {p.department}
                       </span>
                     )}
                     {p.wishlist && (
                       <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-100 italic">
                         "{p.wishlist}"
                       </span>
                     )}
                   </div>
                </div>
                <button 
                  onClick={() => removeParticipant(p.id)}
                  className="text-slate-300 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors self-end md:self-center"
                  title="Remove"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};