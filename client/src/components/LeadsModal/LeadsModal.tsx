import React from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Tag,
  Clock,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Building,
} from 'lucide-react';
import { Lead } from '../../types';
import styles from './LeadsModal.module.css';

interface LeadsModalProps {
  leads: Lead[];
  currentIndex: number;
  onNavigateIndex: (index: number) => void;
  onInitiateCall: (lead: Lead) => void;
  onClose: () => void;
}

export const LeadsModal: React.FC<LeadsModalProps> = ({
  leads,
  currentIndex,
  onNavigateIndex,
  onInitiateCall,
  onClose,
}) => {
  const lead = leads[currentIndex] || leads[0];
  if (!lead) return null;

  const getBucketIcon = (cat: string) => {
    if (cat.includes('Financ')) return <CreditCard size={14} />;
    if (cat.includes('Warranty')) return <ShieldCheck size={14} />;
    if (cat.includes('Store') || cat.includes('Experience')) return <Building size={14} />;
    return <Tag size={14} />;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitle}>Lead Profile & ICP Analysis</div>
            <div className={styles.headerSub}>
              Lead {currentIndex + 1} of {leads.length} · SLA to Close
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Pager Bar */}
        <div className={styles.pagerBar}>
          <button
            className={styles.pagerNavBtn}
            disabled={currentIndex === 0}
            onClick={() => onNavigateIndex(currentIndex - 1)}
            title="Previous lead"
          >
            <ChevronLeft size={16} />
          </button>

          <div className={styles.pagerDots}>
            {leads.map((_, idx) => (
              <span
                key={idx}
                className={`${styles.pagerDot} ${
                  idx === currentIndex ? styles.pagerDotActive : styles.pagerDotInactive
                }`}
              />
            ))}
          </div>

          <button
            className={styles.pagerNavBtn}
            disabled={currentIndex >= leads.length - 1}
            onClick={() => onNavigateIndex(currentIndex + 1)}
            title="Next lead"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className={styles.bodyContent}>
          {/* Lead Hero */}
          <div className={styles.leadHero}>
            <div
              className={styles.leadAvatar}
              style={{ background: lead.avatarBg, color: lead.avatarColor }}
            >
              {lead.initials}
            </div>

            <div className={styles.leadDetails}>
              <div className={styles.leadName}>{lead.name}</div>
              <div className={styles.leadInterest}>{lead.interest}</div>
              <div style={{ fontSize: 12, color: '#059669', fontWeight: 700, marginTop: 2 }}>
                Phone: {lead.phone}
              </div>
            </div>
          </div>

          {/* Scores Row */}
          <div className={styles.scoresRow}>
            <div className={styles.scoreBox}>
              <span className={styles.scoreBoxVal} style={{ color: lead.icpColor }}>
                {lead.icp}%
              </span>
              <span className={styles.scoreBoxLbl}>ICP Match Score</span>
            </div>

            <div className={styles.scoreBox}>
              <span className={styles.scoreBoxVal} style={{ color: '#6b2fa0' }}>
                {lead.intentScore}%
              </span>
              <span className={styles.scoreBoxLbl}>Lead Intent Score</span>
            </div>
          </div>

          {/* Subscores breakdown */}
          <div className={styles.subscoresList}>
            <div className={styles.sectionTitle}>Qualification Breakdown</div>
            {lead.subscores.map((sub, idx) => (
              <div key={idx} className={styles.subscoreItem}>
                <div className={styles.subscoreHead}>
                  <span>{sub.label}</span>
                  <span className={styles.subscorePct} style={{ color: sub.color }}>
                    {sub.pct}%
                  </span>
                </div>
                <div className={styles.subscoreBarWrap}>
                  <div
                    className={styles.subscoreBarFill}
                    style={{ width: `${sub.pct}%`, background: sub.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Buying Signals / Problem Buckets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className={styles.sectionTitle}>Buying Signals & Objection Context</div>
            {lead.problemBuckets.map((bucket, idx) => (
              <div key={idx} className={styles.bucketRow}>
                <div className={styles.bucketCat}>
                  {getBucketIcon(bucket.cat)}
                  <span>{bucket.cat}</span>
                </div>
                <div className={styles.bucketText}>{bucket.text}</div>
              </div>
            ))}
          </div>

          {/* Customer Journey Timeline */}
          {lead.journey && lead.journey.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className={styles.sectionTitle}>Interaction History & Journey</div>
              <div className={styles.timeline}>
                {lead.journey.map((item, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <span className={styles.timelineDate}>
                      {item.date} · {item.channel}
                    </span>
                    <span className={styles.timelineText}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Persistent Footer Actions */}
        <div className={styles.footer}>
          <button
            className={styles.callLeadBtn}
            onClick={() => {
              onClose();
              onInitiateCall(lead);
            }}
          >
            <Phone size={16} />
            <span>Call {lead.name} Now</span>
          </button>

          <button
            className={styles.secondaryActionBtn}
            onClick={() => alert(`WhatsApp quotation for ${lead.product} dispatched to ${lead.phone}`)}
          >
            <MessageCircle size={15} style={{ display: 'inline', marginRight: 4 }} />
            <span>Send Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};

