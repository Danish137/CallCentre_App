import React, { useState } from 'react';
import { Bell, ChevronDown, User, Settings, LogOut, CheckCircle2, PhoneCall } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  agentAvatar?: string;
  agentName?: string;
  storeName?: string;
  onOpenProfileModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  agentAvatar = '🦸‍♂️',
  agentName = 'Arvind Rajan',
  storeName = 'The Sleep Company · Call Centre',
  onOpenProfileModal,
  onOpenSettingsModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className={styles.header}>
      {/* Left Info */}
      <div className={styles.leftSection}>
        <div className={styles.storeInfo}>
          <span className={styles.storeTitle}>{storeName}</span>
          <span className={styles.storeSubtitle}>Shift Staff Dashboard</span>
        </div>
        <div className={styles.statusPill}>
          <span className={styles.liveDot} />
          <span>On Queue</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className={styles.rightSection}>
        {/* Global Ranks Pill */}
        <div className={styles.rankPill} title="OG Score™ & Team Rank">
          <div className={styles.ogScoreCircle}>76</div>
          <span className={styles.rankNumber}>⭐#3</span>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className={styles.notifBtn}
            onClick={() => setNotifOpen(!notifOpen)}
            title="Notifications"
          >
            <Bell size={17} color="#fff" />
            <span className={styles.notifDot} />
          </button>

          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 46,
                right: 0,
                width: 320,
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                border: '1px solid #e5e5ea',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'slideDown 0.2s ease',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  background: '#0a1a14',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Shift Notifications</span>
                <span style={{ fontSize: 11, color: '#9fe1cb', cursor: 'pointer' }} onClick={() => setNotifOpen(false)}>Close</span>
              </div>
              <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid #f2f2f7',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}
                >
                  <PhoneCall size={16} color="#0f6e56" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>1 callback open</div>
                    <div style={{ fontSize: 11.5, color: '#666' }}>Priya Iyer requested a callback for Ortho Pro King</div>
                  </div>
                </div>
                <div
                  style={{
                    padding: '10px 16px',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}
                >
                  <CheckCircle2 size={16} color="#c8860a" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>SOP Adherence High</div>
                    <div style={{ fontSize: 11.5, color: '#666' }}>Avani AI noted 83% script adherence on recent calls</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Menu */}
        <div className={styles.userMenuWrap}>
          <button
            className={styles.avatarBtn}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="User Menu & Profile"
          >
            <div className={styles.avatarCircle}>{agentAvatar}</div>
            <span className={styles.avatarName}>{agentName}</span>
            <ChevronDown size={14} color="#6b7280" />
          </button>

          {dropdownOpen && (
            <div className={styles.userDropdown}>
              <div className={styles.dropdownHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 18 }}>{agentAvatar}</div>
                  <div>
                    <div className={styles.dropdownTitle}>{agentName}</div>
                    <div className={styles.dropdownSub}>{storeName}</div>
                  </div>
                </div>
              </div>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenProfileModal();
                }}
              >
                <User size={15} />
                <span>My Profile &amp; Persona</span>
              </button>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenSettingsModal();
                }}
              >
                <Settings size={15} />
                <span>Settings</span>
              </button>
              <button
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                onClick={() => setDropdownOpen(false)}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
