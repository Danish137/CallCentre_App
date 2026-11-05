import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Check, Lock, Mic, Store, ShieldCheck } from 'lucide-react';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [fullName, setFullName] = useState('Arvind Rajan');
  const [email, setEmail] = useState('arvind.rajan@thesleepcompany.in');
  const [phone, setPhone] = useState('+91 98450 11223');
  const [autoWrapup, setAutoWrapup] = useState(true);
  const [sopNudges, setSopNudges] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
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
          {/* Employee Profile */}
          <div className={styles.sectionTitle}>Employee Profile</div>
          <div className={styles.card}>
            <div className={styles.grid2}>
              <div>
                <div className={styles.fieldLabel}>Full Name</div>
                <input
                  type="text"
                  className={styles.input}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <div className={styles.fieldLabel}>Employee ID</div>
                <input
                  type="text"
                  className={`${styles.input} ${styles.inputDisabled}`}
                  value="OG-EMP-07734"
                  disabled
                />
              </div>
              <div>
                <div className={styles.fieldLabel}>Email Address</div>
                <input
                  type="text"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className={styles.fieldLabel}>Phone Number</div>
                <input
                  type="text"
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Store & Shift */}
          <div className={styles.sectionTitle}>Shift & Store Assignment</div>
          <div className={styles.card}>
            <div className={styles.rowItem}>
              <div className={styles.rowText}>
                <span className={styles.rowTitle}>Assigned Retail Store</span>
                <span className={styles.rowSub}>Koramangala · The Sleep Company</span>
              </div>
              <Store size={18} color="#0f6e56" />
            </div>
            <div style={{ height: 1, background: '#f2f2f7' }} />
            <div className={styles.rowItem}>
              <div className={styles.rowText}>
                <span className={styles.rowTitle}>Shift Schedule</span>
                <span className={styles.rowSub}>Morning Shift (9:30 AM – 6:30 PM IST)</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, background: '#e1f5ee', color: '#0f6e56', padding: '3px 8px', borderRadius: 8 }}>
                ACTIVE
              </span>
            </div>
          </div>

          {/* Audio & Call Preferences */}
          <div className={styles.sectionTitle}>Audio & Shift Preferences</div>
          <div className={styles.card}>
            <div className={styles.rowItem}>
              <div className={styles.rowText}>
                <span className={styles.rowTitle}>Call Auto-wrapup Prompt</span>
                <span className={styles.rowSub}>Automatically trigger disposition modal upon call completion</span>
              </div>
              <div
                className={styles.toggleSwitch}
                onClick={() => setAutoWrapup(!autoWrapup)}
                style={{ background: autoWrapup ? '#0f6e56' : '#d1d5db' }}
              >
                <div
                  className={styles.toggleKnob}
                  style={{ right: autoWrapup ? 2 : 'auto', left: autoWrapup ? 'auto' : 2 }}
                />
              </div>
            </div>
            <div style={{ height: 1, background: '#f2f2f7' }} />
            <div className={styles.rowItem}>
              <div className={styles.rowText}>
                <span className={styles.rowTitle}>Real-time SOP Compliance Nudges</span>
                <span className={styles.rowSub}>Visual checkmark feedback during calls</span>
              </div>
              <div
                className={styles.toggleSwitch}
                onClick={() => setSopNudges(!sopNudges)}
                style={{ background: sopNudges ? '#0f6e56' : '#d1d5db' }}
              >
                <div
                  className={styles.toggleKnob}
                  style={{ right: sopNudges ? 2 : 'auto', left: sopNudges ? 'auto' : 2 }}
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className={styles.sectionTitle}>Security</div>
          <div className={styles.card}>
            <div className={styles.rowItem} style={{ cursor: 'pointer' }}>
              <div className={styles.rowText}>
                <span className={styles.rowTitle}>Change App Password</span>
                <span className={styles.rowSub}>Last changed 14 days ago</span>
              </div>
              <Lock size={16} color="#8e8e93" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            {savedToast ? 'Saved ✓' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

