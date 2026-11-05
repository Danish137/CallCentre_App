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

export const LEADS_DATA: Lead[] = [
  {
    id: 'lead-1',
    name: 'Mukunda',
    initials: 'MK',
    avatarBg: '#e1f5ee',
    avatarColor: '#0f6e56',
    interest: 'Interested: Ortho GRID · ₹8,490',
    product: 'Ortho GRID Mattress',
    crossSell: 'Mattress Protector · ₹1,999',
    emi: 'Asked about EMI — quote the 12-month zero-interest plan',
    attractivenessScore: 90,
    expectedValue: 8490,
    badge: '2h left',
    badgeBg: '#e1f5ee',
    badgeColor: '#0f6e56',
    statusLabel: 'Open',
    statusColor: '#1d9e75',
    quoteOn: true,
    icp: 87,
    icpColor: '#1d9e75',
    intentScore: 91,
    phone: process.env.TEST_CUSTOMER_PHONE || '06327314862',
    subscores: [
      { label: 'Budget Fit', pct: 87, color: '#1d9e75' },
      { label: 'Need Match', pct: 72, color: '#c8860a' },
      { label: 'Decision Stage', pct: 60, color: '#7c3aed' },
    ],
    notes: [
      'Asked about EMI on the Ortho GRID — lead with the 12-month zero-interest plan.',
      'Price-sensitive — compared us with a competitor, so mention the 100-night trial to reduce risk.',
      'Prefers evening calls, after 6pm.',
    ],
    problemBuckets: [
      { cat: 'Financing Related', text: 'Asked specifically about EMI options on the Ortho GRID — budget is a live concern, not a blocker' },
      { cat: 'Quotation Demanded', text: 'Compared pricing with a competitor before reaching out — price-anchored, expects a competitive number' },
      { cat: 'Warranty Related', text: "Hasn't raised this yet — worth proactively mentioning the 100-night trial to reduce perceived risk" },
    ],
    journey: [
      { date: '18 May', channel: 'Meta Ad', icon: '📢', color: '#1877f2', text: 'Clicked our "0% EMI on Ortho GRID" retargeting ad — first touch' },
      { date: '19 May', channel: 'Website', icon: '🌐', color: '#0f6e56', text: 'Spent 6m on the Ortho GRID product page; added Queen size to cart' },
      { date: '20 May', channel: 'WhatsApp', icon: '💬', color: '#25d366', text: 'Inquired about delivery timeline to Indiranagar; bot sent brochure' },
    ],
    actions: 'open',
    sopChecks: [
      { title: 'Quotation Demanded', sub: 'Asked for pricing / EMI breakdown on the Ortho GRID', hit: true },
      { title: 'Financing Related', sub: 'Price-sensitive, compared with competitor — lead with 12m EMI', hit: true },
      { title: 'Product Related', sub: 'No open questions on firmness or fit', hit: false },
      { title: 'Warranty Related', sub: 'Mention 100-night trial proactively — reduces risk', hit: true },
      { title: 'In-Store Experience', sub: "Hasn't asked to visit a store yet", hit: false },
    ],
  },
  {
    id: 'lead-2',
    name: 'Kavitha R.',
    initials: 'KR',
    avatarBg: '#fff3d6',
    avatarColor: '#c8860a',
    interest: 'Interested: Smart Hybrid · ₹14,990',
    product: 'Smart Hybrid Luxe Mattress',
    crossSell: 'Ergonomic Memory Foam Pillow · ₹1,499',
    emi: 'Offered 6-month no cost EMI at ₹2,498/mo',
    attractivenessScore: 82,
    expectedValue: 14990,
    badge: 'SLA at risk',
    badgeBg: '#fdecec',
    badgeColor: '#e24b4a',
    statusLabel: 'Ageing',
    statusColor: '#c8860a',
    quoteOn: true,
    icp: 78,
    icpColor: '#c8860a',
    intentScore: 84,
    phone: '+91 97654 32109',
    subscores: [
      { label: 'Budget Fit', pct: 80, color: '#1d9e75' },
      { label: 'Need Match', pct: 85, color: '#1d9e75' },
      { label: 'Decision Stage', pct: 75, color: '#1d9e75' },
    ],
    notes: [
      'Suffers from upper back tightness in the mornings. Looking for medium-firm orthopedic support.',
      'Requested callback to schedule an in-person trial at the RT Nagar store.',
      'SLA is overdue by 4 hours. Address with priority.',
    ],
    problemBuckets: [
      { cat: 'Product Related', text: 'Needs clarification on how Hybrid differs from standard Ortho GRID' },
      { cat: 'In-Store Experience Needed', text: 'Wants to test mattress in-store with her spouse before confirming' },
    ],
    journey: [
      { date: '19 May', channel: 'Google Search', icon: '🔍', color: '#ea4335', text: 'Searched "best orthopedic mattress Bangalore" and clicked' },
      { date: '21 May', channel: 'Inbound Call', icon: '📞', color: '#185fa5', text: 'Called store asking for RT Nagar address and weekend timings' },
    ],
    actions: 'ageing',
    sopChecks: [
      { title: 'Needs Discovery', sub: 'Explore back pain complaints and firmness preferences', hit: true },
      { title: 'Store Visit Pitch', sub: 'Invite to RT Nagar experience centre', hit: true },
      { title: 'Warranty Related', sub: 'Mention 10-year warranty against sagging', hit: true },
    ],
  },
  {
    id: 'lead-3',
    name: 'Ritu S.',
    initials: 'RS',
    avatarBg: '#e8f0fe',
    avatarColor: '#185fa5',
    interest: 'Interested: Smart Luxe · ₹13,390',
    product: 'Smart Luxe Mattress',
    crossSell: 'Bamboo Mattress Cover · ₹1,299',
    emi: 'Pre-approved 3-month zero-interest plan',
    attractivenessScore: 94,
    expectedValue: 13390,
    badge: 'High Intent',
    badgeBg: '#e1f5ee',
    badgeColor: '#0f6e56',
    statusLabel: 'Open',
    statusColor: '#1d9e75',
    quoteOn: false,
    icp: 92,
    icpColor: '#1d9e75',
    intentScore: 96,
    phone: process.env.TEST_CUSTOMER_PHONE || '06327314862',
    subscores: [
      { label: 'Budget Fit', pct: 95, color: '#1d9e75' },
      { label: 'Need Match', pct: 90, color: '#1d9e75' },
      { label: 'Decision Stage', pct: 92, color: '#1d9e75' },
    ],
    notes: [
      'Visited RT Nagar store yesterday and loved the feel of Smart Luxe.',
      'Wants to confirm delivery timelines to Whitefield before paying.',
      'Very high conversion probability.',
    ],
    problemBuckets: [
      { cat: 'Quotation Demanded', text: 'Requested final invoice with free doorstep delivery confirmed' },
    ],
    journey: [
      { date: 'Yesterday', channel: 'Store Visit', icon: '🏬', color: '#854f0b', text: 'Visited RT Nagar store; tried Smart Luxe and tested firmness' },
      { date: 'Today', channel: 'Web Chat', icon: '💬', color: '#0f6e56', text: 'Asked: "How fast can you deliver to Whitefield?"' },
    ],
    actions: 'open',
    sopChecks: [
      { title: 'Intent Confirm', sub: 'Acknowledge store visit and preferred mattress', hit: true },
      { title: 'Delivery Timeline', sub: 'Confirm 2-day delivery with free white-glove setup', hit: true },
      { title: 'Closing', sub: 'Generate payment link over WhatsApp or email', hit: true },
    ],
  },
  {
    id: 'lead-4',
    name: 'Faizan A.',
    initials: 'FA',
    avatarBg: '#faeeda',
    avatarColor: '#854f0b',
    interest: 'Interested: Smart Ortho · ₹9,990',
    product: 'Smart Ortho Mattress',
    crossSell: 'Waterproof Protector · ₹1,499',
    emi: 'Asked for Bajaj Finserv EMI',
    attractivenessScore: 65,
    expectedValue: 9990,
    badge: 'Cold Lead',
    badgeBg: '#f2f2f7',
    badgeColor: '#8e8e93',
    statusLabel: 'Open',
    statusColor: '#8e8e93',
    quoteOn: false,
    icp: 60,
    icpColor: '#c8860a',
    intentScore: 71,
    phone: '+91 90000 11122',
    subscores: [
      { label: 'Budget Fit', pct: 65, color: '#c8860a' },
      { label: 'Need Match', pct: 70, color: '#c8860a' },
      { label: 'Decision Stage', pct: 55, color: '#8e8e93' },
    ],
    notes: [
      'Enquired via WhatsApp ad about Queen vs King sizes.',
      'Comparing with local unbranded spring mattresses.',
    ],
    problemBuckets: [
      { cat: 'Product Related', text: 'Needs explanation on why SmartGRID outperforms pocket spring' },
      { cat: 'Financing Related', text: 'Checking if debit card EMI is available' },
    ],
    journey: [
      { date: '3 days ago', channel: 'Instagram', icon: '📸', color: '#e1306c', text: 'Clicked ad video explaining SmartGRID motion isolation' },
    ],
    actions: 'open',
  },
  {
    id: 'lead-5',
    name: 'Divya P.',
    initials: 'DP',
    avatarBg: '#f3e8ff',
    avatarColor: '#7c3aed',
    interest: 'Accessories: Pillows & Protector · ₹3,490',
    product: 'SmartGRID Bedding Bundle',
    crossSell: 'Fitted Bedsheet set · ₹999',
    emi: 'Full payment via UPI',
    attractivenessScore: 48,
    expectedValue: 3490,
    badge: 'Accessories',
    badgeBg: '#f3e8ff',
    badgeColor: '#7c3aed',
    statusLabel: 'Ageing',
    statusColor: '#8e8e93',
    quoteOn: false,
    icp: 45,
    icpColor: '#8e8e93',
    intentScore: 52,
    phone: '+91 91234 56789',
    subscores: [
      { label: 'Budget Fit', pct: 50, color: '#8e8e93' },
      { label: 'Need Match', pct: 45, color: '#8e8e93' },
      { label: 'Decision Stage', pct: 50, color: '#8e8e93' },
    ],
    notes: ['Enquired about cervical pillow support.'],
    problemBuckets: [{ cat: 'Product Related', text: 'Wants dimensions of the contour pillow' }],
    journey: [{ date: '22 May', channel: 'Catalog', icon: '📦', color: '#7c3aed', text: 'Downloaded bedding catalog PDF' }],
    actions: 'ageing',
  },
];

