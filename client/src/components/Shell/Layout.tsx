import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NavigationTab, PlanSubTab } from '../../types';
import styles from './Layout.module.css';

interface LayoutProps {
  activeTab: NavigationTab;
  planSubTab: PlanSubTab;
  onSelectTab: (tab: NavigationTab) => void;
  onSelectPlanSubTab: (sub: PlanSubTab) => void;
  onOpenSettingsModal: () => void;
  children: React.ReactNode;
  inQueueCount?: number;
  missedCallsCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({
  activeTab,
  planSubTab,
  onSelectTab,
  onSelectPlanSubTab,
  onOpenSettingsModal,
  children,
  inQueueCount,
  missedCallsCount,
}) => {
  return (
    <div className={styles.layoutRoot}>
      <Sidebar
        activeTab={activeTab}
        planSubTab={planSubTab}
        onSelectTab={onSelectTab}
        onSelectPlanSubTab={onSelectPlanSubTab}
        inQueueCount={inQueueCount}
        missedCallsCount={missedCallsCount}
      />
      <div className={styles.mainWrapper}>
        <Header onOpenSettingsModal={onOpenSettingsModal} />
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
};
