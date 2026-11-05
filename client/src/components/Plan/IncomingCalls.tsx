import React from 'react';
import { PhoneMissed, Phone, CheckCircle } from 'lucide-react';
import { IncomingCall } from '../../types';
import styles from './Plan.module.css';

interface IncomingCallsProps {
  incomingCalls: IncomingCall[];
  onInitiateCallback: (call: IncomingCall) => void;
}

export const IncomingCalls: React.FC<IncomingCallsProps> = ({
  incomingCalls,
  onInitiateCallback,
}) => {
  const totalValue = incomingCalls.reduce((sum, item) => sum + (item.expectedValue || 0), 0);

  if (incomingCalls.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 20px',
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e5e7eb',
        }}
      >
        <CheckCircle size={36} color="#10b981" style={{ margin: '0 auto 10px' }} />
        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>No missed calls!</div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          All incoming caller enquiries have been returned.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Summary Banner */}
      <div className={styles.incomingSummaryCard}>
        <div className={styles.sumItem}>
          <span className={styles.sumVal}>{incomingCalls.length}</span>
          <span className={styles.sumLbl}>Missed Today</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.sumItem}>
          <span className={`${styles.sumVal} ${styles.sumValGreen}`}>
            ₹{totalValue.toLocaleString('en-IN')}
          </span>
          <span className={styles.sumLbl}>Expected Value At Stake</span>
        </div>
      </div>

      {/* List of Missed Calls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {incomingCalls.map((item) => (
          <div key={item.id} className={styles.rowCard}>
            <div className={styles.rowHead} style={{ cursor: 'default' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#fdecec',
                  color: '#e24b4a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <PhoneMissed size={18} />
              </div>

              <div className={styles.leadInfo}>
                <div className={styles.leadNameRow}>
                  <span className={styles.leadName}>{item.name}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#b91c1c',
                      background: '#fee2e2',
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}
                  >
                    Missed Call
                  </span>
                </div>
                <div className={styles.leadSub}>
                  Missed {item.time} · {item.phone} {item.notes ? `· ${item.notes}` : ''}
                </div>
              </div>

              {/* Value at Stake */}
              <div className={styles.scoreBlock}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f6e56' }}>
                  ₹{item.expectedValue.toLocaleString('en-IN')}
                </div>
                <div className={styles.scoreLbl}>Value at stake</div>
              </div>

              {/* Action: Call Back on every row */}
              <button
                className={`${styles.actionBtn} ${styles.callBtn}`}
                onClick={() => onInitiateCallback(item)}
                title="Call back customer immediately"
              >
                <Phone size={13} />
                <span>Call back</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

