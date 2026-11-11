import { Response } from 'express';
import { ITelephonyProvider, CallRecord, CallStatus, InitiateCallParams, ProviderStatus } from './types.js';
import { TwilioProvider } from './twilioProvider.js';
import { ExotelProvider } from './exotelProvider.js';
import { DevProvider } from './devProvider.js';
import { getISTTime } from '../utils/time.js';

export class TelephonyManager {
  private activeProvider: ITelephonyProvider;
  private twilioProvider: TwilioProvider;
  private exotelProvider: ExotelProvider;
  private devProvider: DevProvider;

  private activeCalls: Map<string, CallRecord> = new Map();
  private callHistory: CallRecord[] = [];
  private sseClients: Set<Response> = new Set();
  private transcriptTimers: Map<string, NodeJS.Timeout[]> = new Map();
  private statusPollers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.twilioProvider = new TwilioProvider();
    this.exotelProvider = new ExotelProvider();
    this.devProvider = new DevProvider((callId, status, extra) => {
      this.updateCallStatus(callId, status, extra);
    });

    // Determine initial active provider
    const requested = (process.env.TELEPHONY_PROVIDER || '').toLowerCase();
    if (requested === 'twilio' && this.twilioProvider.isConfigured()) {
      this.activeProvider = this.twilioProvider;
    } else if (requested === 'exotel' && this.exotelProvider.isConfigured()) {
      this.activeProvider = this.exotelProvider;
    } else if (this.twilioProvider.isConfigured()) {
      this.activeProvider = this.twilioProvider;
    } else if (this.exotelProvider.isConfigured()) {
      this.activeProvider = this.exotelProvider;
    } else {
      this.activeProvider = this.devProvider;
    }

