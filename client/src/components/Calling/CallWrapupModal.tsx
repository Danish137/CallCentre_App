import React, { useState } from 'react';
import { Check, ThumbsUp, Calendar, PhoneForwarded, CheckCircle2, ThumbsDown } from 'lucide-react';
import styles from './CallWrapupModal.module.css';

interface CallWrapupModalProps {
  callId: string;
  customerName: string;
  onSave: (outcome: string, notes: string) => void;
}

export const CallWrapupModal: React.FC<CallWrapupModalProps> = ({
  customerName,
  onSave,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState('Interested');
  const [notes, setNotes] = useState('');

  const outcomes = [
    { key: 'Interested', label: 'Interested', icon: ThumbsUp, color: '#0f6e56' },
    { key: 'Follow-up needed', label: 'Follow-up needed', icon: Calendar, color: '#c8860a' },
    { key: 'Requested callback', label: 'Requested callback', icon: PhoneForwarded, color: '#185fa5' },
    { key: 'Resolved', label: 'Resolved', icon: CheckCircle2, color: '#1d9e75' },
    { key: 'Not interested', label: 'Not interested', icon: ThumbsDown, color: '#e24b4a' },
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>Call Wrap-up</div>
            <div className={styles.subtitle}>{customerName} · Log outcome & notes</div>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.sectionLabel}>Select Call Outcome</div>
          <div className={styles.outcomesGrid}>
            {outcomes.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedOutcome === item.key;
              return (
                <button
                  key={item.key}
                  className={`${styles.outcomeBtn} ${isSelected ? styles.outcomeBtnSelected : ''}`}
                  onClick={() => setSelectedOutcome(item.key)}
                >
                  <Icon size={16} color={isSelected ? '#0f6e56' : item.color} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.sectionLabel}>Call Notes & Commitments</div>
          <textarea
            className={styles.textarea}
            placeholder="e.g. Customer asked for 12-month zero-interest EMI link on WhatsApp. Sent quote for ₹8,490."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={styles.footer}>
          <button
            className={styles.saveBtn}
            onClick={() => onSave(selectedOutcome, notes)}
          >
            <Check size={16} />
            <span>Save Wrap-up & Return</span>
          </button>
        </div>
      </div>
    </div>
  );
};

