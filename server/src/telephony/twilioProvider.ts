import twilio from 'twilio';
import { ITelephonyProvider, InitiateCallParams, CallRecord, CallStatus, ProviderStatus } from './types.js';

export class TwilioProvider implements ITelephonyProvider {
  name: 'twilio' = 'twilio';
  private client: twilio.Twilio | null = null;
  private accountSid: string;
  private authToken: string;
  private twilioNumber: string;
  private webhookBaseUrl: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.twilioNumber = process.env.TWILIO_PHONE_NUMBER || '';
    this.webhookBaseUrl = process.env.WEBHOOK_BASE_URL || '';

    if (this.accountSid && this.authToken) {
      try {
        this.client = twilio(this.accountSid, this.authToken);
      } catch (err) {
        console.error('Failed to initialize Twilio client:', err);
      }
    }
  }

  isConfigured(): boolean {
    return Boolean(this.client && this.accountSid && this.authToken && this.twilioNumber);
  }

  getStatus(): ProviderStatus {
    const missing: string[] = [];
    if (!this.accountSid) missing.push('TWILIO_ACCOUNT_SID');
    if (!this.authToken) missing.push('TWILIO_AUTH_TOKEN');
    if (!this.twilioNumber) missing.push('TWILIO_PHONE_NUMBER');

    return {
      provider: 'twilio',
      configured: this.isConfigured(),
      isRealTelephony: true,
      missingVars: missing,
      message: this.isConfigured()
        ? `Twilio PSTN ready with caller ID: ${this.twilioNumber}`
        : `Twilio requires credentials: ${missing.join(', ')}`,
    };
  }

  async initiateCall(params: InitiateCallParams, callRecord: CallRecord): Promise<{ providerCallId: string; status: CallStatus; message?: string }> {
    if (!this.client || !this.twilioNumber) {
      throw new Error(`Twilio is not configured. Missing: ${this.getStatus().missingVars.join(', ')}`);
    }

    const { agentPhone, customerPhone, leadName } = params;

    // Build bridging TwiML:
    // Twilio calls the agent's phone. When the agent answers, Twilio announces the lead name,
    // and dials the customer's phone number, bridging the two parties.
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    
    // Announce to agent
    response.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      `Connecting you to lead ${leadName || 'Customer'}. Please stay on the line.`
    );

    // Bridge to customer
    const dial = response.dial({
      callerId: this.twilioNumber,
      timeout: 30,
      action: this.webhookBaseUrl ? `${this.webhookBaseUrl}/api/telephony/twilio/bridged-complete?callId=${callRecord.id}` : undefined,
    });

    dial.number(
      {
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallback: this.webhookBaseUrl ? `${this.webhookBaseUrl}/api/telephony/twilio/status-callback?callId=${callRecord.id}&leg=customer` : undefined,
        statusCallbackMethod: 'POST',
      },
      customerPhone
    );

    const call = await this.client.calls.create({
      to: agentPhone,
      from: this.twilioNumber,
      twiml: response.toString(),
      statusCallback: this.webhookBaseUrl ? `${this.webhookBaseUrl}/api/telephony/twilio/status-callback?callId=${callRecord.id}&leg=agent` : undefined,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });

    return {
      providerCallId: call.sid,
      status: 'initiating',
      message: `Outbound call initiated via Twilio. Calling agent at ${agentPhone} to bridge to ${customerPhone}`,
    };
  }

  async terminateCall(providerCallId: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.calls(providerCallId).update({ status: 'completed' });
      return true;
    } catch (err) {
      console.error('Error terminating Twilio call:', err);
      return false;
    }
  }

  async handleWebhook(payload: any): Promise<{ callId?: string; providerCallId?: string; status: CallStatus; duration?: number } | null> {
    const callSid = payload.CallSid;
    const twilioStatus = payload.CallStatus; // queued, ringing, in-progress, completed, busy, no-answer, failed, canceled
    const duration = payload.CallDuration ? parseInt(payload.CallDuration, 10) : undefined;

    let status: CallStatus = 'initiating';
    switch (twilioStatus) {
      case 'queued':
      case 'initiated':
        status = 'queued';
        break;
      case 'ringing':
        status = 'ringing';
        break;
      case 'in-progress':
        status = 'in-progress';
        break;
      case 'completed':
        status = 'completed';
        break;
      case 'busy':
        status = 'busy';
        break;
      case 'no-answer':
        status = 'no-answer';
        break;
      case 'failed':
      case 'canceled':
        status = 'failed';
        break;
      default:
        status = 'in-progress';
    }

    return {
      providerCallId: callSid,
      status,
      duration,
    };
  }
}

