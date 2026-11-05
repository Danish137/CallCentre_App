import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NavigationTab, PlanSubTab, ProviderStatus } from '../../types';
import styles from './Layout.module.css';

interface LayoutProps {
  activeTab: NavigationTab;
  planSubTab: PlanSubTab;
  onSelectTab: (tab: NavigationTab) => void;
  onSelectPlanSubTab: (sub: PlanSubTab) => void;
  providerStatus: ProviderStatus | null;
  onOpenTelephonyModal: () => void;
  children: React.ReactNode;
  inQueueCount?: number;
  missedCallsCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({
  activeTab,
  planSubTab,
  onSelectTab,
  onSelectPlanSubTab,
  providerStatus,
  onOpenTelephonyModal,
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
        providerStatus={providerStatus}
        onOpenTelephonyModal={onOpenTelephonyModal}
        inQueueCount={inQueueCount}
        missedCallsCount={missedCallsCount}
      />
      <div className={styles.mainWrapper}>
        <Header
          providerStatus={providerStatus}
          onOpenTelephonyModal={onOpenTelephonyModal}
        />
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
};

