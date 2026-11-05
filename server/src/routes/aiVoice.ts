import { Router, Request, Response } from 'express';

export function createAiVoiceRouter(): Router {
  const router = Router();

  // The Sleep Company 6 SOP Checkpoints
  const SOP_CHECKPOINTS = [
    { id: 'opening', name: 'Greeting & Brand Intro', keywords: ['hello', 'speaking', 'raghav', 'arvind', 'sleep company', 'sleep expert', 'enquiry', 'called regarding', 'welcome'] },
    { id: 'discovery', name: 'Needs Discovery', keywords: ['back pain', 'current mattress', 'memory foam', 'posture', 'sleep', 'king', 'queen', 'size', 'sinking', 'firm', 'soft'] },
    { id: 'pitch', name: 'SmartGRID Product Pitch', keywords: ['smartgrid', 'grid', 'ortho pro', 'air channels', 'cooling', 'patented', 'adaptive', 'spine', 'alignment', 'circulation'] },
    { id: 'emi', name: 'EMI & Financing Mention', keywords: ['emi', '2499', 'zero cost', 'no cost', 'financing', 'bajaj', 'hdfc', 'monthly', 'downpayment', 'scheme'] },
    { id: 'warranty', name: 'Warranty & 100-Night Trial', keywords: ['10 year', 'warranty', '100 night', 'trial', 'risk free', 'return', 'guarantee', 'replacement'] },
    { id: 'closing', name: 'Closing & Store Visit / Order', keywords: ['store', 'koramangala', 'experience', 'order', 'delivery', 'slot', 'tomorrow', 'weekend', 'book', 'whatsapp'] }
  ];

  /**
   * POST /api/ai/chat
   * Interactive voice call dialogue with AI Customer (The Sleep Company)
   */
  router.post('/chat', async (req: Request, res: Response) => {
    try {
      const { message, history = [], customerName = 'Priya Iyer', productInterest = 'SmartGRID Ortho Pro Mattress' } = req.body;
      const userText = (message || '').trim();

      // Check if user has GEMINI_API_KEY configured
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (geminiApiKey) {
        try {
          const systemPrompt = `You are ${customerName}, a customer speaking on the phone with a Sleep Expert from The Sleep Company.
You are interested in the ${productInterest} because your current memory foam mattress is causing you lower back pain and traps heat at night.
Keep your responses short, natural, and conversational (1 to 2 sentences max) as on a real phone call.
If the agent greets you or explains SmartGRID, ask about back pain relief, heat dissipation, 100-night trial, and zero-cost EMI.
Do NOT repeat the same response twice. Answer directly what the agent says.`;

          const contents = [
            { role: 'user', parts: [{ text: systemPrompt }] },
            ...history.map((h: { speaker: string; text: string }) => ({
              role: h.speaker === 'agent' ? 'user' : 'model',
              parts: [{ text: h.text }]
            })),
            { role: 'user', parts: [{ text: userText || 'Hello' }] }
          ];

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 100, temperature: 0.7 } })
            }
          );

          if (response.ok) {
            const data: any = await response.json();
            const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiReply) {
              const detectedSop = detectSopStep(userText, SOP_CHECKPOINTS);
              return res.json({ reply: aiReply.trim(), detectedSop });
            }
          }
        } catch (err) {
          console.warn('Gemini API call failed, falling back to local Sleep Company engine:', err);
        }
      }

      // Dynamic domain-specific conversational engine for The Sleep Company
      const { reply, detectedSop } = generateSleepCompanyCustomerResponse(userText, history, customerName, productInterest, SOP_CHECKPOINTS);
      return res.json({ reply, detectedSop });
    } catch (err: any) {
      console.error('AI chat error:', err);
      return res.status(500).json({ error: 'Failed to process AI conversation' });
    }
  });

  /**
   * POST /api/ai/evaluate-step
   * Score an agent's rehearsed SOP take against The Sleep Company rubric
   */
  router.post('/evaluate-step', (req: Request, res: Response) => {
    const { stepId, transcript, durationSeconds = 5 } = req.body;
    const text = (transcript || '').toLowerCase();

    const checkpoint = SOP_CHECKPOINTS.find((c) => c.id === stepId) || SOP_CHECKPOINTS[0];
    const hitKeywords = checkpoint.keywords.filter((kw) => text.includes(kw.toLowerCase()));

    const keywordScore = Math.min(60, hitKeywords.length * 20);
    const lengthScore = Math.min(30, Math.max(10, Math.floor(durationSeconds * 3)));
    const baseScore = keywordScore + lengthScore + 10;
    const finalScore = Math.min(96, Math.max(45, baseScore));

    const feedback =
      finalScore >= 80
        ? `Excellent delivery! You naturally highlighted key points (${hitKeywords.join(', ') || 'clear tone'}) adhering to The Sleep Company SOP.`
        : `Good attempt. Try to clearly mention core benefits like ${checkpoint.keywords.slice(0, 3).join(', ')} to maximize script adherence.`;

    res.json({
      score: finalScore,
      checkpoint: checkpoint.name,
      hits: hitKeywords,
      feedback
    });
  });

  return router;
}

