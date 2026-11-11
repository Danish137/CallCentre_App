import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  X,
  Check,
  Lock,
  Building2,
  PhoneCall,
  Volume2,
  Globe2,
  Share2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'gu', label: 'ગુજરાતી' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [autoWrapup, setAutoWrapup] = useState(true);
  const [sopNudges, setSopNudges] = useState(true);
  const [inboundRingAlert, setInboundRingAlert] = useState(true);
  const [selectedLang, setSelectedLang] = useState('en');
  const [linkedInUrl, setLinkedInUrl] = useState('linkedin.com/in/arvind-rajan-og');
  const [linkedInConnected, setLinkedInConnected] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <SettingsIcon size={18} color="#9fe1cb" />
            <span>Settings</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Security */}
          <div>
            <div className={styles.sectionTitle}>Security</div>
            <div className={styles.card}>
              <div className={styles.rowItem} onClick={() => setShowPinModal(!showPinModal)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <Lock size={18} color="#0f6e56" />
                  <div className={styles.rowText}>
                    <span className={styles.rowTitle}>Change App PIN</span>
                    <span className={styles.rowSub}>Update your 4-digit quick login security PIN</span>
                  </div>
                </div>
                <ChevronRight size={16} color="#8e8e93" />
              </div>
              {showPinModal && (
                <div style={{ marginTop: 8, padding: 12, background: '#f7f7f9', borderRadius: 10, display: 'flex', gap: 8 }}>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid #e5e5ea', fontSize: 13 }}
                  />
                  <button
                    onClick={() => {
                      if (newPin.length === 4) {
                        alert('Security PIN updated successfully!');
                        setShowPinModal(false);
                      }
                    }}
                    style={{ padding: '7px 14px', background: '#0f6e56', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                  >
                    Save PIN
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Store Allocation */}
          <div>
            <div className={styles.sectionTitle}>Store &amp; Territory</div>
            <div className={styles.card}>
              <div className={styles.rowItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <Building2 size={18} color="#0f6e56" />
                  <div className={styles.rowText}>
                    <span className={styles.rowTitle}>Base Store</span>
                    <span className={styles.rowSub}>Koramangala — The Sleep Company</span>
                  </div>
                </div>
              </div>
              <div className={styles.pillGreen}>
                Allocated Territories: Koramangala · HSR Layout · Indiranagar
              </div>
            </div>
          </div>

          {/* Role & Customer Channel */}
          <div>
            <div className={styles.sectionTitle}>Role &amp; Customer Channel</div>
            <div className={styles.card}>
              <div className={styles.roleCard}>
                <div className={styles.roleTierBadge}>M0</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>
                    M0 · Call Centre Staff
                  </div>
                  <div style={{ fontSize: 12, color: '#8e8e93', marginTop: 2 }}>
                    Assigned customer channel is dedicated to outbound tele-calling &amp; inbound callbacks.
                  </div>
                </div>
              </div>
              <div className={styles.channelBox}>
                <div className={styles.channelIcon}>☎️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a1a' }}>
                    Voice Telephony Channel
                  </div>
                  <div style={{ fontSize: 11.5, color: '#666' }}>
                    Exotel PSTN carrier bridging enabled
                  </div>
                </div>
                <Check size={16} color="#1d9e75" />
              </div>
            </div>
          </div>

          {/* Audio & Interaction Preferences */}
          <div>
            <div className={styles.sectionTitle}>Audio &amp; Call Workflow</div>
            <div className={styles.card}>
              <div className={styles.rowItem} onClick={() => setAutoWrapup(!autoWrapup)}>
                <div className={styles.rowText}>
                  <span className={styles.rowTitle}>Call Auto-wrapup Prompt</span>
                  <span className={styles.rowSub}>Automatically trigger disposition modal upon call completion</span>
                </div>
                <div className={`${styles.toggleSwitch} ${autoWrapup ? styles.toggleSwitchActive : ''}`}>
                  <div className={`${styles.toggleKnob} ${autoWrapup ? styles.toggleKnobActive : ''}`} />
                </div>
              </div>

              <div style={{ height: 1, background: '#f2f2f7' }} />

              <div className={styles.rowItem} onClick={() => setSopNudges(!sopNudges)}>
                <div className={styles.rowText}>
                  <span className={styles.rowTitle}>Real-time SOP Guidance Nudges</span>
                  <span className={styles.rowSub}>Highlight missing rubric steps during live phone calls</span>
                </div>
                <div className={`${styles.toggleSwitch} ${sopNudges ? styles.toggleSwitchActive : ''}`}>
                  <div className={`${styles.toggleKnob} ${sopNudges ? styles.toggleKnobActive : ''}`} />
                </div>
              </div>

              <div style={{ height: 1, background: '#f2f2f7' }} />

              <div className={styles.rowItem} onClick={() => setInboundRingAlert(!inboundRingAlert)}>
                <div className={styles.rowText}>
                  <span className={styles.rowTitle}>Inbound Ringtone Chime</span>
                  <span className={styles.rowSub}>Audible chime when high-intent customer calls back</span>
                </div>
                <div className={`${styles.toggleSwitch} ${inboundRingAlert ? styles.toggleSwitchActive : ''}`}>
                  <div className={`${styles.toggleKnob} ${inboundRingAlert ? styles.toggleKnobActive : ''}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Language */}
          <div>
            <div className={styles.sectionTitle}>App Language</div>
            <div className={styles.card}>
              <div style={{ fontSize: 12.5, color: '#666' }}>
                Choose the primary display language for staff actions:
              </div>
              <div className={styles.langGrid}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`${styles.langBtn} ${selectedLang === lang.code ? styles.langBtnActive : ''}`}
                    onClick={() => setSelectedLang(lang.code)}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LinkedIn OG Score Integration */}
          <div>
            <div className={styles.sectionTitle}>OG Score™ on LinkedIn</div>
            <div className={styles.card}>
              <div className={styles.linkedInBox}>
                <div style={{ fontSize: 12.5, color: '#666' }}>
                  Link once — whenever you hit a milestone, publish your verified OG Score™ story to LinkedIn:
                </div>
                <input
                  type="text"
                  className={styles.linkedInInput}
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="linkedin.com/in/your-profile"
                />
                <button
                  type="button"
                  className={styles.linkedInBtn}
                  onClick={() => {
                    alert('Your verified OG Score™ milestone (76 pts) was pushed to LinkedIn!');
                  }}
                >
                  <Share2 size={15} />
                  <span>Share OG Score™ Milestone on LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            {savedToast ? (
              <>
                <Check size={16} /> Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
