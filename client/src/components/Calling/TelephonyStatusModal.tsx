import React from 'react';
import { X, Phone, Server, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { ProviderStatus } from '../../types';
import styles from './TelephonyStatusModal.module.css';

interface TelephonyStatusModalProps {
  providerStatus: ProviderStatus | null;
  onSwitchProvider: (provider: 'twilio' | 'exotel' | 'dev') => void;
  onClose: () => void;
}

export const TelephonyStatusModal: React.FC<TelephonyStatusModalProps> = ({
  providerStatus,
  onSwitchProvider,
  onClose,
}) => {
  const active = providerStatus?.provider || 'dev';
  const isReal = providerStatus?.isRealTelephony;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <Phone size={18} />
            <span>Telephony Engine & Outbound Provider</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Active Status Card */}
          <div className={styles.statusCard}>
            <div className={styles.statusTop}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                Active Telephony Adapter:
              </span>
              <span
                className={`${styles.providerBadge} ${isReal ? styles.badgeGreen : styles.badgeAmber}`}
              >
                {isReal ? `● REAL PSTN (${active.toUpperCase()})` : '● DEV SIMULATOR'}
              </span>
            </div>
            <div className={styles.desc}>{providerStatus?.message}</div>
          </div>

          {/* Provider Selection */}
          <div className={styles.sectionTitle}>Select Active Telephony Provider</div>
          <div className={styles.providerGrid}>
            <div
              className={`${styles.providerOption} ${active === 'twilio' ? styles.providerOptionActive : ''}`}
              onClick={() => onSwitchProvider('twilio')}
            >
              <Server size={20} color="#0284c7" />
              <div className={styles.providerName}>Twilio PSTN</div>
              <div className={styles.providerSub}>Global Programmable Voice</div>
            </div>

            <div
              className={`${styles.providerOption} ${active === 'exotel' ? styles.providerOptionActive : ''}`}
              onClick={() => onSwitchProvider('exotel')}
            >
              <Server size={20} color="#059669" />
              <div className={styles.providerName}>Exotel Cloud</div>
              <div className={styles.providerSub}>India Telephony API</div>
            </div>

            <div
              className={`${styles.providerOption} ${active === 'dev' ? styles.providerOptionActive : ''}`}
              onClick={() => onSwitchProvider('dev')}
            >
              <RefreshCw size={20} color="#d97706" />
              <div className={styles.providerName}>Dev Simulator</div>
              <div className={styles.providerSub}>Zero-Config Sandbox</div>
            </div>
          </div>

          {/* How Click-to-Call Works */}
          <div className={styles.sectionTitle}>Click-to-Call Architecture</div>
          <div className={styles.callDiagram}>
            <b>1. Click Call:</b> Staff clicks "Call" on a lead row.<br />
            <b>2. Backend Call Initiation:</b> Express backend invokes the telephony adapter (Twilio/Exotel).<br />
            <b>3. Employee Phone Rings:</b> Telephony provider calls your registered number (+919876543210).<br />
            <b>4. Customer Bridged:</b> Once answered, provider dials the customer number and bridges the line.<br />
            <b>5. Real-Time Telephony Updates:</b> Server-Sent Events stream live status (Ringing, In-Progress, Completed, Sentiment, Transcript) to the UI.
          </div>

          {/* Environment Variables Guide */}
          <div className={styles.sectionTitle}>To Activate Real Outbound Phone Calls</div>
          <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.45 }}>
            To make real phone calls ring on actual handsets in India, add your Twilio or Exotel credentials to <code>.env</code> in the project root:
          </p>
          <div className={styles.codeBox}>
            # Add to .env for real calls<br />
            TELEPHONY_PROVIDER=twilio<br />
            TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX<br />
            TWILIO_AUTH_TOKEN=your_auth_token_here<br />
            TWILIO_PHONE_NUMBER=+1XXXXXXXXXX<br />
            DEFAULT_AGENT_PHONE=+919876543210
          </div>
        </div>
      </div>
    </div>
  );
};

