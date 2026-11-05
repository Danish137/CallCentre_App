export type NavigationTab = 'dash' | 'calls' | 'calendar' | 'pulse';
export type PlanSubTab = 'outgoing' | 'incoming' | 'recent';

export interface Lead {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  interest: string;
  product: string;
  crossSell: string;
  emi: string;
  attractivenessScore: number;
  expectedValue: number;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  statusLabel: string;
  statusColor: string;
  quoteOn: boolean;
  icp: number;
  icpColor: string;
  intentScore: number;
  phone: string;
  subscores: Array<{ label: string; pct: number; color: string }>;
  notes: string[];
  problemBuckets: Array<{ cat: string; text: string }>;
  journey: Array<{ date: string; channel: string; icon: string; color: string; text: string }>;
  actions: 'open' | 'ageing' | 'closed';
  sopChecks?: Array<{ title: string; sub: string; hit: boolean }>;
}

export interface IncomingCall {
  id: string;
  name: string;
  phone: string;
  time: string;
  expectedValue: number;
  status: string;
  leadId?: string;
  notes?: string;
}

export interface SopReviewItem {
  step: string;
  passed: boolean;
  evidence: string;
}

export interface RecentCall {
  id: string;
  name: string;
  phone: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  duration: string;
  durationSeconds: number;
  outcome?: string;
  score?: number;
  sopReview?: SopReviewItem[];
}

export interface DashboardData {
  agentName: string;
  storeName: string;
  status: string;
  kpis: Array<{
    label: string;
    value: string;
    trend: string;
    up?: boolean;
    live?: boolean;
    subtitle?: string;
  }>;
  progress: Array<{
    label: string;
    value: number;
    delta: string;
    status: 'warn' | 'good' | 'info';
  }>;
  whoIsWaiting: Array<{
    name: string;
    wait: string;
    level: 'high' | 'mid' | 'low';
    intent: string;
  }>;
  earnings: {
    monthEarnings: string;
    coachedMoves: string;
    nextSlab: string;
    progressPct: number;
  };
  myTasks: Array<{
    id: string;
    title: string;
    channel: string;
    icon: string;
    color: string;
    bg: string;
  }>;
  sevenDayPerformance: Array<{
    day: string;
    calls: number;
    csat: number;
    handleTime: number;
    conversion: number;
  }>;
}

export interface CalendarEvent {
  day: number;
  time: string;
  title: string;
  meta: string;
  type: 'coaching' | 'training' | 'meeting' | 'calls';
}

export interface PulseMessage {
  id: string;
  who: string;
  init: string;
  isSelf: boolean;
  isBot?: boolean;
  bg?: string;
  color?: string;
  text: string;
  time: string;
}

export interface PinnedCard {
  id: string;
  title: string;
  stakeholders: string;
  issue: string;
  suggestedResolution: string;
  options: Array<{ id: string; label: string }>;
  resolved: boolean;
  userResponse?: {
    optionId: string;
    replyText?: string;
    respondedAt: string;
  };
}

export interface ChannelThread {
  title: string;
  dateLabel: string;
  pinnedCard?: PinnedCard;
  messages: PulseMessage[];
}

export interface PulseOverview {
  channels: Array<{
    id: string;
    name: string;
    title: string;
    icon: string;
    type: string;
    unread: number;
  }>;
  agents: {
    roleAgents: Array<{
      id: string;
      name: string;
      role: string;
      icon: string;
      color: string;
      metric: string;
      target: string;
    }>;
    taskAgents: Array<{
      id: string;
      name: string;
      role: string;
      icon: string;
      color: string;
      desc: string;
    }>;
  };
  kudos: Array<{
    id: string;
    from: string;
    fromInit: string;
    to: string;
    badge: string;
    text: string;
    time: string;
  }>;
}

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
  allProviders?: Record<string, ProviderStatus>;
}

