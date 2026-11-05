import { ITelephonyProvider, InitiateCallParams, CallRecord, CallStatus, ProviderStatus } from './types.js';

export class DevProvider implements ITelephonyProvider {
  name: 'dev' = 'dev';
  private timers: Map<string, NodeJS.Timeout[]> = new Map();
  private onStatusUpdate?: (callId: string, status: CallStatus, extra?: any) => void;

  constructor(onStatusUpdate?: (callId: string, status: CallStatus, extra?: any) => void) {
    this.onStatusUpdate = onStatusUpdate;
  }

  setUpdateCallback(cb: (callId: string, status: CallStatus, extra?: any) => void) {
    this.onStatusUpdate = cb;
  }

  isConfigured(): boolean {
    return true;
  }

  getStatus(): ProviderStatus {
    return {
      provider: 'dev',
      configured: true,
      isRealTelephony: false,
      missingVars: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'],
      message: 'Dev Simulator Mode. To make real PSTN phone calls, add Twilio or Exotel credentials to your server .env file.',
    };
  }

  async initiateCall(params: InitiateCallParams, callRecord: CallRecord): Promise<{ providerCallId: string; status: CallStatus; message?: string }> {
    const providerCallId = `dev_call_${Date.now()}`;
    const callTimers: NodeJS.Timeout[] = [];

    // Step 1: Queued -> Initiating -> Ringing
    const t1 = setTimeout(() => {
      this.onStatusUpdate?.(callRecord.id, 'ringing', {
        message: `Ringing ${params.customerPhone}...`,
      });
    }, 1200);
    callTimers.push(t1);

    // Step 2: Ringing -> In-Progress (Answered)
    const t2 = setTimeout(() => {
      this.onStatusUpdate?.(callRecord.id, 'in-progress', {
        connectedAt: new Date().toISOString(),
        sentiment: 'Positive',
        sentimentScore: 78,
        message: `Call answered by ${params.leadName || 'Customer'}. Audio stream connected.`,
      });
    }, 3800);
    callTimers.push(t2);

    this.timers.set(callRecord.id, callTimers);

    return {
      providerCallId,
      status: 'initiating',
      message: `Simulated call starting for testing (${params.customerPhone})`,
    };
  }

  async terminateCall(callId: string): Promise<boolean> {
    const existing = this.timers.get(callId);
    if (existing) {
      existing.forEach((t) => clearTimeout(t));
      this.timers.delete(callId);
    }
    return true;
  }
}

