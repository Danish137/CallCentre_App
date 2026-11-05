import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { PinnedCard } from '../../types';
import styles from './PulseChannel.module.css';

interface PinnedInputCardProps {
  card: PinnedCard;
  onRespond: (optionId: string, replyText?: string) => void;
}

export const PinnedInputCard: React.FC<PinnedInputCardProps> = ({ card, onRespond }) => {
  const [customReply, setCustomReply] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);

  if (card.resolved) {
    return (
      <div className={`${styles.pinnedCard} ${styles.pinnedCardResolved}`}>
        <div className={styles.pinnedHeader}>
          <div className={`${styles.pinnedBadge} ${styles.pinnedBadgeResolved}`}>
            <CheckCircle2 size={15} />
            <span>Resolved · Action Taken</span>
          </div>
          <span style={{ fontSize: 11, color: '#16a34a' }}>
            {card.userResponse?.respondedAt}
          </span>
        </div>
        <div className={`${styles.pinnedTitle} ${styles.pinnedTitleResolved}`}>
          {card.title}
        </div>
        <div style={{ fontSize: 13, color: '#166534' }}>
          Response logged: <b>{card.userResponse?.optionId === 'commit' ? 'Committed to Opening Script' : 'Adjustment Requested'}</b>
          {card.userResponse?.replyText && ` ("${card.userResponse.replyText}")`}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pinnedCard}>
      <div className={styles.pinnedHeader}>
        <div className={styles.pinnedBadge}>
          <AlertCircle size={15} />
          <span>Needs Your Input · Manager Action Item</span>
        </div>
        <span style={{ fontSize: 11, color: '#92400e' }}>Pinned</span>
      </div>

      <div className={styles.pinnedTitle}>{card.title}</div>

      <div className={styles.pinnedDesc}>
        <b>👥 Stakeholders:</b> {card.stakeholders}<br />
        <b>📋 Issue Definition:</b> {card.issue}<br />
        <b>➡️ Suggested Resolution:</b> {card.suggestedResolution}
      </div>

      {/* Buttons */}
      <div className={styles.pinnedActionsRow}>
        {card.options.map((opt) => (
          <button
            key={opt.id}
            className={`${styles.pinnedOptionBtn} ${
              opt.id === 'commit' ? styles.pinnedOptionBtnPrimary : ''
            }`}
            onClick={() => onRespond(opt.id, customReply)}
          >
            {opt.label}
          </button>
        ))}

        <button
          className={styles.pinnedOptionBtn}
          onClick={() => setShowReplyBox(!showReplyBox)}
        >
          {showReplyBox ? 'Hide Note' : 'Add Note & Respond'}
        </button>
      </div>

      {showReplyBox && (
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Add explanation or note for Sunita Rao..."
            value={customReply}
            onChange={(e) => setCustomReply(e.target.value)}
            style={{ padding: '6px 14px', fontSize: 12.5 }}
          />
          <button
            className={styles.pinnedOptionBtnPrimary}
            style={{ padding: '6px 12px', fontSize: 12 }}
            onClick={() => onRespond('feedback', customReply)}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