export const INCOMING_CALLS = [
  {
    id: 'inc-1',
    name: 'Noor Jahan',
    phone: process.env.TEST_CUSTOMER_PHONE || '06327314862',
    time: 'Today 11:20 AM',
    expectedValue: 13390,
    status: 'Missed',
    leadId: 'lead-1',
    notes: 'Called back about delivery slot confirmation.',
  },
  {
    id: 'inc-2',
    name: 'Faizan A.',
    phone: '+91 90000 11122',
    time: 'Today 10:05 AM',
    expectedValue: 9990,
    status: 'Missed',
    leadId: 'lead-4',
    notes: 'Inquired about weekend store timings.',
  },
  {
    id: 'inc-3',
    name: 'Kavitha R.',
    phone: '+91 97654 32109',
    time: 'Yesterday 4:40 PM',
    expectedValue: 14990,
    status: 'Missed',
    leadId: 'lead-2',
    notes: 'Tried calling regarding store trial appointment.',
  },
  {
    id: 'inc-4',
    name: 'Divya P.',
    phone: '+91 91234 56789',
    time: 'Yesterday 2:15 PM',
    expectedValue: 3490,
    status: 'Missed',
    leadId: 'lead-5',
    notes: 'Left callback request on IVR.',
  },
];

export const RECENT_CALLS_MOCK = [
  {
    id: 'rec-1',
    name: 'Mukunda R.',
    phone: '+91 98765 43210',
    type: 'incoming',
    time: '10:42 AM',
    duration: '4m 12s',
    durationSeconds: 252,
    outcome: 'Interested',
    score: 83,
    isRealCall: false,
    provider: 'dev',
    sopReview: [
      { step: 'Opening & Intent Confirm', passed: true, evidence: '"This is Arvind calling from The Sleep Company, is now an okay time?"' },
      { step: 'Needs Discovery', passed: true, evidence: '"Can I ask what matters most to you — firmness or price?"' },
      { step: 'Product Pitch', passed: true, evidence: '"The GRID layer gives pressure relief exactly where you need it."' },
      { step: 'EMI / Financing Mention', passed: true, evidence: '"We do have a 12-month zero-interest EMI plan if that helps."' },
      { step: 'Warranty Mention', passed: false, evidence: 'No mention of the 10-year warranty period anywhere in the call.' },
      { step: 'Closing / Callback Booking', passed: true, evidence: '"I\'ll send the quote over and follow up Thursday, does that work?"' },
    ],
  },
  {
    id: 'rec-2',
    name: 'Kavitha R.',
    phone: '+91 97654 32109',
    type: 'outgoing',
    time: 'Yesterday',
    duration: '2m 05s',
    durationSeconds: 125,
    outcome: 'Follow-up needed',
    score: 67,
    isRealCall: false,
    provider: 'dev',
    sopReview: [
      { step: 'Opening & Intent Confirm', passed: true, evidence: '"Hi Kavitha, calling regarding your recent mattress enquiry."' },
      { step: 'Needs Discovery', passed: true, evidence: '"Understood your back pain concerns with current foam bed."' },
      { step: 'Product Pitch', passed: false, evidence: 'Jumped to pricing before explaining Hybrid pocket springs.' },
      { step: 'EMI / Financing Mention', passed: true, evidence: '"We have 6-month EMI starting at ₹2,498/mo."' },
      { step: 'Warranty Mention', passed: false, evidence: 'No warranty details were shared.' },
      { step: 'Closing / Callback Booking', passed: false, evidence: 'Call ended without locking store visit date.' },
    ],
  },
  {
    id: 'rec-3',
    name: 'Faizan A.',
    phone: '+91 90000 11122',
    type: 'outgoing',
    time: 'Mon',
    duration: '6m 40s',
    durationSeconds: 400,
    outcome: 'Interested',
    score: 83,
    isRealCall: false,
    provider: 'dev',
    sopReview: [
      { step: 'Opening & Intent Confirm', passed: true, evidence: '"Good afternoon, Arvind here from The Sleep Company."' },
      { step: 'Needs Discovery', passed: true, evidence: '"Detailed questions asked about bed dimensions."' },
      { step: 'Product Pitch', passed: true, evidence: '"Highlighted patented SmartGRID cooling layer."' },
      { step: 'EMI / Financing Mention', passed: false, evidence: 'Financing was not introduced on this call.' },
      { step: 'Warranty Mention', passed: true, evidence: '"Explained 10-year warranty and free doorstep return."' },
      { step: 'Closing / Callback Booking', passed: true, evidence: '"Sent product brochure on WhatsApp."' },
    ],
  },
];

