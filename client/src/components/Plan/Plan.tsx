import React from 'react';
import { PhoneOutgoing, PhoneIncoming, History, PhoneCall } from 'lucide-react';
import { Lead, IncomingCall, RecentCall, PlanSubTab } from '../../types';
import { CallsToMake } from './CallsToMake';
import { IncomingCalls } from './IncomingCalls';
import { RecentCalls } from './RecentCalls';
import styles from './Plan.module.css';

interface PlanProps {
  activeSubTab: PlanSubTab;
  onSelectSubTab: (tab: PlanSubTab) => void;
  leads: Lead[];
  incomingCalls: IncomingCall[];
  recentCalls: RecentCall[];
  onOpenLeadModal: (leadIndex: number) => void;
  onInitiateCall: (lead: Lead) => void;
  onInitiateCallback: (call: IncomingCall) => void;
}

export const Plan: React.FC<PlanProps> = ({
  activeSubTab,
  onSelectSubTab,
  leads,
  incomingCalls,
  recentCalls,
  onOpenLeadModal,
  onInitiateCall,
  onInitiateCallback,
}) => {
  return (
    <div className={styles.planContainer}>
      {/* Hero Header */}
      <div className={styles.planHero}>
        <div>
          <div className={styles.planHeroSubtitle}>Shift Calling Execution</div>
          <h1 className={styles.planHeroTitle}>Planner & Calling Queue</h1>
        </div>
        <div className={styles.datePill}>Today's Queue</div>
      </div>

      {/* Tabs Bar */}
      <div className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${activeSubTab === 'outgoing' ? styles.tabBtnActive : ''}`}
          onClick={() => onSelectSubTab('outgoing')}
        >
          <PhoneOutgoing size={16} />
          <span>Calls to make</span>
          <span
            className={`${styles.tabCount} ${
              activeSubTab === 'outgoing' ? styles.tabCountActive : ''
            }`}
          >
            {leads.length}
          </span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeSubTab === 'incoming' ? styles.tabBtnActive : ''}`}
          onClick={() => onSelectSubTab('incoming')}
        >
          <PhoneIncoming size={16} />
          <span>Incoming</span>
          {incomingCalls.length > 0 && (
            <span
              style={{
                background: '#ef4444',
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                padding: '1px 7px',
                borderRadius: 10,
              }}
            >
              {incomingCalls.length}
            </span>
          )}
        </button>

        <button
          className={`${styles.tabBtn} ${activeSubTab === 'recent' ? styles.tabBtnActive : ''}`}
          onClick={() => onSelectSubTab('recent')}
        >
          <History size={16} />
          <span>Recent</span>
          <span
            className={`${styles.tabCount} ${
              activeSubTab === 'recent' ? styles.tabCountActive : ''
            }`}
          >
            {recentCalls.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeSubTab === 'outgoing' && (
        <CallsToMake
          leads={leads}
          onOpenLeadModal={onOpenLeadModal}
          onInitiateCall={onInitiateCall}
        />
      )}

      {activeSubTab === 'incoming' && (
        <IncomingCalls
          incomingCalls={incomingCalls}
          onInitiateCallback={onInitiateCallback}
        />
      )}

      {activeSubTab === 'recent' && (
        <RecentCalls recentCalls={recentCalls} />
      )}
    </div>
  );
};

