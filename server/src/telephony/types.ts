export type CallStatus =
  | 'idle'
  | 'queued'
  | 'initiating'
  | 'ringing'
  | 'in-progress'
  | 'completed'
  | 'busy'
  | 'no-answer'
  | 'failed'
  | 'canceled';

export interface InitiateCallParams {
  agentPhone: string;
  customerPhone: string;
  leadName?: string;
  leadId?: string;
}

export interface CallRecord {
  id: string;
  providerCallId?: string;
  provider: 'twilio' | 'exotel' | 'dev';
  agentPhone: string;
  customerPhone: string;
  leadName: string;
  status: CallStatus;
  startedAt: string;
  connectedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  sentimentScore?: number;
  notes?: string;
  outcome?: string;
  isRealCall: boolean;
  recordingUrl?: string;
  error?: string;
}

export interface ProviderStatus {
  provider: 'twilio' | 'exotel' | 'dev';
  configured: boolean;
  isRealTelephony: boolean;
  missingVars: string[];
  message: string;
  configuredAgentPhone?: string | null;
  configuredAgentName?: string | null;
}

export interface ITelephonyProvider {
  name: 'twilio' | 'exotel' | 'dev';
  isConfigured(): boolean;
  getStatus(): ProviderStatus;
  initiateCall(params: InitiateCallParams, callRecord: CallRecord): Promise<{ providerCallId: string; status: CallStatus; message?: string }>;
  terminateCall(providerCallId: string): Promise<boolean>;
  handleWebhook?(payload: any): Promise<{ callId?: string; providerCallId?: string; status: CallStatus; duration?: number; recordingUrl?: string } | null>;
}
