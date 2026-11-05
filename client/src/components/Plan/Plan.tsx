import React from 'react';
import { PhoneOutgoing, PhoneIncoming, History, Sparkles } from 'lucide-react';
import { Lead, IncomingCall, RecentCall, PlanSubTab } from '../../types';
import { CallsToMake } from './CallsToMake';
import { IncomingCalls } from './IncomingCalls';
import { RecentCalls } from './RecentCalls';
import { PractiseView } from '../Practise/PractiseView';
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
  leads,
  incomingCalls,
  recentCalls,
  onOpenLeadModal,
  onInitiateCall,
  onInitiateCallback,
}) => {
  const getSubTabTitle = () => {
    switch (activeSubTab) {
      case 'outgoing':
        return { title: 'Calls to Make', sub: 'Shift Outbound Calling Queue' };
      case 'incoming':
        return { title: 'Incoming Calls', sub: 'Missed Calls & Immediate Callbacks' };
      case 'recent':
        return { title: 'Recent Calls', sub: 'Completed Calls & SOP Quality Reviews' };
      case 'practise':
        return { title: 'Net Practise & AI Voice Call', sub: 'Customer Simulation & SOP Rehearsal Sandbox' };
      default:
        return { title: 'Planner & Calling Queue', sub: 'Shift Calling Execution' };
    }
  };

  const { title, sub } = getSubTabTitle();

  return (
    <div className={styles.planContainer}>
      {/* Hero Header */}
      <div className={styles.planHero}>
        <div>
          <div className={styles.planHeroSubtitle}>{sub}</div>
          <h1 className={styles.planHeroTitle}>{title}</h1>
        </div>
        <div className={styles.datePill}>Today's Queue</div>
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

      {activeSubTab === 'practise' && (
        <PractiseView />
      )}
    </div>
  );
};

