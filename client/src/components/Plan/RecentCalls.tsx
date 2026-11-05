import React, { useState } from 'react';
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, ChevronRight, CheckCircle2 } from 'lucide-react';
import { RecentCall } from '../../types';
import { CallSopReviewModal } from './CallSopReviewModal';
import styles from './Plan.module.css';

interface RecentCallsProps {
  recentCalls: RecentCall[];
}

export const RecentCalls: React.FC<RecentCallsProps> = ({ recentCalls }) => {
  const [selectedCall, setSelectedCall] = useState<RecentCall | null>(null);

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return { icon: PhoneIncoming, bg: '#e1f5ee', color: '#0f6e56' };
      case 'missed':
        return { icon: PhoneMissed, bg: '#fdecec', color: '#e24b4a' };
      default:
        return { icon: PhoneOutgoing, bg: '#e8f0fe', color: '#185fa5' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {recentCalls.map((call) => {
        const { icon: Icon, bg, color } = getCallIcon(call.type);

        return (
          <div key={call.id} className={styles.rowCard}>
            <div className={styles.rowHead} onClick={() => setSelectedCall(call)}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: bg,
                  color: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>

              <div className={styles.leadInfo}>
                <div className={styles.leadNameRow}>
                  <span className={styles.leadName}>{call.name}</span>
                  {call.outcome && (
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: '#0f6e56',
                        background: '#e1f5ee',
                        padding: '2px 8px',
                        borderRadius: 6,
                      }}
                    >
                      {call.outcome}
                    </span>
                  )}
                </div>
                <div className={styles.leadSub}>
                  {call.time} · Duration: <b>{call.duration}</b> · Tap to review QA score
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {call.score && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f6e56' }}>
                      {call.score}%
                    </div>
                    <div style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase' }}>
                      SOP Score
                    </div>
                  </div>
                )}
                <ChevronRight size={18} color="#94a3b8" />
              </div>
            </div>
          </div>
        );
      })}

      {selectedCall && (
        <CallSopReviewModal
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </div>
  );
};

