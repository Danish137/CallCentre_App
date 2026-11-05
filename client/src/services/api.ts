import {
  DashboardData,
  Lead,
  IncomingCall,
  RecentCall,
  CalendarEvent,
  PulseOverview,
  ChannelThread,
  PulseMessage,
  CallRecord,
  ProviderStatus,
} from '../types';

const API_BASE =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? window.location.port === '5173'
      ? 'http://localhost:5000/api'
      : '/api'
    : '/api';

export const api = {
  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  },

  // Leads & Planning
  async getLeads(): Promise<Lead[]> {
    const res = await fetch(`${API_BASE}/leads`);
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
  },

  async getLeadById(id: string): Promise<Lead> {
    const res = await fetch(`${API_BASE}/leads/${id}`);
    if (!res.ok) throw new Error('Failed to fetch lead details');
    return res.json();
  },

  async getIncomingCalls(): Promise<IncomingCall[]> {
    const res = await fetch(`${API_BASE}/leads/plan/incoming`);
    if (!res.ok) throw new Error('Failed to fetch incoming calls');
    return res.json();
  },

  async getRecentCalls(): Promise<RecentCall[]> {
    const res = await fetch(`${API_BASE}/leads/plan/recent`);
    if (!res.ok) throw new Error('Failed to fetch recent calls');
    return res.json();
  },

  // Calendar
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const res = await fetch(`${API_BASE}/calendar/events`);
    if (!res.ok) throw new Error('Failed to fetch calendar events');
    return res.json();
  },

  async addCalendarEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const res = await fetch(`${API_BASE}/calendar/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!res.ok) throw new Error('Failed to create calendar event');
    const data = await res.json();
    return data.event;
  },

  // Pulse
  async getPulseOverview(): Promise<PulseOverview> {
    const res = await fetch(`${API_BASE}/pulse/overview`);
    if (!res.ok) throw new Error('Failed to fetch pulse overview');
    return res.json();
  },

  async getChannelThread(channelId: string): Promise<ChannelThread> {
    const res = await fetch(`${API_BASE}/pulse/channels/${channelId}`);
    if (!res.ok) throw new Error(`Failed to fetch channel ${channelId}`);
    return res.json();
  },

  async sendChannelMessage(channelId: string, text: string, who = 'You'): Promise<PulseMessage> {
    const res = await fetch(`${API_BASE}/pulse/channels/${channelId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, who, isSelf: true }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    const data = await res.json();
    return data.message;
  },

  async respondPinnedCard(channelId: string, optionId: string, replyText?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/pulse/channels/${channelId}/pinned-card/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseOptionId: optionId, replyText }),
    });
    if (!res.ok) throw new Error('Failed to respond to pinned card');
    return res.json();
  },

  // Telephony
  async getTelephonyStatus(): Promise<ProviderStatus> {
    const res = await fetch(`${API_BASE}/telephony/status`);
    if (!res.ok) throw new Error('Failed to fetch telephony status');
    return res.json();
  },

  async switchTelephonyProvider(provider: 'twilio' | 'exotel' | 'dev'): Promise<void> {
    const res = await fetch(`${API_BASE}/telephony/provider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    });
    if (!res.ok) throw new Error('Failed to switch telephony provider');
  },

  async initiateCall(params: {
    customerPhone: string;
    leadName?: string;
    leadId?: string;
    agentPhone?: string;
  }): Promise<CallRecord> {
    const res = await fetch(`${API_BASE}/telephony/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to initiate call');
    }
    const data = await res.json();
    return data.call;
  },

  async endCall(callId: string, outcome?: string, notes?: string): Promise<CallRecord> {
    const res = await fetch(`${API_BASE}/telephony/call/${callId}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome, notes }),
    });
    if (!res.ok) throw new Error('Failed to end call');
    const data = await res.json();
    return data.call;
  },

  async getActiveCall(): Promise<CallRecord | null> {
    const res = await fetch(`${API_BASE}/telephony/active`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.activeCall;
  },

  async getCallHistory(): Promise<CallRecord[]> {
    const res = await fetch(`${API_BASE}/telephony/history`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.history || [];
  },

  // Telephony live SSE stream
  subscribeToTelephony(onMessage: (event: { type: string; data: any }) => void): () => void {
    const eventSource = new EventSource(`${API_BASE}/telephony/events`);

    eventSource.addEventListener('connected', (e: MessageEvent) => {
      try {
        onMessage({ type: 'connected', data: JSON.parse(e.data) });
      } catch (err) {
        console.error('SSE JSON error', err);
      }
    });

    eventSource.addEventListener('call:state', (e: MessageEvent) => {
      try {
        onMessage({ type: 'call:state', data: JSON.parse(e.data) });
      } catch (err) {
        console.error('SSE JSON error', err);
      }
    });

    eventSource.addEventListener('call:transcript', (e: MessageEvent) => {
      try {
        onMessage({ type: 'call:transcript', data: JSON.parse(e.data) });
      } catch (err) {
        console.error('SSE JSON error', err);
      }
    });

    eventSource.addEventListener('call:sentiment', (e: MessageEvent) => {
      try {
        onMessage({ type: 'call:sentiment', data: JSON.parse(e.data) });
      } catch (err) {
        console.error('SSE JSON error', err);
      }
    });

    eventSource.addEventListener('call:history', (e: MessageEvent) => {
      try {
        onMessage({ type: 'call:history', data: JSON.parse(e.data) });
      } catch (err) {
        console.error('SSE JSON error', err);
      }
    });

    return () => {
      eventSource.close();
    };
  },

  // AI Voice Calling & Net Practise
  async chatWithAiLead(
    message: string,
    history: Array<{ speaker: string; text: string }>,
    leadName?: string,
    modelInterest?: string
  ): Promise<{ reply: string; detectedSop: string | null }> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, leadName, modelInterest }),
    });
    if (!res.ok) throw new Error('AI Voice request failed');
    return res.json();
  },

  async evaluatePractiseStep(
    stepId: string,
    transcript: string,
    durationSeconds: number
  ): Promise<{ score: number; checkpoint: string; hits: string[]; feedback: string }> {
    const res = await fetch(`${API_BASE}/ai/evaluate-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, transcript, durationSeconds }),
    });
    if (!res.ok) throw new Error('Evaluation request failed');
    return res.json();
  },
};

