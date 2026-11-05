import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Pause,
  Play,
  PhoneOff,
  ChevronDown,
  ChevronUp,
  FileText,
  Volume2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { CallRecord } from '../../types';
import styles from './ActiveCallBanner.module.css';

interface ActiveCallBannerProps {
  activeCall: CallRecord;
  onEndCall: (callId: string) => void;
  liveTranscript?: Array<{ speaker: string; text: string; time: string; sop?: string }>;
}

export const ActiveCallBanner: React.FC<ActiveCallBannerProps> = ({
  activeCall,
  onEndCall,
  liveTranscript = [],
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isHeld, setIsHeld] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showTranscript, setShowTranscript] = useState(true);

  const isRinging =
    activeCall.status === 'ringing' ||
    activeCall.status === 'initiating' ||
    activeCall.status === 'queued';

  const isReal = activeCall.isRealCall;

  // Timer effect when connected
  useEffect(() => {
    if (activeCall.status !== 'in-progress') {
      setSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCall.status]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const sentimentScore = activeCall.sentimentScore || 75;
  const sentimentLabel = activeCall.sentiment || 'Positive';

  return (
    <div
      className={`${styles.bannerWrap} ${
        isRinging
          ? styles.bannerWrapRinging
          : isReal
          ? styles.bannerWrapReal
          : styles.bannerWrapSimulated
      }`}
    >
      <div className={styles.topRow}>
        {/* Left Info */}
        <div className={styles.leftInfo}>
          <div
            className={`${styles.callStatusBadge} ${
              isReal ? styles.badgeReal : styles.badgeSimulated
            }`}
          >
            {isReal ? (
              <Radio size={13} className={styles.pulseDot} />
            ) : (
              <AlertTriangle size={13} style={{ color: '#f59e0b' }} />
            )}
            <span>
              {isRinging
                ? isReal
                  ? 'DIALING CARRIER NETWORK…'
                  : 'SIMULATING RINGING…'
                : isReal
                ? `LIVE PSTN (${activeCall.provider.toUpperCase()})`
                : 'SIMULATED CALL (DEV MODE)'}
            </span>
          </div>

          <div>
            <div className={styles.customerName}>
              {activeCall.leadName}
              <span className={styles.callTypeTag}>
                {isReal ? '● Real Phone Call' : '● Synthetic Test'}
              </span>
            </div>
            <div className={styles.customerPhone}>
              Target: <b>{activeCall.customerPhone}</b>
              {activeCall.agentPhone && ` · Agent Leg: ${activeCall.agentPhone}`}
            </div>
          </div>
        </div>

        {/* Center Timer & Sentiment */}
        <div className={styles.centerMetrics}>
          <div className={styles.timerBox}>
            {isRinging ? 'Connecting…' : formatTimer(seconds)}
          </div>

          {!isRinging && (
            <div className={styles.sentimentBox}>
              <span className={styles.sentimentLabel}>Sentiment</span>
              <div className={styles.sentimentBarWrap}>
                <div
                  className={styles.sentimentBarFill}
                  style={{
                    width: `${sentimentScore}%`,
                    backgroundColor:
                      sentimentScore > 70 ? '#34d399' : sentimentScore > 40 ? '#fbbf24' : '#f87171',
                  }}
                />
              </div>
              <span
                className={styles.sentimentVal}
                style={{
                  color:
                    sentimentScore > 70 ? '#34d399' : sentimentScore > 40 ? '#fbbf24' : '#f87171',
                }}
              >
                {sentimentLabel} ({sentimentScore}%)
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={styles.controlsRow}>
          <button
            className={`${styles.controlBtn} ${isMuted ? styles.controlBtnActive : ''}`}
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <button
            className={`${styles.controlBtn} ${isHeld ? styles.controlBtnActive : ''}`}
            onClick={() => setIsHeld(!isHeld)}
            title={isHeld ? 'Resume call' : 'Put on hold'}
          >
            {isHeld ? <Play size={18} /> : <Pause size={18} />}
          </button>

          <button
            className={styles.endCallBtn}
            onClick={() => onEndCall(activeCall.id)}
            title="End call & submit wrap-up"
          >
            <PhoneOff size={20} />
          </button>

          <button
            className={styles.transcriptToggleBtn}
            onClick={() => setShowTranscript(!showTranscript)}
            title="Toggle transcript panel"
          >
            <FileText size={15} />
            <span>Transcript</span>
            {showTranscript ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Distinction Banner / Notice */}
      {!isReal && (
        <div className={styles.simulatedNoticeBanner}>
          <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
          <span>
            <b>Dev Simulator Active:</b> No real telecom provider dialed. Audio, duration, and dialogue below are synthetic for interface testing. To make physical calls ring on actual handsets, configure Exotel or Twilio in your <code>.env</code> file.
          </span>
        </div>
      )}

      {/* Live Audio Transcript Stream */}
      {showTranscript && (
        <div className={styles.transcriptDrawer}>
          <div className={styles.transcriptHeader}>
            <div className={styles.liveIndicator}>
              <Volume2 size={14} />
              <span>
                {isReal
                  ? 'LIVE SPEECH RECOGNITION (TELECOM CARRIER STREAM)'
                  : 'SIMULATED DIALOGUE STREAM (DEV SANDBOX)'}
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              {liveTranscript.length} dialogue turns logged · {isReal ? 'Carrier Audio Feed' : 'Synthetic Feed'}
            </span>
          </div>

          {liveTranscript.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic', padding: '6px 0' }}>
              {isReal
                ? 'Streaming audio from carrier bridge… Speech recognition listening…'
                : 'Waiting for simulated dialogue script turns…'}
            </div>
          ) : (
            liveTranscript.map((t, idx) => (
              <div key={idx} className={styles.transcriptLine}>
                <div className={styles.lineMeta}>
                  <span
                    className={
                      t.speaker.toLowerCase() === 'agent' || t.speaker.toLowerCase() === 'you'
                        ? styles.speakerAgent
                        : styles.speakerCustomer
                    }
                  >
                    {t.speaker.toUpperCase()}
                  </span>
                  <span style={{ color: '#64748b' }}>{t.time}</span>
                  {t.sop && <span className={styles.sopTag}>{t.sop}</span>}
                </div>
                <div className={styles.lineText}>{t.text}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
