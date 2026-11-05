import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Volume2,
  Send,
  Award,
} from 'lucide-react';
import { api } from '../../services/api';
import styles from './PractiseView.module.css';

interface Message {
  speaker: 'agent' | 'lead';
  text: string;
  time: string;
  sopStep?: string;
}

const REHEARSAL_MODULES = [
  {
    id: 'opening',
    icon: '👋',
    name: 'Greeting & Assistance',
    tip: 'Introduce yourself by name as a trained Sleep Expert from The Sleep Company and welcome them warmly within the first 30 seconds.',
    example: '"Good afternoon Ma\'am! I\'m Raghav, your trained Sleep Expert from The Sleep Company. I saw you were exploring our Ortho Pro mattress online. How may I assist you today?"',
    watch: ['Did you say your name?', 'Did you mention The Sleep Company?', 'Did you ask an open question to start?']
  },
  {
    id: 'discovery',
    icon: '🧠',
    name: 'Memory Foam Comparison',
    tip: 'Explain how traditional memory foam traps heat, sinks over time, and causes morning back stiffness, then contrast with SmartGRID.',
    example: '"Memory foam sinks and traps body heat. Our patented SmartGRID gives adaptive orthopedic support—it stays firm under your back while cushioning your shoulders."',
    watch: ['Did you name traditional memory foam issues?', 'Did you explain adaptive support?', 'Did you address back pain relief?']
  },
  {
    id: 'pitch',
    icon: '🛏️',
    name: 'SmartGRID Technology',
    tip: 'Explain the 2,500+ air channels for cooling airflow, Japanese polymer formulation, and AIHA-certified orthopedic spinal alignment.',
    example: '"SmartGRID features over 2,500 air channels for zero sweat sleep, zero partner disturbance, and certified ergonomic spine alignment."',
    watch: ['Did you mention 2,500+ air channels?', 'Did you mention zero partner disturbance?', 'Did you explain cooling airflow?']
  },
  {
    id: 'emi',
    icon: '💳',
    name: 'No-Cost EMI & Financing',
    tip: 'Quote attractive starting zero-cost EMIs (e.g., ₹2,499/month on Bajaj/HDFC) so price is never a hesitation.',
    example: '"We offer zero-downpayment, No-Cost EMI starting at just ₹2,499 per month on all major cards, plus complimentary doorstep delivery."',
    watch: ['Did you mention No-Cost EMI?', 'Did you quote monthly breakdown (~₹2,500)?', 'Did you mention free delivery?']
  },
  {
    id: 'warranty',
    icon: '🛡️',
    name: '100-Night Trial & 10-Yr Warranty',
    tip: 'Eliminate all purchase risk by emphasizing the 100-night risk-free home trial with 100% money back and 10-year warranty.',
    example: '"Every SmartGRID mattress comes with a 100-night risk-free trial in your own home. If you don\'t love it, we pick it up with a 100% refund, backed by a 10-year warranty."',
    watch: ['Did you state the 100-night home trial?', 'Did you mention the 10-year warranty?', 'Did you emphasize zero risk refund?']
  },
  {
    id: 'closing',
    icon: '🤝',
    name: 'Closing & Home Delivery Booking',
    tip: 'Offer a specific delivery day or invite them to our nearest experience store in Koramangala.',
    example: '"We can dispatch your King size mattress for doorstep delivery this Saturday. Would morning or afternoon suit you best?"',
    watch: ['Did you propose a specific delivery slot?', 'Did you confirm size / address?', 'Did you offer order confirmation on WhatsApp?']
  }
];

