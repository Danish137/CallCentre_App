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

  const isRinging = activeCall.status === 'ringing' || activeCall.status === 'initiating' || activeCall.status === 'queued';

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
    <div className={`${styles.bannerWrap} ${isRinging ? styles.bannerWrapRinging : ''}`}>
      <div className={styles.topRow}>
        {/* Left Info */}
        <div className={styles.leftInfo}>
          <div className={styles.callStatusBadge}>
            <span className={`${styles.pulseDot} ${isRinging ? styles.pulseDotRinging : ''}`} />
            <span>{isRinging ? 'RINGING / CONNECTING' : 'CALL IN PROGRESS'}</span>
          </div>
          <div>
            <div className={styles.customerName}>{activeCall.leadName}</div>
            <div className={styles.customerPhone}>{activeCall.customerPhone}</div>
          </div>
          <span className={styles.providerTag}>
            {activeCall.isRealCall ? `Real PSTN: ${activeCall.provider.toUpperCase()}` : 'Dev Simulator'}
          </span>
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
            title="Toggle live transcript"
          >
            <FileText size={15} />
            <span>Live Transcript</span>
            {showTranscript ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Live Audio Transcript Stream */}
      {showTranscript && (
        <div className={styles.transcriptDrawer}>
          <div className={styles.transcriptHeader}>
            <div className={styles.liveIndicator}>
              <Volume2 size={14} />
              <span>Real-time Speech Recognition (AI-Assisted)</span>
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              {liveTranscript.length} dialogue turns logged
            </span>
          </div>

          {liveTranscript.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic', padding: '6px 0' }}>
              Waiting for audio stream speech detection…
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

