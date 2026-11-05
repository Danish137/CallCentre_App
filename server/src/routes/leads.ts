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

    const SOP_ITEMS = [
      { step: 'Opening & Intent Confirm', evidencePass: '"This is Arvind from The Sleep Company, is now an okay time?"', evidenceFail: 'Started pitching immediately without confirming intent or convenience.' },
      { step: 'Needs Discovery', evidencePass: '"Can I ask what matters most to you — firmness or price?"', evidenceFail: 'Jumped to product features without asking customer sleeping concerns.' },
      { step: 'Product Pitch', evidencePass: '"The GRID layer gives pressure relief exactly where you need it."', evidenceFail: 'No clear differentiation of SmartGRID technology explained.' },
      { step: 'EMI / Financing Mention', evidencePass: '"We do have a 12-month zero-interest EMI plan if that helps."', evidenceFail: 'EMI options never introduced even when price was discussed.' },
      { step: 'Warranty Mention', evidencePass: '"Comes with a 10-year warranty and 100-night trial."', evidenceFail: 'No mention of 10-year warranty or trial period.' },
      { step: 'Closing / Callback Booking', evidencePass: '"I\'ll send the quote over and follow up Thursday, does that work?"', evidenceFail: 'Call ended without locking in next steps or callback.' },
    ];

    const liveHistory = manager.getCallHistory().map((c, idx) => {
      const durSec = c.durationSeconds || 0;
      const m = Math.floor(durSec / 60);
      const s = durSec % 60;
      const durStr = m > 0 ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`;

      const isReal = Boolean(c.isRealCall);

      if (isReal) {
        // Real carrier calls: Never invent transcripts, evidence, or scores
        return {
          id: c.id,
          name: c.leadName || 'Customer',
          phone: c.customerPhone,
          agentPhone: c.agentPhone,
          type: 'outgoing' as const,
          time: c.startedAt ? `Today ${c.startedAt}` : 'Today',
          duration: durStr,
          durationSeconds: durSec,
          outcome: c.outcome || (c.status === 'completed' ? 'Completed' : c.status),
          score: undefined,
          sopReview: undefined,
          isRealCall: true,
          provider: c.provider,
          notes: c.notes,
        };
      }

      // Simulated calls: Provide 6-step SOP template review with evidence
      const template = idx % 2 === 0
        ? [true, true, true, true, false, true] // 5/6 = 83%
        : [true, true, false, true, false, false]; // 3/6 = 50%

      const sopReview = SOP_ITEMS.map((item, sIdx) => {
        const passed = template[sIdx];
        return {
          step: item.step,
          passed,
          evidence: passed ? item.evidencePass : item.evidenceFail,
        };
      });

      const passedCount = sopReview.filter((s) => s.passed).length;
      const score = Math.round((passedCount / sopReview.length) * 100);

      return {
        id: c.id,
        name: c.leadName || 'Customer',
        phone: c.customerPhone,
        agentPhone: c.agentPhone,
        type: 'outgoing' as const,
        time: c.startedAt ? `Today ${c.startedAt}` : 'Today',
        duration: durStr,
        durationSeconds: durSec,
        outcome: c.outcome || (c.status === 'completed' ? 'Completed' : c.status),
        score,
        sopReview,
        isRealCall: false,
        provider: c.provider,
        notes: c.notes,
      };
    });

    res.json([...liveHistory, ...RECENT_CALLS_MOCK]);
  });

  return router;
}
