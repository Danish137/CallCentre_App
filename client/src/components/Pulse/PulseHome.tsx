import React from 'react';
import {
  MessagesSquare,
  Sparkles,
  Headphones,
  Megaphone,
  CreditCard,
  TrendingUp,
  Award,
  ChevronRight,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { PulseOverview } from '../../types';
import styles from './PulseHome.module.css';

interface PulseHomeProps {
  overview: PulseOverview;
  onOpenChannel: (channelId: string) => void;
}

export const PulseHome: React.FC<PulseHomeProps> = ({ overview, onOpenChannel }) => {
  const getChannelIcon = (id: string) => {
    switch (id) {
      case 'callcentre-team':
        return <Headphones size={18} />;
      case 'all-stores':
        return <Megaphone size={18} />;
      case 'avani-coaching':
        return <Sparkles size={18} />;
      case 'emi-push-nudges':
        return <CreditCard size={18} />;
      default:
        return <TrendingUp size={18} />;
    }
  };

  return (
    <div className={styles.pulseContainer}>
      {/* Hero Header */}
      <div className={styles.pulseHero}>
        <div className={styles.heroLeft}>
          <div className={styles.pulseLogoIcon}>
            <MessagesSquare size={24} color="#6b2fa0" />
          </div>
          <div>
            <h1 className={styles.pulseTitle}>Pulse Channels & AI Agents</h1>
            <div className={styles.pulseSub}>
              Direct collaborative workspace with team channels, autonomous agents, and kudos
            </div>
          </div>
        </div>
      </div>

      {/* Featured AvaniBot Card */}
      <div
        className={styles.avaniHeroCard}
        onClick={() => onOpenChannel('avani-coaching')}
        title="Chat with Avani AI Coach"
      >
        <div className={styles.avaniSparkle}>✨</div>
        <div className={styles.avaniText}>
          <div className={styles.avaniTitle}>Avani AI Agent Coaching</div>
          <div className={styles.avaniDesc}>
            Your real-time shift intelligence co-pilot. Ask daily brief, objection scripts, or get feedback.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13 }}>
          <span>Open Coach</span>
          <ArrowRight size={16} />
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.gridTwoCol}>
        {/* Left Column: Team Channels */}
        <div className={styles.stackCol}>
          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <span>Team & Task Channels</span>
              <span style={{ fontSize: 11, color: '#64748b' }}>
                {overview.channels.length} channels
              </span>
            </div>

            <div className={styles.channelList}>
              {overview.channels.map((ch) => (
                <div
                  key={ch.id}
                  className={styles.channelItem}
                  onClick={() => onOpenChannel(ch.id)}
                >
                  <div className={styles.channelLeft}>
                    <div className={styles.channelIcon}>{getChannelIcon(ch.id)}</div>
                    <div>
                      <div className={styles.channelName}>{ch.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        {ch.type === 'team'
                          ? 'Staff shift communication'
                          : ch.type === 'ai'
                          ? 'Personal AI coaching'
                          : 'Task optimization'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {ch.unread > 0 && <span className={styles.unreadPill}>{ch.unread}</span>}
                    <ChevronRight size={18} color="#94a3b8" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous Task Agents */}
          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <span>Autonomous Task & Coaching Agents</span>
            </div>

            <div className={styles.agentsGrid}>
              {overview.agents.taskAgents.map((ag) => (
                <div
                  key={ag.id}
                  className={styles.agentCard}
                  onClick={() => onOpenChannel('avani-coaching')}
                >
                  <div className={styles.agentTitleRow}>
                    <div className={styles.agentIcon} style={{ background: ag.color }}>
                      <Bot size={15} />
                    </div>
                    <span className={styles.agentName}>{ag.name}</span>
                  </div>
                  <div className={styles.agentDesc}>{ag.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Role Agents & Kudos */}
        <div className={styles.stackCol}>
          {/* Role Agents */}
          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <span>Role Agents</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {overview.agents.roleAgents.map((ag) => (
                <div
                  key={ag.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: ag.color,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Bot size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                        {ag.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{ag.role}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: ag.color }}>
                      {ag.target}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase' }}>
                      {ag.metric}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kudos Section */}
          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={16} color="#d97706" />
                <span>Team Kudos</span>
              </div>
            </div>

            <div className={styles.kudosList}>
              {overview.kudos.map((k) => (
                <div key={k.id} className={styles.kudosCard}>
                  <div className={styles.kudosHeader}>
                    <span className={styles.kudosBadge}>{k.badge}</span>
                    <span style={{ fontSize: 11, color: '#a16207' }}>{k.time}</span>
                  </div>
                  <div className={styles.kudosText}>"{k.text}"</div>
                  <div className={styles.kudosMeta}>
                    From <b>{k.from}</b> to {k.to}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

