import React from 'react';
import {
  Calendar as CalendarIcon,
  Phone,
  PhoneCall,
  ClipboardList,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DashboardData, NavigationTab } from '../../types';
import { PerformanceCharts } from './PerformanceCharts';
import styles from './Dashboard.module.css';

interface DashboardProps {
  data: DashboardData;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenLeadsModal: (leadIndex?: number) => void;
  onInitiateCall: (customerPhone: string, customerName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  onNavigateTab,
  onOpenLeadsModal,
  onInitiateCall,
}) => {
  return (
    <div className={styles.dashContainer}>
      {/* Hero Performance Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroTop}>
          <div>
            <div className={styles.greeting}>Good afternoon 👋</div>
            <h1 className={styles.heroName}>{data.agentName}</h1>
            <div className={styles.heroBrand}>{data.storeName}</div>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.dateFilterBtn}>
              <CalendarIcon size={14} />
              <span>This Week</span>
            </button>
          </div>
        </div>

        {/* 4 KPIs Row */}
        <div className={styles.kpiRow}>
          {data.kpis.map((kpi, idx) => {
            const isQueue = kpi.label === 'In Queue';
            return (
              <div
                key={idx}
                className={`${styles.kpiCard} ${isQueue ? styles.kpiCardClickable : ''}`}
                onClick={isQueue ? () => onNavigateTab('calls') : undefined}
                title={isQueue ? 'Click to open calling plan' : undefined}
              >
                <div className={styles.kpiValue}>{kpi.value}</div>
                <div className={styles.kpiLabel}>{kpi.label}</div>
                <div
                  className={`${styles.kpiTrend} ${
                    kpi.live ? styles.trendLive : styles.trendUp
                  }`}
                >
                  {kpi.live && <span className={styles.trendLiveDot} />}
                  <span>{kpi.trend}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid */}
      <div className={styles.twoColGrid}>
        {/* Left Column */}
        <div className={styles.colStack}>
          {/* Progress Today */}
          <div className={styles.surfaceCard}>
            <div className={styles.progHeader}>
              <TrendingUp size={14} color="#10b981" />
              <span>My Progress · Today</span>
            </div>
            <div className={styles.progGrid}>
              {data.progress.map((p, idx) => (
                <div key={idx} className={styles.progMetric}>
                  <div className={styles.progVal}>{p.value}</div>
                  <div
                    className={`${styles.progDelta} ${
                      p.status === 'warn' ? styles.deltaWarn : styles.deltaGood
                    }`}
                  >
                    {p.delta}
                  </div>
                  <div className={styles.progLabel}>{p.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Who's Waiting */}
          <div className={styles.surfaceCard}>
            <div className={styles.sectionHeadRow}>
              <span className={styles.sectionTitle}>Who's Waiting</span>
              <button
                className={styles.linkBtn}
                onClick={() => onNavigateTab('calls')}
              >
                <span>Open planner</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className={styles.waitingList}>
              {data.whoIsWaiting.map((item, idx) => (
                <div key={idx} className={styles.waitingItem}>
                  <div className={styles.waitingLeft}>
                    <div className={styles.waitingAvatar}>
                      {item.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className={styles.waitingName}>{item.name}</div>
                      <div className={styles.waitingIntent}>
                        Wait: <b>{item.wait}</b> · {item.intent}
                      </div>
                    </div>
                  </div>

                  <button
                    className={styles.callNowBtn}
                    onClick={() => onInitiateCall(item.phone || '+919845022334', item.name)}
                  >
                    <Phone size={13} />
                    <span>Call</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.colStack}>
          {/* Earnings this month */}
          <div className={styles.surfaceCard}>
            <div className={styles.earningsTop}>
              <div style={{ fontSize: 14.5, fontWeight: 800 }}>💰 My earnings this month</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{data.earnings.nextSlab}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div className={styles.earningsAmount}>{data.earnings.monthEarnings}</div>
              <div className={styles.earningsSub}>{data.earnings.coachedMoves}</div>
            </div>
            <div className={styles.earningsProgressWrap}>
              <div
                className={styles.earningsProgressFill}
                style={{ width: `${data.earnings.progressPct}%` }}
              />
            </div>
          </div>

          {/* My Tasks */}
          <div className={styles.tasksCard}>
            <div className={styles.tasksHeader}>
              <span>⚡ My Tasks</span>
              <span className={styles.taskBadge}>{data.myTasks.length}</span>
            </div>

            <div className={styles.taskList}>
              {data.myTasks.map((task) => (
                <div
                  key={task.id}
                  className={styles.taskItem}
                  onClick={() => {
                    if (task.title.includes('Mukunda')) {
                      onOpenLeadsModal(0);
                    } else {
                      onNavigateTab('pulse');
                    }
                  }}
                  title="Click to view details"
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: task.bg,
                      color: task.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <PhoneCall size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.taskTitle}>{task.title}</div>
                    <div className={styles.taskChannel}>{task.channel}</div>
                  </div>
                  <ArrowRight size={14} color="#94a3b8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Performance Charts Section */}
      <PerformanceCharts data={data.sevenDayPerformance} />
    </div>
  );
};
