import { Router, Request, Response } from 'express';
import { LEADS_DATA, INCOMING_CALLS, RECENT_CALLS_MOCK } from '../data/mockData.js';
import { TelephonyManager } from '../telephony/manager.js';

export function createLeadsRouter(manager?: TelephonyManager): Router {
  const router = Router();

  // Get all leads (sorted by attractiveness score)
  router.get('/', (req: Request, res: Response) => {
    const sorted = [...LEADS_DATA].sort((a, b) => b.attractivenessScore - a.attractivenessScore);
    res.json(sorted);
  });

  // Get single lead details
  router.get('/:id', (req: Request, res: Response) => {
    const paramId = String(req.params.id).toLowerCase();
    const lead = LEADS_DATA.find((l) => l.id.toLowerCase() === paramId || l.name.toLowerCase() === paramId);
    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  });

  // Get incoming/missed calls
  router.get('/plan/incoming', (req: Request, res: Response) => {
    res.json(INCOMING_CALLS);
  });

  // Get recent calls with SOP review items (merging live carrier call history)
  router.get('/plan/recent', (req: Request, res: Response) => {
    if (!manager) {
      return res.json(RECENT_CALLS_MOCK);
    }

    const liveHistory = manager.getCallHistory().map((c) => {
      const durSec = c.durationSeconds || 0;
      const m = Math.floor(durSec / 60);
      const s = durSec % 60;
      const durStr = m > 0 ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`;

      return {
        id: c.id,
        name: c.leadName || 'Customer',
        phone: c.customerPhone,
        type: 'outgoing' as const,
        time: c.startedAt || 'Today',
        duration: durStr,
        durationSeconds: durSec,
        outcome: c.outcome || (c.status === 'completed' ? 'Completed' : c.status),
        score: c.sentimentScore || (c.isRealCall ? 88 : 75),
        isRealCall: Boolean(c.isRealCall),
        provider: c.provider,
        sopReview: [
          { title: 'Greeting & Verification', hit: true, note: `Call initiated via ${c.provider.toUpperCase()} from ${c.agentPhone} to ${c.customerPhone}.` },
          { title: 'Telecom Status', hit: c.status === 'completed', note: `Carrier final status: ${c.status}. Duration: ${durStr}.` },
          { title: 'Outcome & Notes', hit: Boolean(c.outcome), note: c.notes || 'Wrap-up saved.' },
        ],
      };
    });

    res.json([...liveHistory, ...RECENT_CALLS_MOCK]);
  });

  return router;
}
