import { Router, Request, Response } from 'express';
import { DASHBOARD_DATA } from '../data/mockData.js';

export function createDashboardRouter(): Router {
  const router = Router();

  router.get('/', (req: Request, res: Response) => {
    res.json(DASHBOARD_DATA);
  });

  return router;
}

