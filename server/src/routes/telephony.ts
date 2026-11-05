import { Router, Request, Response } from 'express';
import { TelephonyManager } from '../telephony/manager.js';

export function createTelephonyRouter(manager: TelephonyManager): Router {
  const router = Router();

  // Get active provider status
  router.get('/status', (req: Request, res: Response) => {
    res.json(manager.getProviderStatus());
  });

  // Switch active provider
  router.post('/provider', (req: Request, res: Response) => {
    const { provider } = req.body;
    if (provider === 'twilio' || provider === 'exotel' || provider === 'dev') {
      manager.setProvider(provider);
      res.json({ success: true, activeProvider: provider });
    } else {
      res.status(400).json({ error: 'Invalid provider. Must be twilio, exotel, or dev.' });
    }
  });

  // Initiate a call
  router.post('/call', async (req: Request, res: Response) => {
    try {
      const { customerPhone, leadName, leadId, agentPhone } = req.body;
      if (!customerPhone) {
        return res.status(400).json({ error: 'customerPhone is required' });
      }

      const callRecord = await manager.initiateCall({
        customerPhone,
        leadName: leadName || 'Customer',
        leadId,
        agentPhone,
      });

      res.json({ success: true, call: callRecord });
    } catch (err: any) {
      console.error('Call initiation error:', err);
      res.status(500).json({ error: err.message || 'Failed to initiate call' });
    }
  });

  // End an active call
  router.post('/call/:id/end', async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const { outcome, notes } = req.body;
      const call = await manager.endCall(id, outcome, notes);
      res.json({ success: true, call });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to end call' });
    }
  });

  // Get current active call
  router.get('/active', (req: Request, res: Response) => {
    res.json({ activeCall: manager.getActiveCall() });
  });

  // Get call history
  router.get('/history', (req: Request, res: Response) => {
    res.json({ history: manager.getCallHistory() });
  });

  // SSE Stream for live telephony events
  router.get('/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    manager.addSseClient(res);

    // Send initial status
    const initialData = {
      providerStatus: manager.getProviderStatus(),
      activeCall: manager.getActiveCall(),
      history: manager.getCallHistory(),
    };
    res.write(`event: connected\ndata: ${JSON.stringify(initialData)}\n\n`);
  });

  // Twilio Webhooks
  router.post('/twilio/status-callback', async (req: Request, res: Response) => {
    try {
      await manager.handleProviderWebhook('twilio', req.body);
      res.sendStatus(200);
    } catch (err) {
      console.error('Twilio webhook error:', err);
      res.sendStatus(500);
    }
  });

  router.post('/twilio/bridged-complete', async (req: Request, res: Response) => {
    const callId = req.query.callId as string;
    if (callId) {
      await manager.endCall(callId, 'Resolved', 'Call ended by remote party.');
    }
    res.send('<Response></Response>');
  });

  // Exotel Webhook (handles both POST and GET callbacks)
  router.all('/exotel/status-callback', async (req: Request, res: Response) => {
    try {
      const payload = { ...req.query, ...req.body };
      await manager.handleProviderWebhook('exotel', payload);
      res.sendStatus(200);
    } catch (err) {
      console.error('Exotel webhook error:', err);
      res.sendStatus(500);
    }
  });

  return router;
}
