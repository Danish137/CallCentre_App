import { Router, Request, Response } from 'express';
import { PULSE_DATA } from '../data/mockData.js';

export function createPulseRouter(): Router {
  const router = Router();

  // Get pulse home overview
  router.get('/overview', (req: Request, res: Response) => {
    res.json({
      channels: PULSE_DATA.channels,
      agents: PULSE_DATA.agents,
      kudos: PULSE_DATA.kudos,
    });
  });

  // Get channel thread
  router.get('/channels/:channelId', (req: Request, res: Response) => {
    const channelId = String(req.params.channelId);
    const thread = (PULSE_DATA.threads as any)[channelId] || {
      title: `#${channelId}`,
      dateLabel: `Today · #${channelId}`,
      messages: [],
    };
    res.json(thread);
  });

  // Send message in channel
  router.post('/channels/:channelId/messages', (req: Request, res: Response) => {
    const channelId = String(req.params.channelId);
    const { text, who, isSelf } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    if (!(PULSE_DATA.threads as any)[channelId]) {
      (PULSE_DATA.threads as any)[channelId] = {
        title: `#${channelId}`,
        dateLabel: `Today · #${channelId}`,
        messages: [],
      };
    }

    const thread = (PULSE_DATA.threads as any)[channelId];
    const newMsg = {
      id: `msg_${Date.now()}`,
      who: who || 'You',
      init: 'AR',
      isSelf: isSelf !== false,
      isBot: false,
      bg: '#1d9e75',
      color: '#ffffff',
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    thread.messages.push(newMsg);

    // If posting to avani-coaching, generate smart AI response
    if (channelId === 'avani-coaching') {
      setTimeout(() => {
        thread.messages.push({
          id: `msg_ai_${Date.now()}`,
          who: 'Avani',
          init: '✨',
          isSelf: false,
          isBot: true,
          bg: '#e1f5ee',
          color: '#0f6e56',
          text: `Got it Arvind. I noticed you handled the greeting smoothly on your last call. Keep emphasizing the 100-night risk-free trial when customers ask about pricing.`,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        });
      }, 1000);
    }

    res.json({ success: true, message: newMsg });
  });

  // Answer pinned "Needs your input" card
  router.post('/channels/:channelId/pinned-card/respond', (req: Request, res: Response) => {
    const channelId = String(req.params.channelId);
    const { responseOptionId, replyText } = req.body;

    const thread = (PULSE_DATA.threads as any)[channelId];
    if (thread && thread.pinnedCard) {
      thread.pinnedCard.resolved = true;
      thread.pinnedCard.userResponse = {
        optionId: responseOptionId,
        replyText,
        respondedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };

      // Add as conversation message too
      thread.messages.push({
        id: `msg_resp_${Date.now()}`,
        who: 'You',
        init: 'AR',
        isSelf: true,
        isBot: false,
        bg: '#1d9e75',
        color: '#ffffff',
        text: `✅ <b>Action Taken on Pinned Card:</b> ${responseOptionId === 'commit' ? 'Committed to Opening Script' : 'Requested Script Adjustment'}${replyText ? `<br><i>Note: ${replyText}</i>` : ''}`,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      });

      return res.json({ success: true, pinnedCard: thread.pinnedCard });
    }

    res.status(404).json({ error: 'Pinned card not found' });
  });

  return router;
}
