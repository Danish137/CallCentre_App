import React from 'react';
import { PhoneOutgoing, X, CheckCircle2 } from 'lucide-react';
import { Lead } from '../../types';
import styles from './PreCallSopModal.module.css';

interface PreCallSopModalProps {
  lead: Lead;
  onConfirmCall: () => void;
  onClose: () => void;
}

export const PreCallSopModal: React.FC<PreCallSopModalProps> = ({
  lead,
  onConfirmCall,
  onClose,
}) => {
  const sopChecks = lead.sopChecks || [
    { title: 'Quotation Demanded', sub: 'Asked for pricing / EMI breakdown on Ortho GRID', hit: true },
    { title: 'Financing Related', sub: 'Price-sensitive — lead with 12m zero-interest plan', hit: true },
    { title: 'Warranty Related', sub: 'Mention 100-night trial and 10-year warranty proactively', hit: true },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headLeft}>
            <div
              className={styles.avatar}
              style={{ background: lead.avatarBg, color: lead.avatarColor }}
            >
              {lead.initials}
            </div>
            <div>
              <div className={styles.title}>Before you call {lead.name}</div>
              <div className={styles.subtitle}>Lead SOP parameters & guidance checklist</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.productCard}>
            <div className={styles.productLabel}>Target Product & Interest</div>
            <div className={styles.productName}>{lead.product}</div>
            <div style={{ fontSize: 13, color: '#059669', fontWeight: 700, marginTop: 4 }}>
              Expected Value: ₹{lead.expectedValue.toLocaleString('en-IN')}
            </div>
          </div>

          <div className={styles.sopSectionTitle}>Key Talking Points & Objections</div>
          <div className={styles.checklist}>
            {sopChecks.map((item, idx) => (
              <div key={idx} className={styles.checkItem}>
                <div className={styles.checkIcon}>
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className={styles.checkTitle}>{item.title}</div>
                  <div className={styles.checkSub}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {lead.notes && lead.notes.length > 0 && (
            <div>
              <div className={styles.sopSectionTitle}>Call Preparation Notes</div>
              <ul style={{ paddingLeft: 18, fontSize: 13, color: '#475569', marginTop: 6, lineHeight: 1.5 }}>
                {lead.notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.proceedBtn} onClick={onConfirmCall}>
            <PhoneOutgoing size={17} />
            <span>Place Call Now · {lead.phone}</span>
          </button>
          <div className={styles.note}>
            Initiates call via backend telephony bridge (calls your phone & connects to customer).
          </div>
        </div>
      </div>
    </div>
  );
};