export const DASHBOARD_DATA = {
  agentName: 'Arvind Rajan',
  storeName: 'The Sleep Company · Call Centre',
  status: 'On Queue',
  kpis: [
    { label: 'OG Score™', value: '76', trend: '▲ +13', up: true, subtitle: '72nd percentile across team' },
    { label: 'Avg Handle Time', value: '4m 12s', trend: '▼ 8%', up: true, subtitle: 'Target: < 4m 30s' },
    { label: 'CSAT Today', value: '94%', trend: '▲ 2pt', up: true, subtitle: '14 rated calls today' },
    { label: 'In Queue', value: '2', trend: '● live', live: true, subtitle: 'Calls waiting now' },
  ],
  progress: [
    { label: 'Leads Created', value: 3, delta: '▲ +1', status: 'warn' },
    { label: 'Leads Called', value: 2, delta: '▲ +2', status: 'good' },
  ],
  whoIsWaiting: [
    { name: 'Priya Iyer', phone: '+91 98450 22334', wait: '4m 20s', level: 'high', intent: 'Likely billing dispute — flagged before' },
    { name: 'Suresh Nair', phone: '+91 97310 55667', wait: '1m 50s', level: 'mid', intent: 'Plan upgrade enquiry' },
  ],
  earnings: {
    monthEarnings: '₹5,200',
    coachedMoves: '₹1,700 from coached moves',
    nextSlab: '₹800 to ₹6,000 slab',
    progressPct: 87,
  },
  myTasks: [
    { id: 't1', title: 'Confirm the 4:30pm callback with Mukunda', channel: 'Call Centre Team', icon: 'phone-call', color: '#0369a1', bg: '#e0f2fe' },
    { id: 't2', title: 'Submit feedback on EMI objections coach', channel: 'Skill Improvement Coach', icon: 'target', color: '#7c3aed', bg: '#f3e8ff' },
    { id: 't3', title: 'Review greeting SOP video (2 min)', channel: 'My SOP Coach', icon: 'clipboard-check', color: '#c8860a', bg: '#fff3d6' },
  ],
  sevenDayPerformance: [
    { day: 'Thu', calls: 14, csat: 90, handleTime: 4.5, conversion: 24 },
    { day: 'Fri', calls: 18, csat: 92, handleTime: 4.3, conversion: 26 },
    { day: 'Sat', calls: 24, csat: 95, handleTime: 4.1, conversion: 32 },
    { day: 'Sun', calls: 22, csat: 91, handleTime: 4.4, conversion: 28 },
    { day: 'Mon', calls: 16, csat: 93, handleTime: 4.2, conversion: 29 },
    { day: 'Tue', calls: 19, csat: 96, handleTime: 3.9, conversion: 34 },
    { day: 'Today', calls: 12, csat: 94, handleTime: 4.2, conversion: 31 },
  ],
};

