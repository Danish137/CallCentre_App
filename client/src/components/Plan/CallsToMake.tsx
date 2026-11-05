import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Phone, Eye, ArrowRight } from 'lucide-react';
import { Lead } from '../../types';
import styles from './Plan.module.css';

interface CallsToMakeProps {
  leads: Lead[];
  onOpenLeadModal: (leadIndex: number) => void;
  onInitiateCall: (lead: Lead) => void;
}

export const CallsToMake: React.FC<CallsToMakeProps> = ({
  leads,
  onOpenLeadModal,
  onInitiateCall,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 3;

  const totalPages = Math.ceil(leads.length / perPage);
  const paginatedLeads = leads.slice(currentPage * perPage, (currentPage + 1) * perPage);

  const toggleExpand = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {paginatedLeads.map((lead, localIdx) => {
        const globalIdx = currentPage * perPage + localIdx;
        const isExpanded = expandedIndex === globalIdx;
        const scoreColor =
          lead.attractivenessScore >= 80
            ? '#0f6e56'
            : lead.attractivenessScore >= 55
            ? '#c8860a'
            : '#e24b4a';

        const storySummary = (lead.journey || []).map((j) => j.text).join(' → ');

        return (
          <div key={lead.id} className={styles.rowCard}>
            <div className={styles.rowHead} onClick={() => onOpenLeadModal(globalIdx)}>
              {/* Avatar */}
              <div
                className={styles.avatarCircle}
                style={{ background: lead.avatarBg, color: lead.avatarColor }}
              >
                {lead.initials}
              </div>

              {/* Lead Info */}
              <div className={styles.leadInfo}>
                <div className={styles.leadNameRow}>
                  <span className={styles.leadName}>{lead.name}</span>
                  <span
                    className={styles.leadBadge}
                    style={{ background: lead.badgeBg, color: lead.badgeColor }}
                  >
                    {lead.badge}
                  </span>
                </div>
                <div className={styles.leadSub}>{lead.interest}</div>
              </div>

              {/* Score */}
              <div className={styles.scoreBlock}>
                <div className={styles.scoreVal} style={{ color: scoreColor }}>
                  {lead.attractivenessScore}
                </div>
                <div className={styles.scoreLbl}>Score</div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  className={`${styles.actionBtn} ${styles.callBtn}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onInitiateCall(lead);
                  }}
                  title="Place telephone call"
                >
                  <Phone size={13} />
                  <span>Call</span>
                </button>

                <button
                  className={`${styles.actionBtn} ${styles.detailsBtn}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLeadModal(globalIdx);
                  }}
                  title="Open Lead Card modal"
                >
                  <Eye size={13} />
                  <span>Details</span>
                </button>

                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    padding: 4,
                  }}
                  onClick={(e) => toggleExpand(globalIdx, e)}
                  title="Expand story"
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>

            {/* Expandable Story Detail */}
            {isExpanded && (
              <div className={styles.rowDetail}>
                <div className={styles.storyLabel}>Story So Far</div>
                <div className={styles.storyText}>
                  {storySummary || 'No prior interactions logged yet.'}
                </div>

                <div className={styles.detailGrid}>
                  <div className={styles.detailPill}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                      Preferred Product
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                      {lead.product}
                    </div>
                  </div>

                  <div className={styles.detailPill}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                      Cross-Sell Item
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                      {lead.crossSell}
                    </div>
                  </div>
                </div>

                <div className={styles.emiBox}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                    Financing / EMI Note
                  </div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>{lead.emi}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <button
                    className={styles.linkBtn}
                    onClick={() => onOpenLeadModal(globalIdx)}
                  >
                    <span>View Full ICP & Journey Analysis</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Pagination Bar */}
      <div className={styles.paginationBar}>
        <button
          className={styles.pageBtn}
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
        >
          ‹ Previous
        </button>
        <span className={styles.pageInfo}>
          Page {currentPage + 1} of {totalPages} ({leads.length} total leads)
        </span>
        <button
          className={styles.pageBtn}
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