function detectSopStep(text: string, checkpoints: any[]): string | null {
  const lower = text.toLowerCase();
  for (const cp of checkpoints) {
    if (cp.keywords.some((k: string) => lower.includes(k.toLowerCase()))) {
      return cp.name;
    }
  }
  return null;
}

function generateSleepCompanyCustomerResponse(
  userText: string,
  history: Array<{ speaker: string; text: string }>,
  customerName: string,
  productInterest: string,
  checkpoints: any[]
): { reply: string; detectedSop: string | null } {
  const lower = userText.toLowerCase().trim();
  const step = detectSopStep(userText, checkpoints);
  const turnCount = history.filter((h) => h.speaker === 'agent').length;

  // Initial call start (agent hasn't spoken yet or greeting)
  if (!userText || userText.length === 0) {
    return {
      reply: `Hello? Yes, this is ${customerName}. I requested a callback on your website regarding the Ortho Pro SmartGRID mattress. Does it really help with lower back pain?`,
      detectedSop: 'Greeting & Brand Intro'
    };
  }

  // If user says something completely irrelevant / off-topic
  if (lower.includes('litre') || lower.includes('km') || lower.includes('car') || lower.includes('mileage') || lower.includes('petrol')) {
    return {
      reply: `Wait, are you talking about a car? I was inquiring about a mattress for my back pain from The Sleep Company haha! Could you tell me about the SmartGRID technology?`,
      detectedSop: step
    };
  }

  // Greeting & name introduction
  if (turnCount === 0 || lower.includes('raghav') || lower.includes('arvind') || lower.includes('sleep company') || lower.includes('good morning') || lower.includes('good afternoon')) {
    return {
      reply: `Thanks for calling back. My current memory foam mattress sinks too much and my lower back aches every morning. How is your SmartGRID different?`,
      detectedSop: 'Needs Discovery'
    };
  }

  // Product Pitch: SmartGRID vs Memory Foam, Cooling, Pressure relief
  if (lower.includes('smartgrid') || lower.includes('grid') || lower.includes('foam') || lower.includes('air') || lower.includes('spine') || lower.includes('cooling') || lower.includes('ortho')) {
    return {
      reply: `That makes a lot of sense—adaptive support without sinking. But what if it feels too firm or too soft after sleeping on it at home? Do you offer a home trial?`,
      detectedSop: 'SmartGRID Product Pitch'
    };
  }

  // Warranty & 100-Night Trial
  if (lower.includes('trial') || lower.includes('100 night') || lower.includes('warranty') || lower.includes('10 year') || lower.includes('return') || lower.includes('guarantee')) {
    return {
      reply: `A 100-night risk-free trial and 10-year warranty gives me genuine confidence. What does the King size cost, and do you have any no-cost EMI options?`,
      detectedSop: 'Warranty & 100-Night Trial'
    };
  }

  // EMI & Pricing
  if (lower.includes('emi') || lower.includes('2499') || lower.includes('price') || lower.includes('cost') || lower.includes('zero cost') || lower.includes('month') || lower.includes('discount')) {
    return {
      reply: `Zero-cost EMI around ₹2,500 per month fits my budget nicely. Can you arrange free doorstep delivery to my apartment in Koramangala this weekend?`,
      detectedSop: 'EMI & Financing Mention'
    };
  }

  // Closing & Delivery / Store Visit
  if (lower.includes('delivery') || lower.includes('weekend') || lower.includes('saturday') || lower.includes('sunday') || lower.includes('store') || lower.includes('visit') || lower.includes('order') || lower.includes('book')) {
    return {
      reply: `Saturday between 2 PM and 5 PM works great for delivery. Please share the order confirmation and payment link on my WhatsApp. Thank you so much!`,
      detectedSop: 'Closing & Store Visit / Order'
    };
  }

  // General conversational progression based on turn count
  const dynamicReplies = [
    `I see. What size options do you recommend for a master bedroom—King size or Queen size?`,
    `And does the mattress include a washable cover, or do I need to buy a separate mattress protector?`,
    `Sounds great. How soon can it be dispatched if I confirm the order today?`
  ];

  const fallbackIdx = Math.min(turnCount % dynamicReplies.length, dynamicReplies.length - 1);
  return {
    reply: dynamicReplies[fallbackIdx],
    detectedSop: step
  };
}
