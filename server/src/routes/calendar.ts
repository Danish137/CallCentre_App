import { Router, Request, Response } from 'express';
import { CALENDAR_EVENTS } from '../data/mockData.js';

export function createCalendarRouter(): Router {
  const router = Router();

  router.get('/events', (req: Request, res: Response) => {
    res.json(CALENDAR_EVENTS);
  });

  router.post('/events', (req: Request, res: Response) => {
    const { title, time, day, meta, type } = req.body;
    const newEvent = {
      day: parseInt(day, 10) || new Date().getDate(),
      time: time || '12:00 PM',
      title: title || 'New Invite',
      meta: meta || 'Added via Calendar',
      type: type || 'meeting',
    };
    CALENDAR_EVENTS.push(newEvent);
    res.json({ success: true, event: newEvent });
  });

  return router;
}