    this.seedCallHistory();
  }

  private seedCallHistory() {
    this.callHistory = [
      {
        id: 'call_rec_1',
        provider: 'dev',
        agentPhone: '+919876543210',
        customerPhone: '+919876543210',
        leadName: 'Mukunda R.',
        status: 'completed',
        startedAt: 'Today 10:42 AM',
        endedAt: 'Today 10:46 AM',
        durationSeconds: 252,
        sentiment: 'Positive',
        sentimentScore: 82,
        outcome: 'Interested',
        notes: 'Enquired about Ortho GRID 12-month EMI. Shared quote.',
        isRealCall: false,
      },
      {
        id: 'call_rec_2',
        provider: 'dev',
        agentPhone: '+919876543210',
        customerPhone: '+919765432109',
        leadName: 'Kavitha R.',
        status: 'completed',
        startedAt: 'Yesterday 3:15 PM',
        endedAt: 'Yesterday 3:17 PM',
        durationSeconds: 125,
        sentiment: 'Neutral',
        sentimentScore: 64,
        outcome: 'Follow-up needed',
        notes: 'Needs store visit slot for RT Nagar store.',
        isRealCall: false,
      },
      {
        id: 'call_rec_3',
        provider: 'dev',
        agentPhone: '+919876543210',
        customerPhone: '+919845012345',
        leadName: 'Ritu S.',
        status: 'completed',
        startedAt: 'Mon 11:20 AM',
        endedAt: 'Mon 11:26 AM',
        durationSeconds: 380,
        sentiment: 'Positive',
        sentimentScore: 92,
        outcome: 'Resolved',
        notes: 'Confirmed delivery address and 100-night trial.',
        isRealCall: false,
      },
      {
        id: 'call_rec_4',
        provider: 'dev',
        agentPhone: '+919876543210',
        customerPhone: '+919000011122',
        leadName: 'Faizan A.',
        status: 'completed',
        startedAt: 'Mon 2:10 PM',
        endedAt: 'Mon 2:16 PM',
        durationSeconds: 400,
        sentiment: 'Positive',
        sentimentScore: 86,
        outcome: 'Interested',
        notes: 'Looking for Queen size mattress with back support.',
        isRealCall: false,
      },
    ];
  }

  getProviderStatus(): ProviderStatus & { allProviders: Record<string, ProviderStatus> } {
    const twilioStatus = this.twilioProvider.getStatus();
    const exotelStatus = this.exotelProvider.getStatus();
    const devStatus = this.devProvider.getStatus();

    return {
      ...this.activeProvider.getStatus(),
      configuredAgentPhone: process.env.DEFAULT_AGENT_PHONE || null,
      configuredAgentName: process.env.DEFAULT_AGENT_NAME || 'Arvind Rajan',
      allProviders: {
        twilio: twilioStatus,
        exotel: exotelStatus,
        dev: devStatus,
      },
    };
  }

  setProvider(providerName: 'twilio' | 'exotel' | 'dev') {
    if (providerName === 'twilio') {
      this.activeProvider = this.twilioProvider;
    } else if (providerName === 'exotel') {
      this.activeProvider = this.exotelProvider;
    } else {
      this.activeProvider = this.devProvider;
    }
  }

  // SSE client management
  addSseClient(res: Response) {
    this.sseClients.add(res);
    res.on('close', () => {
      this.sseClients.delete(res);
    });
  }

  broadcast(eventType: string, data: any) {
    const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.sseClients) {
      try {
        client.write(payload);
      } catch (err) {
        this.sseClients.delete(client);
      }
    }
  }

  async initiateCall(params: InitiateCallParams): Promise<CallRecord> {
    const isReal = this.activeProvider.getStatus().isRealTelephony;
    const resolvedAgentPhone = params.agentPhone || process.env.DEFAULT_AGENT_PHONE || (isReal ? '' : '+919876543210');

    if (isReal && !resolvedAgentPhone) {
      throw new Error(
        'Agent phone number not configured. Please set DEFAULT_AGENT_PHONE in your .env file or pass agentPhone.'
      );
    }

    const callId = `call_${Date.now()}`;
    const callRecord: CallRecord = {
      id: callId,
      provider: this.activeProvider.name,
      agentPhone: resolvedAgentPhone,
      customerPhone: params.customerPhone,
      leadName: params.leadName || 'Customer',
      status: 'initiating',
      startedAt: getISTTime(),
      isRealCall: isReal,
      sentiment: 'Positive',
      sentimentScore: 70,
    };

    this.activeCalls.set(callId, callRecord);
    this.broadcast('call:state', callRecord);

    try {
      const res = await this.activeProvider.initiateCall(
        {
          ...params,
          agentPhone: callRecord.agentPhone,
        },
        callRecord
      );

      callRecord.providerCallId = res.providerCallId;
      callRecord.status = res.status;
      this.activeCalls.set(callId, callRecord);
      this.broadcast('call:state', callRecord);

      // If dev provider, simulate realistic transcript streaming
      if (this.activeProvider.name === 'dev') {
        this.startSimulatedTranscript(callId, params.leadName || 'Customer');
      } else if (this.activeProvider.name === 'exotel' && res.providerCallId) {
        this.startExotelStatusPoller(callId, res.providerCallId);
      }

      return callRecord;
    } catch (err: any) {
      callRecord.status = 'failed';
      callRecord.error = err.message || 'Call initialization failed';
      this.activeCalls.set(callId, callRecord);
      this.broadcast('call:state', callRecord);
      throw err;
    }
  }

  updateCallStatus(callId: string, status: CallStatus, extra: any = {}) {
    const call = this.activeCalls.get(callId);
    if (!call) return;

    call.status = status;
    if (extra.connectedAt) call.connectedAt = extra.connectedAt;
    if (extra.sentiment) call.sentiment = extra.sentiment;
    if (extra.sentimentScore) call.sentimentScore = extra.sentimentScore;
    if (extra.duration !== undefined && extra.duration > 0) {
      call.durationSeconds = extra.duration;
    }

    this.activeCalls.set(callId, call);
    this.broadcast('call:state', { ...call, ...extra });

    if (status === 'completed' || status === 'busy' || status === 'no-answer' || status === 'failed') {
      this.stopSimulatedTranscript(callId);
      this.stopExotelStatusPoller(callId);
      call.endedAt = getISTTime();
      if (!call.durationSeconds && call.connectedAt) {
        const elapsed = Math.round((Date.now() - new Date(call.connectedAt).getTime()) / 1000);
        if (elapsed > 0) call.durationSeconds = elapsed;
      }
      this.activeCalls.delete(callId);
      this.callHistory.unshift({ ...call });
      this.broadcast('call:history', this.callHistory);
    }
  }

  async endCall(callId: string, outcome?: string, notes?: string): Promise<CallRecord | null> {
    const call = this.activeCalls.get(callId);
    if (!call) return null;

    this.stopSimulatedTranscript(callId);
    this.stopExotelStatusPoller(callId);

    const providerCallId = call.providerCallId;

    if (providerCallId) {
      await this.activeProvider.terminateCall(providerCallId);
      if (call.provider === 'exotel') {
        try {
          const details = await this.exotelProvider.getCallDetails(providerCallId);
          if (details?.duration !== undefined && details.duration > 0) {
            call.durationSeconds = details.duration;
          }
        } catch (e) {}

        // Schedule delayed pollers at 1.5s and 3.5s to capture Exotel's finalized CDR Duration
        const targetId = call.id;
        [1500, 3500].forEach((delay) => {
          setTimeout(async () => {
            try {
              const finalDetails = await this.exotelProvider.getCallDetails(providerCallId);
              if (finalDetails && finalDetails.duration !== undefined && finalDetails.duration > 0) {
                const histCall = this.callHistory.find((c) => c.id === targetId || c.providerCallId === providerCallId);
                if (histCall && histCall.durationSeconds !== finalDetails.duration) {
                  histCall.durationSeconds = finalDetails.duration;
                  this.broadcast('call:history', this.callHistory);
                }
              }
            } catch (err) {}
          }, delay);
        });
      }
    }

    call.status = 'completed';
    call.endedAt = getISTTime();
    if (!call.durationSeconds && call.connectedAt) {
      const elapsed = Math.round((Date.now() - new Date(call.connectedAt).getTime()) / 1000);
      if (elapsed > 0) call.durationSeconds = elapsed;
    }
    if (outcome) call.outcome = outcome;
    if (notes) call.notes = notes;

    this.activeCalls.delete(callId);
    this.callHistory.unshift({ ...call });

    this.broadcast('call:state', { ...call, status: 'completed' });
    this.broadcast('call:history', this.callHistory);

    return call;
  }

  getActiveCall(): CallRecord | null {
    // Return most recent active call
    const active = Array.from(this.activeCalls.values());
    return active.length > 0 ? active[active.length - 1] : null;
  }

  getCallHistory(): CallRecord[] {
    return this.callHistory;
  }

  // Simulated live conversational transcript helper
  private startSimulatedTranscript(callId: string, leadName: string) {
    const transcriptLines = [
      { delay: 4500, who: 'agent', text: `Namaste! This is Arvind from The Sleep Company, calling about the enquiry you made on the Ortho GRID — is now an okay time?`, sop: 'Opening & Intent Confirm' },
      { delay: 7500, who: 'customer', text: `Yes, go ahead. I was actually comparing it with another brand.`, sentiment: 'Neutral', score: 65 },
      { delay: 11000, who: 'agent', text: `Totally fair — can I ask what mattered most in that comparison, firmness or price?`, sop: 'Needs Discovery' },
      { delay: 15000, who: 'customer', text: `Mostly price, but also whether it actually helps with lower back pain.`, sentiment: 'Positive', score: 80 },
      { delay: 19000, who: 'agent', text: `The GRID layer is built exactly for that — spinal alignment and pressure relief. Plus we have a 12-month 0% interest EMI plan at ₹708/mo!`, sop: 'Product Pitch & EMI' },
      { delay: 24000, who: 'customer', text: `That zero interest EMI sounds great. Does it include the 10-year warranty?`, sentiment: 'Positive', score: 92 },
      { delay: 28000, who: 'agent', text: `Yes, full 10-year warranty plus 100-night home trial! I can send you the direct checkout link right away.`, sop: 'Warranty Mention & Closing' },
    ];

    const timers: NodeJS.Timeout[] = [];
    transcriptLines.forEach((item) => {
      const t = setTimeout(() => {
        if (!this.activeCalls.has(callId)) return;
        this.broadcast('call:transcript', {
          callId,
          speaker: item.who,
          text: item.text,
          sop: item.sop,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' }),
        });
        if (item.sentiment && item.score) {
          const call = this.activeCalls.get(callId);
          if (call) {
            call.sentiment = item.sentiment as any;
            call.sentimentScore = item.score;
            this.broadcast('call:sentiment', {
              callId,
              sentiment: item.sentiment,
              score: item.score,
            });
          }
        }
      }, item.delay);
      timers.push(t);
    });

    this.transcriptTimers.set(callId, timers);
  }

  private stopSimulatedTranscript(callId: string) {
    const timers = this.transcriptTimers.get(callId);
    if (timers) {
      timers.forEach((t) => clearTimeout(t));
      this.transcriptTimers.delete(callId);
    }
  }

  private startExotelStatusPoller(callId: string, providerCallId: string) {
    this.stopExotelStatusPoller(callId);

    const startTime = Date.now();
    const interval = setInterval(async () => {
      // Safety limit: stop polling after 15 minutes or if call was deleted
      if (Date.now() - startTime > 15 * 60 * 1000 || !this.activeCalls.has(callId)) {
        this.stopExotelStatusPoller(callId);
        return;
      }

      const details = await this.exotelProvider.getCallDetails(providerCallId);
      if (!details) return;

      const call = this.activeCalls.get(callId);
      if (!call) {
        this.stopExotelStatusPoller(callId);
        return;
      }

      // Check if call transitioned from initiating/ringing to connected in-progress
      if (details.status === 'in-progress' && call.status !== 'in-progress') {
        console.log(`[Exotel Poller] Call ${callId} transitioned to in-progress`);
        this.updateCallStatus(callId, 'in-progress', {
          connectedAt: new Date().toISOString(),
        });
      } else if (
        details.status === 'completed' ||
        details.status === 'busy' ||
        details.status === 'no-answer' ||
        details.status === 'failed'
      ) {
        console.log(`[Exotel Poller] Call ${callId} ended with status: ${details.status}, duration: ${details.duration}`);
        this.stopExotelStatusPoller(callId);
        this.updateCallStatus(callId, details.status, {
          duration: details.duration,
        });
      }
    }, 1500);

    this.statusPollers.set(callId, interval);
  }

  private stopExotelStatusPoller(callId: string) {
    const timer = this.statusPollers.get(callId);
    if (timer) {
      clearInterval(timer);
      this.statusPollers.delete(callId);
    }
  }

  async handleProviderWebhook(provider: string, payload: any) {
    let update = null;
    if (provider === 'twilio') {
      update = await this.twilioProvider.handleWebhook(payload);
    } else if (provider === 'exotel') {
      update = await this.exotelProvider.handleWebhook(payload);
    }

    if (update) {
      let targetCall: CallRecord | undefined;
      if (update.callId && this.activeCalls.has(update.callId)) {
        targetCall = this.activeCalls.get(update.callId);
      }
      if (!targetCall && update.providerCallId) {
        for (const call of this.activeCalls.values()) {
          if (call.providerCallId === update.providerCallId) {
            targetCall = call;
            break;
          }
        }
      }

      if (targetCall) {
        this.updateCallStatus(targetCall.id, update.status, {
          duration: update.duration,
          connectedAt: update.status === 'in-progress' ? (targetCall.connectedAt || new Date().toISOString()) : undefined,
        });
      } else if (update.providerCallId || update.callId) {
        // If the call was already archived into callHistory, update true carrier duration and status
        const histCall = this.callHistory.find(
          (c) => c.providerCallId === update.providerCallId || (update.callId && c.id === update.callId)
        );
        if (histCall) {
          let updated = false;
          if (update.duration !== undefined && update.duration > 0) {
            histCall.durationSeconds = update.duration;
            updated = true;
          }
          if (update.status && histCall.status !== update.status) {
            histCall.status = update.status;
            updated = true;
          }
          if (updated) {
            this.broadcast('call:history', this.callHistory);
          }
        }
      }
    }
  }
}

