
import React, { useState, useEffect, useRef } from 'react';
import { I18nProvider, useTranslation } from './services/i18nContext';
import { ToastProvider, useToast } from './services/toastContext';
import { DEFAULT_EVENT, APP_VERSION } from './constants';
import { AppStep, DashboardTab } from './types';
import type { EventDetails, Participant, Pairing, Language, FullEventData } from './types';
import { StepCreate } from './components/StepCreate';
import { StepCreated } from './components/StepCreated';
import { StepSetup } from './components/StepSetup';
import { StepParticipants } from './components/StepParticipants';
import { StepDraw } from './components/StepDraw';
import { StepShare } from './components/StepShare';
import { JoinView } from './components/JoinView';
import { Gift, Settings, Users, Wand2, Share2, Cloud, CloudOff, Loader2, HardDrive, Smartphone } from 'lucide-react';
import { api } from './services/api';

const SecretSantaApp: React.FC = () => {
  const { t, locale, setLocale } = useTranslation();
  const { showToast } = useToast();
  
  // State for App View
  const [appView, setAppView] = useState<AppStep>(AppStep.CREATE);
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>(DashboardTab.PARTICIPANTS);
  const [isJoinMode, setIsJoinMode] = useState(false);

  // Data State
  const [eventDetails, setEventDetails] = useState<EventDetails>(DEFAULT_EVENT);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [pairings, setPairings] = useState<Pairing[]>([]);

  // API Status State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'local' | 'error'>('idle');
  const [storageMode, setStorageMode] = useState<'server' | 'local'>('server');
  
  // Refs for Debouncing
  const saveTimeoutRef = useRef<number | undefined>(undefined);

  // Load Event from URL
  useEffect(() => {
    const checkUrl = async () => {
      // Check for Join Mode
      if (window.location.hash === '#join') {
        setIsJoinMode(true);
        setIsLoading(false);
        return;
      }

      // Check for Management ID
      const params = new URLSearchParams(window.location.search);
      const manageId = params.get('manage');

      if (manageId) {
        setIsLoading(true);
        const data = await api.get(manageId);
        
        if (data) {
          setEventDetails(data.details);
          setParticipants(data.participants);
          setPairings(data.pairings);
          setAppView(AppStep.DASHBOARD);
          // If we loaded successfully but api.get had to fallback to local, we won't know 
          // until we save, but that's acceptable. We assume if we loaded, we are good.
        } else {
          showToast("Event not found or expired.", "error");
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    checkUrl();
    window.addEventListener('hashchange', checkUrl);
    return () => window.removeEventListener('hashchange', checkUrl);
  }, []);

  // Persistence Helper with Debounce
  const saveEvent = (details: EventDetails, parts: Participant[], pairs: Pairing[]) => {
    if (!details.id) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Save after 1 second of inactivity
    saveTimeoutRef.current = window.setTimeout(async () => {
      const data: FullEventData = { details, participants: parts, pairings: pairs };
      const result = await api.save(data);
      
      setIsSaving(false);
      setStorageMode(result.mode);

      if (result.success) {
        setSaveStatus(result.mode === 'local' ? 'local' : 'saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        showToast("Failed to save changes.", "error");
      }
    }, 1000);
  };

  // Wrappers to auto-save on change
  const handleCreate = (details: EventDetails) => {
    setEventDetails(details);
    // Immediate save on create
    api.save({ details, participants: [], pairings: [] }).then(result => {
      setStorageMode(result.mode);
      if(result.success) {
        showToast(result.mode === 'local' ? "Event saved locally!" : "Event created successfully!", "success");
      } else {
        showToast("Could not save event.", "error");
      }
    });
    setAppView(AppStep.CREATED);
  };

  const updateDetails = (d: EventDetails) => {
    setEventDetails(d);
    saveEvent(d, participants, pairings);
  };

  const updateParticipants = (p: React.SetStateAction<Participant[]>) => {
    const newVal = typeof p === 'function' ? p(participants) : p;
    setParticipants(newVal);
    saveEvent(eventDetails, newVal, pairings);
  };

  const updatePairings = (p: Pairing[]) => {
    setPairings(p);
    saveEvent(eventDetails, participants, p);
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-festive">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
           <div className="w-12 h-12 border-4 border-red-200 border-t-red-700 rounded-full animate-spin"></div>
           <p className="text-red-800 font-bold animate-pulse">Loading Event...</p>
        </div>
      </div>
    );
  }

  if (isJoinMode) {
    return (
      <div className="relative min-h-screen bg-festive">
        <div className="absolute top-4 right-4 z-50">
           <LanguageSwitcher current={locale} set={setLocale} />
        </div>
        <JoinView />
        <div className="absolute bottom-2 right-2 text-red-900/10 text-[10px] pointer-events-none">v{APP_VERSION}</div>
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (dashboardTab) {
      case DashboardTab.SETUP:
        return <StepSetup details={eventDetails} setDetails={updateDetails} />;
      case DashboardTab.PARTICIPANTS:
        return <StepParticipants participants={participants} setParticipants={updateParticipants} />;
      case DashboardTab.DRAW:
        return <StepDraw participants={participants} setPairings={updatePairings} onComplete={() => setDashboardTab(DashboardTab.SHARE)} />;
      case DashboardTab.SHARE:
        return <StepShare pairings={pairings} eventDetails={eventDetails} />;
      default:
        return null;
    }
  };

  const navItemClass = (tab: DashboardTab) => 
    `flex flex-col md:flex-row items-center px-4 py-2 rounded-full transition-all duration-200 border ${
      dashboardTab === tab 
        ? 'bg-white text-red-800 font-bold shadow-md border-red-100' 
        : 'text-red-100 hover:bg-red-800 hover:text-white border-transparent'
    }`;
    
  const mobileNavItemClass = (tab: DashboardTab) => 
    `flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-200 ${
        dashboardTab === tab 
        ? 'bg-red-50 text-red-800 font-bold' 
        : 'text-slate-500 hover:bg-slate-50'
    }`;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${appView === AppStep.CREATE ? 'bg-[#FDFCF8]' : 'bg-festive'}`}>
      {/* Header - Hidden during Create Step for immersive feel */}
      {appView !== AppStep.CREATE && (
        <header className="bg-gradient-to-r from-red-800 to-red-700 text-white shadow-lg sticky top-0 z-30 border-b-4 border-emerald-700 animate-fade-in">
          <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
              <div className="bg-white text-red-700 p-2 rounded-full shadow-inner">
                <Gift className="w-6 h-6" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="hidden md:inline text-lg">{t('app.title')}</span>
                <span className="md:hidden">Secret Santa</span>
                <span className="text-[10px] font-medium text-red-200 uppercase tracking-widest opacity-80">Holiday Edition</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Save Status Indicator */}
               {appView === AppStep.DASHBOARD && (
                  <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-black/20 text-xs font-medium transition-all ${saveStatus === 'local' ? 'text-amber-200 bg-amber-900/40' : ''}`}>
                     {isSaving ? (
                       <>
                         <Loader2 size={14} className="animate-spin"/> Saving...
                       </>
                     ) : saveStatus === 'saved' ? (
                       <>
                         <Cloud size={14} className="text-emerald-300"/> Saved
                       </>
                     ) : saveStatus === 'local' ? (
                        <>
                          <Smartphone size={14} className="text-amber-300"/> Saved (Device)
                        </>
                     ) : saveStatus === 'error' ? (
                       <>
                         <CloudOff size={14} className="text-red-300"/> Offline
                       </>
                     ) : (
                       <>
                         {storageMode === 'local' ? <Smartphone size={14} className="opacity-50 text-amber-200"/> : <HardDrive size={14} className="opacity-50"/>}
                         <span className="opacity-80">Ready</span>
                       </>
                     )}
                  </div>
               )}

               {/* Desktop Nav */}
               {appView === AppStep.DASHBOARD && (
                 <nav className="hidden md:flex gap-1 bg-red-900/30 p-1 rounded-full">
                   <button onClick={() => setDashboardTab(DashboardTab.SETUP)} className={navItemClass(DashboardTab.SETUP)}>
                     <Settings size={16} className="md:mr-2" /> {t('nav.setup')}
                   </button>
                   <button onClick={() => setDashboardTab(DashboardTab.PARTICIPANTS)} className={navItemClass(DashboardTab.PARTICIPANTS)}>
                     <Users size={16} className="md:mr-2" /> {t('nav.participants')}
                   </button>
                   <button onClick={() => setDashboardTab(DashboardTab.DRAW)} className={navItemClass(DashboardTab.DRAW)}>
                     <Wand2 size={16} className="md:mr-2" /> {t('nav.draw')}
                   </button>
                   <button 
                      onClick={() => setDashboardTab(DashboardTab.SHARE)} 
                      className={navItemClass(DashboardTab.SHARE)}
                      disabled={pairings.length === 0}
                   >
                     <Share2 size={16} className="md:mr-2" /> {t('nav.share')}
                   </button>
                 </nav>
               )}
               
               <LanguageSwitcher current={locale} set={setLocale} />
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 w-full mx-auto ${appView === AppStep.CREATE ? 'max-w-4xl p-6 flex flex-col justify-center' : 'max-w-5xl p-4 pb-28 md:pb-12 mt-4 md:mt-8'}`}>
        {appView === AppStep.CREATE && <StepCreate onCreate={handleCreate} />}
        {appView === AppStep.CREATED && <StepCreated details={eventDetails} onContinue={() => setAppView(AppStep.DASHBOARD)} isLocal={storageMode === 'local'} />}
        {appView === AppStep.DASHBOARD && renderDashboardContent()}
      </main>
      
      {/* Version Footer */}
      <div className="py-2 text-center text-red-900/10 text-[10px] font-mono pointer-events-none">
        v{APP_VERSION}
      </div>

      {/* Mobile Bottom Nav (Only in Dashboard) */}
      {appView === AppStep.DASHBOARD && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-3 py-3 flex justify-between items-center z-40 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
           <button onClick={() => setDashboardTab(DashboardTab.SETUP)} className={mobileNavItemClass(DashboardTab.SETUP)}>
              <Settings size={20} />
              <span className="text-[10px] mt-1">{t('nav.setup')}</span>
           </button>
           <button onClick={() => setDashboardTab(DashboardTab.PARTICIPANTS)} className={mobileNavItemClass(DashboardTab.PARTICIPANTS)}>
              <Users size={20} />
              <span className="text-[10px] mt-1">People</span>
           </button>
           <button onClick={() => setDashboardTab(DashboardTab.DRAW)} className={mobileNavItemClass(DashboardTab.DRAW)}>
              <Wand2 size={20} />
              <span className="text-[10px] mt-1">{t('nav.draw')}</span>
           </button>
           <button 
             onClick={() => setDashboardTab(DashboardTab.SHARE)} 
             className={`${mobileNavItemClass(DashboardTab.SHARE)} ${pairings.length === 0 ? 'opacity-40' : ''}`}
             disabled={pairings.length === 0}
           >
              <Share2 size={20} />
              <span className="text-[10px] mt-1">{t('nav.share')}</span>
           </button>
        </div>
      )}
    </div>
  );
};

const LanguageSwitcher: React.FC<{current: Language, set: (l: Language) => void}> = ({ current, set }) => {
  return (
    <div className="flex gap-1 bg-white/10 p-1 rounded-lg border border-white/20 backdrop-blur-sm">
      {(['en', 'fr', 'es'] as Language[]).map(lang => (
        <button
          key={lang}
          onClick={() => set(lang)}
          className={`px-2 py-0.5 text-xs font-bold rounded-md uppercase transition-all ${
            current === lang 
            ? 'bg-white shadow text-red-700' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

const AppWrapper = () => (
  <I18nProvider>
    <ToastProvider>
      <SecretSantaApp />
    </ToastProvider>
  </I18nProvider>
);

export default AppWrapper;
