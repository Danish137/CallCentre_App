import React, { useState } from 'react';
import { Bell, ChevronDown, Phone, User, Settings, LogOut } from 'lucide-react';
import { ProviderStatus } from '../../types';
import styles from './Header.module.css';

interface HeaderProps {
  agentName?: string;
  storeName?: string;
  providerStatus: ProviderStatus | null;
  onOpenTelephonyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  agentName = 'Arvind Rajan',
  storeName = 'The Sleep Company · Call Centre',
  providerStatus,
  onOpenTelephonyModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isReal = providerStatus?.isRealTelephony;

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
        {/* Telephony Status Pill */}
        <button
          className={styles.telephonyPill}
          onClick={onOpenTelephonyModal}
          title="Telephony Engine & Outbound Provider Settings"
        >
          <Phone size={13} color={isReal ? '#10b981' : '#f59e0b'} />
          <span>{isReal ? `PSTN: ${providerStatus?.provider?.toUpperCase()}` : 'Dev Simulator'}</span>
        </button>

        {/* Global Ranks Pill */}
        <div className={styles.rankPill} title="OG Score™ & Team Rank">
          <div className={styles.ogScoreCircle}>76</div>
          <span className={styles.rankNumber}>⭐#3</span>
        </div>

        {/* Notifications */}
        <button className={styles.notifBtn} title="Notifications">
          <Bell size={18} />
          <span className={styles.notifDot} />
        </button>

        {/* User Avatar & Menu */}
        <div className={styles.userMenuWrap}>
          <button
            className={styles.avatarBtn}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className={styles.avatarCircle}>🦸‍♂️</div>
            <span className={styles.avatarName}>{agentName}</span>
            <ChevronDown size={14} color="#6b7280" />
          </button>

          {dropdownOpen && (
            <div className={styles.userDropdown}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownTitle}>{agentName}</div>
                <div className={styles.dropdownSub}>{storeName}</div>
              </div>
              <button
                className={styles.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                <User size={15} />
                <span>My Profile</span>
              </button>
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenTelephonyModal();
                }}
              >
                <Settings size={15} />
                <span>Telephony Settings</span>
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