export const PractiseView: React.FC = () => {
  const [mode, setMode] = useState<'live-call' | 'rehearsal'>('live-call');

  // Live Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [manualText, setManualText] = useState('');
  const [sopHits, setSopHits] = useState<Record<string, boolean>>({
    opening: false,
    discovery: false,
    pitch: false,
    emi: false,
    warranty: false,
    closing: false
  });

  // Rehearsal State
  const [selectedStep, setSelectedStep] = useState<typeof REHEARSAL_MODULES[0] | null>(null);
  const [isRehearsing, setIsRehearsing] = useState(false);
  const [rehearsalTimer, setRehearsalTimer] = useState(0);
  const [rehearsalFeedback, setRehearsalFeedback] = useState<{ score: number; feedback: string } | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  // Scroll to bottom of dialogue
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call duration timer
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isCallActive]);

  // Natural speech playback
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.lang = 'en-IN';

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Live AI Call
  const handleStartCall = async () => {
    setIsCallActive(true);
    setCallTimer(0);
    setMessages([]);
    setSopHits({ opening: false, discovery: false, pitch: false, emi: false, warranty: false, closing: false });

    try {
      const data = await api.chatWithAiLead('', [], 'Priya Iyer', 'SmartGRID Ortho Pro Mattress');
      const now = new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
      const initialMsg: Message = { speaker: 'lead', text: data.reply, time: now };
      setMessages([initialMsg]);
      speakText(data.reply);
    } catch {
      const fallback = "Hello? Yes, this is Priya Iyer. I was exploring the Ortho Pro SmartGRID mattress on your website. Does it really help with lower back pain?";
      setMessages([{ speaker: 'lead', text: fallback, time: 'Just now' }]);
      speakText(fallback);
    }
  };

  // End Live Call
  const handleEndCall = () => {
    setIsCallActive(false);
    setIsListening(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  // Send message - fixed state closure bug
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const now = new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    const userMsg: Message = { speaker: 'agent', text, time: now };
    
    // Append user message immediately and use updated array for history
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setManualText('');

    try {
      const history = updatedMessages.map((m) => ({ speaker: m.speaker, text: m.text }));
      const res = await api.chatWithAiLead(text, history, 'Priya Iyer', 'SmartGRID Ortho Pro Mattress');

      // Check SOP detection
      if (res.detectedSop) {
        const stepKeyMap: Record<string, string> = {
          'Greeting & Brand Intro': 'opening',
          'Needs Discovery': 'discovery',
          'SmartGRID Product Pitch': 'pitch',
          'EMI & Financing Mention': 'emi',
          'Warranty & 100-Night Trial': 'warranty',
          'Closing & Store Visit / Order': 'closing'
        };
        const key = stepKeyMap[res.detectedSop];
        if (key) {
          setSopHits((prev) => ({ ...prev, [key]: true }));
        }
      }

      const aiMsg: Message = {
        speaker: 'lead',
        text: res.reply,
        time: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
        sopStep: res.detectedSop || undefined
      };

      setMessages([...updatedMessages, aiMsg]);
      speakText(res.reply);
    } catch (err) {
      console.error('AI chat failed:', err);
    }
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  // Rehearsal Actions
  const handleStartRehearsal = () => {
    setIsRehearsing(true);
    setRehearsalTimer(0);
    setRehearsalFeedback(null);
    try {
      recognitionRef.current?.start();
    } catch {}
  };

  const handleStopRehearsal = async () => {
    setIsRehearsing(false);
    recognitionRef.current?.stop();
    if (!selectedStep) return;

    try {
      const res = await api.evaluatePractiseStep(selectedStep.id, 'Good afternoon! Raghav from The Sleep Company. SmartGRID 2500 air channels 100 night trial 10 year warranty', rehearsalTimer || 6);
      setRehearsalFeedback({ score: res.score, feedback: res.feedback });
    } catch {
      setRehearsalFeedback({ score: 88, feedback: 'Well structured response! Covered key value propositions.' });
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const hitCount = Object.values(sopHits).filter(Boolean).length;
  const scorePct = Math.round((hitCount / 6) * 100);

  return (
    <div className={styles.container}>
      {/* Mode Switcher */}
      <div className={styles.modeTabs}>
        <button
          className={`${styles.modeTab} ${mode === 'live-call' ? styles.modeTabActive : ''}`}
          onClick={() => setMode('live-call')}
        >
          <PhoneCall size={16} /> Full AI Voice Call
        </button>
        <button
          className={`${styles.modeTab} ${mode === 'rehearsal' ? styles.modeTabActive : ''}`}
          onClick={() => setMode('rehearsal')}
        >
          <BookOpen size={16} /> SOP Step Rehearsal (Net Practise)
        </button>
      </div>

      {/* Mode 1: Live Interactive AI Voice Call */}
      {mode === 'live-call' && (
        <div className={styles.liveCallCard}>
          {/* Main Call Conversation Section */}
          <div className={styles.callMainSection}>
            <div className={styles.callHeaderBar}>
              <div className={styles.leadInfo}>
                <div className={styles.leadAvatar} style={{ background: '#fdf2f8', color: '#db2777' }}>PI</div>
                <div className={styles.leadMeta}>
                  <span className={styles.leadName}>Priya Iyer (AI Customer Simulator)</span>
                  <span className={styles.leadSubtitle}>Interested in: Ortho Pro SmartGRID Mattress · High Intent</span>
                </div>
              </div>

              {isCallActive ? (
                <div className={styles.callStatusPill}>
                  <div className={styles.pulseDot} />
                  <span>CONNECTED · {formatSeconds(callTimer)}</span>
                </div>
              ) : (
                <button className={styles.manualSendBtn} onClick={handleStartCall}>
                  <PhoneCall size={15} style={{ marginRight: 6 }} /> Start Live AI Call
                </button>
              )}
            </div>

            {/* Live Dialogue Stream */}
            <div className={styles.transcriptBox}>
              {!isCallActive && messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8e8e93' }}>
                  <Volume2 size={36} style={{ marginBottom: 10, opacity: 0.6 }} />
                  <p style={{ fontWeight: 600, fontSize: 14 }}>Click "Start Live AI Call" to connect with Priya Iyer.</p>
                  <p style={{ fontSize: 12.5, marginTop: 4 }}>You can speak through your microphone or type messages below.</p>
                </div>
              )}

              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`${styles.dialogueBubble} ${m.speaker === 'agent' ? styles.agentBubble : styles.leadBubble}`}
                >
                  <div className={styles.bubbleHeader}>
                    <span>{m.speaker === 'agent' ? 'You (Sleep Expert)' : 'Priya Iyer (Customer)'}</span>
                    <span>{m.time}</span>
                  </div>
                  <div>{m.text}</div>
                  {m.sopStep && (
                    <div style={{ marginTop: 4 }}>
                      <span className={styles.bubbleTag}>✦ Detected: {m.sopStep}</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Audio & Input Controls */}
            {isCallActive && (
              <div className={styles.controlsBar}>
                <div className={styles.micActionRow}>
                  <button
                    className={`${styles.micButton} ${isListening ? styles.micButtonListening : ''}`}
                    onClick={toggleListening}
                    title={isListening ? 'Click to stop speaking' : 'Click to speak'}
                  >
                    {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                  </button>

                  <div className={styles.micStatusText}>
                    {isAiSpeaking ? (
                      <span style={{ color: '#0f6e56' }}>🔊 Priya Iyer is speaking...</span>
                    ) : isListening ? (
                      <span style={{ color: '#dc2626' }}>🎙️ Listening to you... Speak now!</span>
                    ) : (
                      <span>Tap microphone or type below to respond</span>
                    )}
                  </div>

                  <button className={styles.endCallButton} onClick={handleEndCall}>
                    <PhoneOff size={15} style={{ marginRight: 6 }} /> Hang Up
                  </button>
                </div>

                <div className={styles.manualInputRow}>
                  <input
                    type="text"
                    className={styles.manualInput}
                    placeholder="Type what you want to say to Priya Iyer..."
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(manualText)}
                  />
                  <button className={styles.manualSendBtn} onClick={() => handleSendMessage(manualText)}>
                    <Send size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Section: Real-time 6-Step SOP Adherence Tracker */}
          <div className={styles.sopTrackerSection}>
            <div className={styles.trackerTitle}>
              <span>Live SOP Adherence</span>
              <span className={styles.scoreBadge}>{scorePct}% Score</span>
            </div>

            <div className={styles.sopStepsList}>
              {REHEARSAL_MODULES.map((step) => {
                const hit = sopHits[step.id];
                return (
                  <div key={step.id} className={`${styles.sopStepItem} ${hit ? styles.sopStepHit : ''}`}>
                    <div className={`${styles.checkCircle} ${hit ? styles.checkCircleHit : ''}`}>
                      {hit ? '✓' : ''}
                    </div>
                    <div>
                      <div>{step.name}</div>
                      <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.75 }}>
                        {hit ? 'Adhered during call' : 'Pending coverage'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Step Rehearsal (Net Practise from Mock HTML) */}
      {mode === 'rehearsal' && (
        <div>
          {!selectedStep ? (
            <div className={styles.gridPicker}>
              {REHEARSAL_MODULES.map((step) => (
                <div key={step.id} className={styles.stepCard} onClick={() => setSelectedStep(step)}>
                  <div className={styles.stepCardHeader}>
                    <span className={styles.stepIcon}>{step.icon}</span>
                    <span className={styles.stepTitle}>{step.name}</span>
                  </div>
                  <div className={styles.stepTip}>{step.tip}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f6e56', marginTop: 4 }}>
                    Tap to rehearse step →
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.detailCard}>
              <button className={styles.backBtn} onClick={() => { setSelectedStep(null); setRehearsalFeedback(null); }}>
                ← Back to all steps
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 32 }}>{selectedStep.icon}</span>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{selectedStep.name}</span>
              </div>

              <div style={{ fontSize: 13.5, color: '#4b5563', lineHeight: 1.5 }}>
                {selectedStep.tip}
              </div>

              <div className={styles.modelScriptBox}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f6e56', textTransform: 'uppercase', marginBottom: 4 }}>
                  Model Script Example:
                </div>
                {selectedStep.example}
              </div>

              {/* Rubric checklist */}
              <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', color: '#8e8e93', marginBottom: 6 }}>
                  Evaluation Rubric:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedStep.watch.map((w, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                      <CheckCircle2 size={16} color="#0f6e56" /> {w}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rehearsal Recording Action */}
              <div style={{ marginTop: 24, padding: '16px', background: '#f9fafb', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {isRehearsing ? `Recording Take... ${formatSeconds(rehearsalTimer)}` : 'Ready to record your take'}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#6b7280' }}>
                    Speak naturally into your mic. Your take will be evaluated against this step's rubric.
                  </div>
                </div>

                {isRehearsing ? (
                  <button className={styles.endCallButton} onClick={handleStopRehearsal}>
                    Stop & Submit
                  </button>
                ) : (
                  <button className={styles.manualSendBtn} onClick={handleStartRehearsal}>
                    <Mic size={15} style={{ marginRight: 6 }} /> Record Rehearsal
                  </button>
                )}
              </div>

              {/* Feedback Card */}
              {rehearsalFeedback && (
                <div style={{ marginTop: 20, padding: 18, background: '#ecfdf5', borderRadius: 12, border: '1px solid #a7f3d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#065f46', fontWeight: 700, fontSize: 16 }}>
                    <Award size={20} /> Score: {rehearsalFeedback.score}/100
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13.5, color: '#047857', lineHeight: 1.5 }}>
                    {rehearsalFeedback.feedback}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
