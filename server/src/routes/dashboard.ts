import { Router, Request, Response } from 'express';
import { DASHBOARD_DATA } from '../data/mockData.js';

export function createDashboardRouter(): Router {
  const router = Router();

  router.get('/', (req: Request, res: Response) => {
    res.json({
      ...DASHBOARD_DATA,
      agentName: process.env.DEFAULT_AGENT_NAME || DASHBOARD_DATA.agentName,
      agentPhone: process.env.DEFAULT_AGENT_PHONE || null,
    });
  });

  return router;
}

