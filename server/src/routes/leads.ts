import { Router, Request, Response } from 'express';
import { LEADS_DATA, INCOMING_CALLS, RECENT_CALLS_MOCK } from '../data/mockData.js';

export function createLeadsRouter(): Router {
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

  // Get recent calls with SOP review items
  router.get('/plan/recent', (req: Request, res: Response) => {
    res.json(RECENT_CALLS_MOCK);
  });

  return router;
}
