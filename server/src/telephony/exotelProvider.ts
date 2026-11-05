import axios from 'axios';
import { ITelephonyProvider, InitiateCallParams, CallRecord, CallStatus, ProviderStatus } from './types.js';

export class ExotelProvider implements ITelephonyProvider {
  name: 'exotel' = 'exotel';
  private sid: string;
  private apiKey: string;
  private apiToken: string;
  private callerId: string;
  private webhookBaseUrl: string;

  constructor() {
    this.sid = process.env.EXOTEL_SID || '';
    this.apiKey = process.env.EXOTEL_API_KEY || '';
    this.apiToken = process.env.EXOTEL_API_TOKEN || '';
    this.callerId = process.env.EXOTEL_CALLER_ID || '';
    this.webhookBaseUrl = process.env.WEBHOOK_BASE_URL || '';
  }

  isConfigured(): boolean {
    return Boolean(this.sid && this.apiKey && this.apiToken && this.callerId);
  }

  getStatus(): ProviderStatus {
    const missing: string[] = [];
    if (!this.sid) missing.push('EXOTEL_SID');
    if (!this.apiKey) missing.push('EXOTEL_API_KEY');
    if (!this.apiToken) missing.push('EXOTEL_API_TOKEN');
    if (!this.callerId) missing.push('EXOTEL_CALLER_ID');

    return {
      provider: 'exotel',
      configured: this.isConfigured(),
      isRealTelephony: true,
      missingVars: missing,
      message: this.isConfigured()
        ? `Exotel Indian Telephony ready with Virtual Number: ${this.callerId}`
        : `Exotel requires credentials: ${missing.join(', ')}`,
    };
  }

  async initiateCall(params: InitiateCallParams, callRecord: CallRecord): Promise<{ providerCallId: string; status: CallStatus; message?: string }> {
    if (!this.isConfigured()) {
      throw new Error(`Exotel is not configured. Missing: ${this.getStatus().missingVars.join(', ')}`);
    }

    const { agentPhone, customerPhone } = params;
    const url = `https://${this.apiKey}:${this.apiToken}@api.exotel.com/v1/Accounts/${this.sid}/Calls/connect.json`;

    const formData = new URLSearchParams();
    formData.append('From', agentPhone);
    formData.append('To', customerPhone);
    formData.append('CallerId', this.callerId);
    formData.append('CallType', 'trans');
    if (this.webhookBaseUrl) {
      formData.append('StatusCallback', `${this.webhookBaseUrl}/api/telephony/exotel/status-callback?callId=${callRecord.id}`);
    }

    const response = await axios.post(url, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const callSid = response.data?.Call?.Sid || `exo_${Date.now()}`;
    return {
      providerCallId: callSid,
      status: 'initiating',
      message: `Exotel outbound bridge connecting ${agentPhone} to ${customerPhone}`,
    };
  }

  async terminateCall(providerCallId: string): Promise<boolean> {
    // Exotel hangup API if available
    return true;
  }

  async handleWebhook(payload: any): Promise<{ callId?: string; providerCallId?: string; status: CallStatus; duration?: number } | null> {
    const statusRaw = (payload.Status || payload.CallStatus || '').toLowerCase();
    let status: CallStatus = 'in-progress';
    if (statusRaw.includes('completed')) status = 'completed';
    else if (statusRaw.includes('busy')) status = 'busy';
    else if (statusRaw.includes('no-answer')) status = 'no-answer';
    else if (statusRaw.includes('failed')) status = 'failed';
    else if (statusRaw.includes('in-progress') || statusRaw.includes('answered')) status = 'in-progress';

    return {
      providerCallId: payload.CallSid,
      status,
      duration: payload.DialCallDuration ? parseInt(payload.DialCallDuration, 10) : undefined,
    };
  }
}

