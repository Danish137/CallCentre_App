import React from 'react';
import { PhoneOutgoing, X, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';
import { Lead, ProviderStatus } from '../../types';
import styles from './PreCallSopModal.module.css';

interface PreCallSopModalProps {
  lead: Lead;
  providerStatus?: ProviderStatus | null;
  onConfirmCall: () => void;
  onClose: () => void;
}

export const PreCallSopModal: React.FC<PreCallSopModalProps> = ({
  lead,
  providerStatus,
  onConfirmCall,
  onClose,
}) => {
  const isReal = providerStatus?.isRealTelephony;
  const agentPhone = providerStatus?.configuredAgentPhone;

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
          {/* Mode Distinction Callout */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 12.5,
              lineHeight: 1.45,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              background: isReal ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${isReal ? '#a7f3d0' : '#fde68a'}`,
              color: isReal ? '#065f46' : '#92400e',
            }}
          >
            {isReal ? (
              <Radio size={16} style={{ color: '#059669', marginTop: 2, flexShrink: 0 }} />
            ) : (
              <AlertTriangle size={16} style={{ color: '#d97706', marginTop: 2, flexShrink: 0 }} />
            )}
            <div>
              {isReal ? (
                <>
                  <b>Live PSTN Call Mode ({providerStatus?.provider.toUpperCase()}):</b> Outbound bridge will call your registered phone <b>({agentPhone || 'configured in .env'})</b> first. When answered, it connects to customer <b>{lead.phone}</b>.
                </>
              ) : (
                <>
                  <b>Dev Simulator Mode:</b> No real telecom network will be contacted. Simulated ringing, timer, and dialogue script will be launched for verification.
                </>
              )}
            </div>
          </div>

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
            <span>
              {isReal
                ? `Place Live Call · ${lead.phone}`
                : `Simulate Call · ${lead.phone}`}
            </span>
          </button>
          <div className={styles.note}>
            {isReal
              ? `Real telecom bridge via ${providerStatus?.provider.toUpperCase()}.`
              : 'Dev sandbox testing mode.'}
          </div>
        </div>
      </div>
    </div>
  );
};

