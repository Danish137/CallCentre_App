import React, { useState } from 'react';
import { User, X, Check, Award, Store } from 'lucide-react';
import styles from './ProfileModal.module.css';

interface ProfileModalProps {
  currentAvatar: string;
  currentName: string;
  onSave: (avatar: string, name: string) => void;
  onClose: () => void;
}

const PERSONAS = [
  { emoji: '🦸‍♂️', name: 'Captain', desc: 'Authoritative & trustworthy closer' },
  { emoji: '🦸‍♀️', name: 'Valkyrie', desc: 'Empathic problem-solver' },
  { emoji: '🦹‍♀️', name: 'Vortex', desc: 'High-energy fast-paced pitch' },
  { emoji: '🦹‍♂️', name: 'Blaze', desc: 'Direct & objection-proof' },
  { emoji: '🥷', name: 'Shadow', desc: 'Calm, patient consultant' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentAvatar,
  currentName,
  onSave,
  onClose,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || '🦸‍♂️');
  const [fullName, setFullName] = useState(currentName || 'Arvind Rajan');
  const [email, setEmail] = useState('arvind.rajan@thesleepcompany.in');
  const [phone, setPhone] = useState('+91 98450 11223');
  const [savedToast, setSavedToast] = useState(false);

  const activePersona = PERSONAS.find((p) => p.emoji === selectedAvatar) || PERSONAS[0];

  const handleSave = () => {
    localStorage.setItem('og_agent_avatar', selectedAvatar);
    localStorage.setItem('og_agent_name', fullName);
    onSave(selectedAvatar, fullName);
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
            <User size={18} color="#9fe1cb" />
            <span>My Profile &amp; Selling Persona</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Selling Persona Picker */}
          <div>
            <div className={styles.sectionTitle}>Your Selling Persona</div>
            <div className={styles.personaHero}>
              <div className={styles.avatarBadge}>{selectedAvatar}</div>
              <div className={styles.personaInfo}>
                <div className={styles.personaName}>{activePersona.name}</div>
                <div className={styles.personaDesc}>{activePersona.desc}</div>
              </div>
            </div>
            <div style={{ marginTop: 10 }} className={styles.personaGrid}>
              {PERSONAS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className={`${styles.personaOpt} ${selectedAvatar === p.emoji ? styles.personaOptSelected : ''}`}
                  onClick={() => setSelectedAvatar(p.emoji)}
                >
                  <span className={styles.personaEmoji}>{p.emoji}</span>
                  <span className={styles.personaLabel}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Employee Profile Fields */}
          <div>
            <div className={styles.sectionTitle}>Employee Credentials</div>
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
                  <div className={styles.fieldLabel}>Work Email</div>
                  <input
                    type="text"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <div className={styles.fieldLabel}>PSTN Registered Phone</div>
                  <input
                    type="text"
                    className={styles.input}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Performance & Store Milestone */}
          <div>
            <div className={styles.sectionTitle}>Shift &amp; Performance</div>
            <div className={styles.rankCard}>
              <div className={styles.rankStat}>
                <div className={styles.rankCircle}>76</div>
                <div>
                  <div className={styles.rankTitle}>OG Score™ · Top 10% Closer</div>
                  <div className={styles.rankSub}>Koramangala · The Sleep Company (Morning Shift)</div>
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0f6e56', background: '#e1f5ee', padding: '4px 10px', borderRadius: 8 }}>
                ⭐ #3 in Team
              </span>
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
              'Save Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
