import React, { useState, useEffect } from 'react';
import { Layout } from './components/Shell/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Plan } from './components/Plan/Plan';
import { CalendarView } from './components/Calendar/CalendarView';
import { PulseHome } from './components/Pulse/PulseHome';
import { PulseChannel } from './components/Pulse/PulseChannel';
import { ActiveCallBanner } from './components/Calling/ActiveCallBanner';
import { PreCallSopModal } from './components/Calling/PreCallSopModal';
import { CallWrapupModal } from './components/Calling/CallWrapupModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { LeadsModal } from './components/LeadsModal/LeadsModal';
import { api } from './services/api';
import {
  NavigationTab,
  PlanSubTab,
  DashboardData,
  Lead,
  IncomingCall,
  RecentCall,
  CalendarEvent,
  PulseOverview,
  ChannelThread,
  CallRecord,
  ProviderStatus,
} from './types';
import './styles/theme.css';

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dash');
  const [planSubTab, setPlanSubTab] = useState<PlanSubTab>('outgoing');
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);

  // Application Data State
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [incomingCalls, setIncomingCalls] = useState<IncomingCall[]>([]);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [pulseOverview, setPulseOverview] = useState<PulseOverview | null>(null);
  const [channelThread, setChannelThread] = useState<ChannelThread | null>(null);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);

  // Telephony Live Calling State
  const [activeCall, setActiveCall] = useState<CallRecord | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<
    Array<{ speaker: string; text: string; time: string; sop?: string }>
  >([]);

  // Modals State
  const [preCallLead, setPreCallLead] = useState<Lead | null>(null);
  const [wrapupCall, setWrapupCall] = useState<CallRecord | null>(null);
  const [leadsModalIndex, setLeadsModalIndex] = useState<number | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Initial Data Fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [dash, lds, inc, rec, cal, pulse, telStatus, actCall] = await Promise.all([
          api.getDashboard().catch(() => null),
          api.getLeads().catch(() => []),
          api.getIncomingCalls().catch(() => []),
          api.getRecentCalls().catch(() => []),
          api.getCalendarEvents().catch(() => []),
          api.getPulseOverview().catch(() => null),
          api.getTelephonyStatus().catch(() => null),
          api.getActiveCall().catch(() => null),
        ]);

        if (dash) setDashboardData(dash);
        if (lds.length) setLeads(lds);
        if (inc.length) setIncomingCalls(inc);
        if (rec.length) setRecentCalls(rec);
        if (cal.length) setCalendarEvents(cal);
        if (pulse) setPulseOverview(pulse);
        if (telStatus) setProviderStatus(telStatus);
        if (actCall) setActiveCall(actCall);
      } catch (err) {
        console.error('Initial data fetch error:', err);
      }
    };

    loadInitialData();
  }, []);

  // Subscribe to live SSE Telephony events
  useEffect(() => {
    const unsubscribe = api.subscribeToTelephony((event) => {
      if (event.type === 'connected') {
        if (event.data?.providerStatus) setProviderStatus(event.data.providerStatus);
        if (event.data?.activeCall) setActiveCall(event.data.activeCall);
        if (event.data?.history) {
          api.getRecentCalls().then(setRecentCalls);
        }
      } else if (event.type === 'call:state') {
        const call: CallRecord = event.data;
        if (call.status === 'completed') {
          setActiveCall(null);
          setLiveTranscript([]);
          setWrapupCall(call);
          api.getRecentCalls().then(setRecentCalls);
        } else if (call.status === 'failed' || call.status === 'busy' || call.status === 'no-answer') {
          setActiveCall(call);
          setLiveTranscript([]);
          setTimeout(() => {
            setActiveCall((curr) => (curr?.id === call.id ? null : curr));
            api.getRecentCalls().then(setRecentCalls);
          }, 2400);
        } else {
          setActiveCall(call);
        }
      } else if (event.type === 'call:transcript') {
        setLiveTranscript((prev) => [...prev, event.data]);
      } else if (event.type === 'call:sentiment') {
        setActiveCall((prev) => (prev ? { ...prev, sentiment: event.data.sentiment, sentimentScore: event.data.score } : null));
      } else if (event.type === 'call:history') {
        api.getRecentCalls().then(setRecentCalls);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch thread when activeChannelId changes
  useEffect(() => {
    if (activeChannelId) {
      api.getChannelThread(activeChannelId).then(setChannelThread).catch(console.error);
    } else {
      setChannelThread(null);
    }
  }, [activeChannelId]);

  // Telephony Outbound Actions
  const handleInitiateCall = (lead: Lead) => {
    setPreCallLead(lead);
  };

  const handleConfirmPreCall = async () => {
    if (!preCallLead) return;
    const targetLead = preCallLead;
    setPreCallLead(null);

    try {
      setLiveTranscript([]);
      const newCall = await api.initiateCall({
        customerPhone: targetLead.phone,
        leadName: targetLead.name,
        leadId: targetLead.id,
      });
      setActiveCall(newCall);
    } catch (err: any) {
      alert(`Could not place call: ${err.message}`);
    }
  };

  const handleInitiateDirectCall = async (phone: string, name: string) => {
    try {
      setLiveTranscript([]);
      const newCall = await api.initiateCall({
        customerPhone: phone,
        leadName: name,
      });
      setActiveCall(newCall);
    } catch (err: any) {
      alert(`Could not place call: ${err.message}`);
    }
  };

  const handleEndCall = async (callId: string) => {
    try {
      const ended = await api.endCall(callId);
      setActiveCall(null);
      setLiveTranscript([]);
      setWrapupCall(ended);
    } catch (err: any) {
      console.error('End call error:', err);
    }
  };

  const handleSaveWrapup = async (outcome: string, notes: string) => {
    if (wrapupCall) {
      await api.endCall(wrapupCall.id, outcome, notes);
      setWrapupCall(null);
      const rec = await api.getRecentCalls();
      setRecentCalls(rec);
    }
  };

  const handleSwitchProvider = async (provider: 'twilio' | 'exotel' | 'dev') => {
    try {
      await api.switchTelephonyProvider(provider);
      const updated = await api.getTelephonyStatus();
      setProviderStatus(updated);
    } catch (err: any) {
      alert(`Provider switch failed: ${err.message}`);
    }
  };

  // Pulse channel interactions
  const handleSendMessage = async (text: string) => {
    if (!activeChannelId) return;
    const msg = await api.sendChannelMessage(activeChannelId, text);
    setChannelThread((prev) => (prev ? { ...prev, messages: [...prev.messages, msg] } : null));

    if (activeChannelId === 'avani-coaching') {
      setTimeout(() => {
        api.getChannelThread(activeChannelId).then(setChannelThread);
      }, 1400);
    }
  };

  const handleRespondPinnedCard = async (optionId: string, replyText?: string) => {
    if (!activeChannelId) return;
    const res = await api.respondPinnedCard(activeChannelId, optionId, replyText);
    if (res.pinnedCard) {
      const updatedThread = await api.getChannelThread(activeChannelId);
      setChannelThread(updatedThread);
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      planSubTab={planSubTab}
      onSelectTab={(tab) => {
        setActiveTab(tab);
        if (tab === 'pulse') setActiveChannelId(null);
      }}
      onSelectPlanSubTab={(sub) => {
        setActiveTab('calls');
        setPlanSubTab(sub);
      }}
      onOpenSettingsModal={() => setShowSettingsModal(true)}
      inQueueCount={dashboardData?.whoIsWaiting.length || 2}
      missedCallsCount={incomingCalls.length}
    >
      {/* Real-time active call banner when call is in progress */}
      {activeCall && (
        <ActiveCallBanner
          activeCall={activeCall}
          onEndCall={handleEndCall}
          liveTranscript={liveTranscript}
        />
      )}

      {/* View routing */}
      {activeTab === 'dash' && dashboardData && (
        <Dashboard
          data={dashboardData}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'pulse') setActiveChannelId(null);
          }}
          onOpenLeadsModal={(idx = 0) => setLeadsModalIndex(idx)}
          onInitiateCall={handleInitiateDirectCall}
        />
      )}

      {activeTab === 'calls' && (
        <Plan
          activeSubTab={planSubTab}
          onSelectSubTab={setPlanSubTab}
          leads={leads}
          incomingCalls={incomingCalls}
          recentCalls={recentCalls}
          onOpenLeadModal={(idx) => setLeadsModalIndex(idx)}
          onInitiateCall={handleInitiateCall}
          onInitiateCallback={(c) => handleInitiateDirectCall(c.phone, c.name)}
        />
      )}

      {activeTab === 'calendar' && (
        <CalendarView
          events={calendarEvents}
          onAddEvent={(ev) => api.addCalendarEvent(ev).then(() => api.getCalendarEvents().then(setCalendarEvents))}
        />
      )}

      {activeTab === 'pulse' && (
        <>
          {activeChannelId && channelThread ? (
            <PulseChannel
              channelId={activeChannelId}
              thread={channelThread}
              onBack={() => setActiveChannelId(null)}
              onSendMessage={handleSendMessage}
              onRespondPinned={handleRespondPinnedCard}
            />
          ) : (
            pulseOverview && (
              <PulseHome
                overview={pulseOverview}
                onOpenChannel={(chId) => setActiveChannelId(chId)}
              />
            )
          )}
        </>
      )}

      {/* Pre-Call SOP Checklist Modal */}
      {preCallLead && (
        <PreCallSopModal
          lead={preCallLead}
          providerStatus={providerStatus}
          onConfirmCall={handleConfirmPreCall}
          onClose={() => setPreCallLead(null)}
        />
      )}

      {/* Call Wrap-up Modal */}
      {wrapupCall && (
        <CallWrapupModal
          callId={wrapupCall.id}
          customerName={wrapupCall.leadName}
          onSave={handleSaveWrapup}
        />
      )}

      {/* Leads Profile & ICP Modal */}
      {leadsModalIndex !== null && (
        <LeadsModal
          leads={leads}
          currentIndex={leadsModalIndex}
          onNavigateIndex={setLeadsModalIndex}
          onInitiateCall={handleInitiateCall}
          onClose={() => setLeadsModalIndex(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </Layout>
  );
};

export default App;