export const CALENDAR_EVENTS = [
  { day: 23, time: '11:00 AM', title: 'SOP coaching session', meta: 'With Sunita Rao (Manager) · via #callcentre-team', type: 'coaching' },
  { day: 26, time: '2:30 PM', title: 'Warranty pitch refresher', meta: 'With L&D team · flagged from your last 3 calls', type: 'training' },
  { day: 28, time: '10:00 AM', title: 'Weekly team huddle', meta: 'With Call Centre team · #callcentre-team', type: 'meeting' },
  { day: 5, time: '3:00 PM', title: 'High-intent lead follow-ups', meta: 'Call queue review for Mukunda and Kavitha', type: 'calls' },
  { day: 12, time: '4:15 PM', title: 'Product Deep-dive: SmartGRID vs Memory Foam', meta: 'L&D interactive audio workshop', type: 'training' },
];

export const PULSE_DATA = {
  channels: [
    { id: 'callcentre-team', name: 'callcentre-team', title: '#callcentre-team', icon: 'headphones', type: 'team', unread: 2 },
    { id: 'all-stores', name: 'all-stores', title: '#all-stores', icon: 'megaphone', type: 'broadcast', unread: 0 },
    { id: 'avani-coaching', name: 'avani-coaching', title: '#avani-coaching', icon: 'sparkles', type: 'ai', unread: 1 },
    { id: 'emi-push-nudges', name: 'emi-push-nudges', title: '#emi-push-nudges', icon: 'credit-card', type: 'task', unread: 1 },
    { id: 'lead-conversion', name: 'lead-conversion', title: '#lead-conversion', icon: 'trending-up', type: 'task', unread: 0 },
  ],
  agents: {
    roleAgents: [
      { id: 'asm-agent', name: 'ASM Agent', role: 'Store & Region Manager Agent', icon: 'building-2', color: '#0f6e56', metric: 'Store Conversion', target: '30%' },
      { id: 'callcentre-agent', name: 'Call Centre Agent', role: 'All Call Centre Staff', icon: 'headset', color: '#1d4ed8', metric: 'Queue Conversion', target: '28%' },
    ],
    taskAgents: [
      { id: 'skillimprovement', name: 'Skill Improvement Coach', role: 'Practice & feedback agent', icon: 'target', color: '#7c3aed', desc: 'Pick a skill you want to get sharper at — warranty pitch, objection handling, EMI close.' },
      { id: 'sopcoach', name: 'My SOP Coach', role: 'Personal coaching agent', icon: 'clipboard-list', color: '#4338ca', desc: 'Every day finds your weakest SOP step from conversations and sends you a ready-to-use line.' },
      { id: 'emipush', name: 'EMI Push Nudge', role: 'Financing attachment', icon: 'credit-card', color: '#0f6e56', desc: 'EMI mentioned in 4/11 calls this shift (36%) — below target.' },
      { id: 'followup', name: 'Follow-up Agent', role: 'Lead turnaround', icon: 'clock', color: '#c8860a', desc: 'Clearing leads past 48h lifts call centre follow-up rate by +3pts.' },
    ],
  },
  kudos: [
    { id: 'k1', from: 'Sunita Rao', fromInit: 'SR', to: 'Arvind Rajan', badge: '🏆 Top Seller', text: 'Great work hitting 94% CSAT and resolving the Indiranagar complaint so swiftly today!', time: '1:45 PM' },
    { id: 'k2', from: 'Raju Kumar', fromInit: 'RK', to: 'Arvind Rajan', badge: '🌟 Team Player', text: 'Thanks for covering my afternoon queue during the L&D training!', time: 'Yesterday' },
  ],
  threads: {
    'callcentre-team': {
      title: '#callcentre-team',
      dateLabel: 'Today · Call Centre Team',
      pinnedCard: {
        id: 'pinned-cc-1',
        title: 'Needs your input: Greeting script adherence',
        stakeholders: '@You (Arvind R.), Sunita Rao (Manager)',
        issue: 'Greeting-in-first-10s QA score is at 71% this week, below our 85% target.',
        suggestedResolution: "Open every call with the standard greeting: 'Namaste! This is [Name] from The Sleep Company, is now an okay time?'",
        options: [
          { id: 'commit', label: 'Commit to Opening Script' },
          { id: 'feedback', label: 'Need Script Adjustment' },
        ],
        resolved: false,
      },
      messages: [
        { id: 'm1', who: 'Sunita Rao', init: 'SR', isSelf: false, isBot: false, bg: '#faeeda', color: '#854f0b', text: '👥 <b>STAKEHOLDERS:</b> <b style="color:#854f0b">@You (Arvind R.)</b>, whole call centre shift', time: '2:05pm' },
        { id: 'm2', who: 'Sunita Rao', init: 'SR', isSelf: false, isBot: false, bg: '#faeeda', color: '#854f0b', text: '📋 <b>ISSUE DEFINITION:</b> Greeting-in-first-10s QA score is at 71% this week, below our 85% target.', time: '2:05pm' },
        { id: 'm3', who: 'Sunita Rao', init: 'SR', isSelf: false, isBot: false, bg: '#faeeda', color: '#854f0b', text: "➡️ <b>SUGGESTED RESOLUTION:</b> Let's push that up 💪 — open every call with the greeting script. I'll check back Friday.", time: '2:05pm' },
        { id: 'm4', who: 'You', init: 'AR', isSelf: true, isBot: false, bg: '#1d9e75', color: '#ffffff', text: 'On it! Will make sure I open every call with the greeting script 🙌', time: '2:10pm' },
        { id: 'm5', who: 'Sunita Rao', init: 'SR', isSelf: false, isBot: false, bg: '#faeeda', color: '#854f0b', text: 'Great attitude Arvind 🌟', time: '2:14pm' },
      ],
    },
    'avani-coaching': {
      title: '#avani-coaching',
      dateLabel: 'Today · Avani AI Coaching',
      messages: [
        { id: 'ac1', who: 'Avani', init: '✨', isSelf: false, isBot: true, bg: '#e1f5ee', color: '#0f6e56', text: "Your average handle time is up 8% this week — try confirming the customer's need in your first question.", time: '10:15am' },
        { id: 'ac2', who: 'You', init: 'AR', isSelf: true, isBot: false, bg: '#1d9e75', color: '#ffffff', text: 'Understood Avani. Any tip for price-sensitive mattress leads?', time: '10:20am' },
        { id: 'ac3', who: 'Avani', init: '✨', isSelf: false, isBot: true, bg: '#e1f5ee', color: '#0f6e56', text: 'Anchor on the 10-year warranty (₹70/month effective cost) and offer the 12-month 0% interest EMI plan upfront.', time: '10:21am' },
      ],
    },
  },
};

