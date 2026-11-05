import axios from 'axios';
import { ITelephonyProvider, InitiateCallParams, CallRecord, CallStatus, ProviderStatus } from './types.js';

export class ExotelProvider implements ITelephonyProvider {
  name: 'exotel' = 'exotel';
  private sid: string;
  private apiKey: string;
  private apiToken: string;
  private callerId: string;
  private subdomain: string;
  private webhookBaseUrl: string;

  constructor() {
    this.sid = process.env.EXOTEL_SID || '';
    this.apiKey = process.env.EXOTEL_API_KEY || '';
    this.apiToken = process.env.EXOTEL_API_TOKEN || '';
    this.callerId = process.env.EXOTEL_CALLER_ID || '';
    this.subdomain = process.env.EXOTEL_SUBDOMAIN || 'api.exotel.com';
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
        ? `Exotel Indian Telephony ready (${this.subdomain}) with Caller ID: ${this.callerId}`
        : `Exotel requires credentials: ${missing.join(', ')}`,
    };
  }

  /**
   * Helper to format phone numbers for Indian PSTN in Exotel.
   * Exotel typically expects 10 digits with a leading 0 (e.g. 09876543210)
   * or standard E.164 (e.g. +919876543210).
   */
  private formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('+91')) {
      return '0' + cleaned.slice(3);
    }
    if (cleaned.length === 10 && !cleaned.startsWith('0')) {
      return '0' + cleaned;
    }
    return cleaned;
  }

  async initiateCall(
    params: InitiateCallParams,
    callRecord: CallRecord
  ): Promise<{ providerCallId: string; status: CallStatus; message?: string }> {
    if (!this.isConfigured()) {
      throw new Error(`Exotel is not configured. Missing: ${this.getStatus().missingVars.join(', ')}`);
    }

    const agentFormatted = this.formatPhoneNumber(params.agentPhone);
    const customerFormatted = this.formatPhoneNumber(params.customerPhone);
    const callerIdFormatted = this.formatPhoneNumber(this.callerId);

    const url = `https://${this.subdomain}/v1/Accounts/${this.sid}/Calls/connect.json`;

    const formData = new URLSearchParams();
    formData.append('From', agentFormatted);
    formData.append('To', customerFormatted);
    formData.append('CallerId', callerIdFormatted);
    formData.append('CallType', 'trans');
    formData.append('TimeLimit', process.env.EXOTEL_TIME_LIMIT || '1800'); // 30 min max

    if (this.webhookBaseUrl) {
      const callbackUrl = `${this.webhookBaseUrl}/api/telephony/exotel/status-callback?callId=${callRecord.id}`;
      formData.append('StatusCallback', callbackUrl);
      formData.append('StatusCallbackContentType', 'application/json');
      formData.append('StatusCallbackEvents[]', 'terminal');
      formData.append('StatusCallbackEvents[]', 'answered');
    }

    formData.append('CustomField', callRecord.id);

    try {
      const response = await axios.post(url, formData.toString(), {
        auth: {
          username: this.apiKey,
          password: this.apiToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const callData = response.data?.Call || response.data;
      const callSid = callData?.Sid || `exo_${Date.now()}`;
      const statusRaw = (callData?.Status || 'initiating').toLowerCase();

      let mappedStatus: CallStatus = 'initiating';
      if (statusRaw === 'in-progress') mappedStatus = 'in-progress';
      else if (statusRaw === 'queued') mappedStatus = 'queued';

      return {
        providerCallId: callSid,
        status: mappedStatus,
        message: `Exotel outbound bridge initiated between agent (${agentFormatted}) and customer (${customerFormatted}) via ExoPhone (${callerIdFormatted})`,
      };
    } catch (err: any) {
      const status = err.response?.status;
      const data = err.response?.data;
      const errMsg = data?.RestException?.Message || data?.message || err.message;
      console.error(`[Exotel Error ${status}]:`, data || err.message);
      throw new Error(`Exotel Call Initiation Failed (${status || 'Network'}): ${errMsg}`);
    }
  }

  /**
   * Actual Exotel call termination API request.
   * Makes the HTTP request to Exotel to disconnect the active call.
   */
  async terminateCall(providerCallId: string): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    let requestMade = false;

    // Method 1: Exotel v1 Calls Update/Hangup endpoint
    try {
      const url = `https://${this.subdomain}/v1/Accounts/${this.sid}/Calls/${providerCallId}.json`;
      const formData = new URLSearchParams();
      formData.append('Status', 'completed');

      requestMade = true;
      const res = await axios.post(url, formData.toString(), {
        auth: {
          username: this.apiKey,
          password: this.apiToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (res.status >= 200 && res.status < 300) {
        console.log(`[Exotel] Successfully terminated Call ${providerCallId} via v1 API`);
        return true;
      }
    } catch (err: any) {
      console.warn(`[Exotel v1 Hangup Notice]: ${err.response?.status || err.message}`);
    }

    // Method 2: Exotel CPaaS / Bridge Stop API if v1 does not support mid-call hangup
    try {
      const cpaasSubdomain = this.subdomain.includes('.in.') ? 'cpaas-api.in.exotel.com' : 'cpaas-api.exotel.com';
      const bridgeUrl = `https://${cpaasSubdomain}/v2/accounts/${this.sid}/bridges/${providerCallId}`;

      requestMade = true;
      const res = await axios.put(
        bridgeUrl,
        { action: 'stop' },
        {
          auth: {
            username: this.apiKey,
            password: this.apiToken,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status >= 200 && res.status < 300) {
        console.log(`[Exotel] Successfully stopped bridge ${providerCallId} via CPaaS API`);
        return true;
      }
    } catch (err: any) {
      console.warn(`[Exotel CPaaS Stop Notice]: ${err.response?.status || err.message}`);
    }

    if (!requestMade) {
      throw new Error(`Exotel call termination could not dispatch HTTP request.`);
    }

    return false;
  }

  async handleWebhook(
    payload: any
  ): Promise<{ callId?: string; providerCallId?: string; status: CallStatus; duration?: number; recordingUrl?: string } | null> {
    const callSid = payload.CallSid || payload.call_sid || payload.Sid;
    const statusRaw = (payload.Status || payload.status || payload.CallStatus || '').toLowerCase();
    const eventType = (payload.EventType || payload.event_type || '').toLowerCase();
    const customField = payload.CustomField || payload.custom_field;

    let status: CallStatus = 'in-progress';
    if (eventType === 'answered') {
      status = 'in-progress';
    } else if (statusRaw.includes('completed')) {
      status = 'completed';
    } else if (statusRaw.includes('busy')) {
      status = 'busy';
    } else if (statusRaw.includes('no-answer') || statusRaw.includes('failed')) {
      status = 'no-answer';
    } else if (statusRaw.includes('ringing')) {
      status = 'ringing';
    } else if (statusRaw.includes('in-progress')) {
      status = 'in-progress';
    }

    const durationRaw = payload.ConversationDuration || payload.DialCallDuration || payload.Duration;
    const duration = durationRaw ? parseInt(durationRaw, 10) : undefined;
    const recordingUrl = payload.RecordingUrl || payload.recording_url;

    return {
      callId: customField,
      providerCallId: callSid,
      status,
      duration,
      recordingUrl,
    };
  }
}
