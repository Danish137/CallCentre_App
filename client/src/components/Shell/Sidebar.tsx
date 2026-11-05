import React from 'react';
import {
  LayoutDashboard,
  Phone,
  PhoneOutgoing,
  PhoneIncoming,
  History,
  Sparkles,
  Calendar,
  MessagesSquare,
} from 'lucide-react';
import { NavigationTab, PlanSubTab } from '../../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTab: NavigationTab;
  planSubTab: PlanSubTab;
  onSelectTab: (tab: NavigationTab) => void;
  onSelectPlanSubTab: (sub: PlanSubTab) => void;
  inQueueCount?: number;
  missedCallsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  planSubTab,
  onSelectTab,
  onSelectPlanSubTab,
  inQueueCount = 2,
  missedCallsCount = 4,
}) => {

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.brandLogo}>OG</div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>On-Ground.ai</span>
          <span className={styles.brandTag}>Call Centre Staff</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={styles.navSection}>
        {/* Dashboard */}
        <button
          className={`${styles.navItem} ${activeTab === 'dash' ? styles.active : ''}`}
          onClick={() => onSelectTab('dash')}
        >
          <span className={styles.navIcon}>
            <LayoutDashboard size={19} />
          </span>
          <span>Dashboard</span>
        </button>

        {/* Plan */}
        <button
          className={`${styles.navItem} ${activeTab === 'calls' ? styles.active : ''}`}
          onClick={() => onSelectTab('calls')}
        >
          <span className={styles.navIcon}>
            <Phone size={19} />
          </span>
          <span>Plan</span>
          {inQueueCount > 0 && <span className={`${styles.badge} ${styles.badgeLive}`}>{inQueueCount} live</span>}
        </button>

        {/* Plan sub-items */}
        {activeTab === 'calls' && (
          <div className={styles.subItemsWrap}>
            <button
              className={`${styles.subItem} ${planSubTab === 'outgoing' ? styles.active : ''}`}
              onClick={() => onSelectPlanSubTab('outgoing')}
            >
              <PhoneOutgoing size={15} />
              <span>Calls to make</span>
            </button>
            <button
              className={`${styles.subItem} ${planSubTab === 'incoming' ? styles.active : ''}`}
              onClick={() => onSelectPlanSubTab('incoming')}
            >
              <PhoneIncoming size={15} />
              <span>Incoming</span>
              {missedCallsCount > 0 && (
                <span className={`${styles.badge} ${styles.badgeRed}`}>{missedCallsCount}</span>
              )}
            </button>
            <button
              className={`${styles.subItem} ${planSubTab === 'recent' ? styles.active : ''}`}
              onClick={() => onSelectPlanSubTab('recent')}
            >
              <History size={15} />
              <span>Recent</span>
            </button>
            <button
              className={`${styles.subItem} ${planSubTab === 'practise' ? styles.active : ''}`}
              onClick={() => onSelectPlanSubTab('practise')}
            >
              <Sparkles size={15} />
              <span>Practise a call</span>
            </button>
          </div>
        )}

        {/* Calendar */}
        <button
          className={`${styles.navItem} ${activeTab === 'calendar' ? styles.active : ''}`}
          onClick={() => onSelectTab('calendar')}
        >
          <span className={styles.navIcon}>
            <Calendar size={19} />
          </span>
          <span>Calendar</span>
        </button>

        {/* Pulse */}
        <button
          className={`${styles.navItem} ${activeTab === 'pulse' ? styles.active : ''}`}
          onClick={() => onSelectTab('pulse')}
        >
          <span className={styles.navIcon}>
            <MessagesSquare size={19} />
          </span>
          <span>Pulse</span>
          <span className={styles.badge}>3 unread</span>
        </button>
      </nav>
    </aside>
  );
};

