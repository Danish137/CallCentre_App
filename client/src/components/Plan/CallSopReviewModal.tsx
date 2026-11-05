import React from 'react';
import { X, CheckCircle2, XCircle, Award } from 'lucide-react';
import { RecentCall } from '../../types';
import styles from './Plan.module.css';

interface CallSopReviewModalProps {
  call: RecentCall;
  onClose: () => void;
}

export const CallSopReviewModal: React.FC<CallSopReviewModalProps> = ({ call, onClose }) => {
  const sopItems = call.sopReview || [
    { step: 'Opening & Intent Confirm', passed: true, evidence: '"This is Arvind from The Sleep Company, is now an okay time?"' },
    { step: 'Needs Discovery', passed: true, evidence: '"Can I ask what matters most to you — firmness or price?"' },
    { step: 'Product Pitch', passed: true, evidence: '"The GRID layer gives pressure relief exactly where you need it."' },
    { step: 'EMI / Financing Mention', passed: true, evidence: '"We do have a 12-month zero-interest EMI plan if that helps."' },
    { step: 'Warranty Mention', passed: false, evidence: 'No mention of the 10-year warranty period anywhere in the call.' },
    { step: 'Closing / Callback Booking', passed: true, evidence: '"I\'ll send the quote over and follow up Thursday, does that work?"' },
  ];

  const passedCount = sopItems.filter((i) => i.passed).length;
  const scorePct = Math.round((passedCount / sopItems.length) * 100);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          width: '100%',
          maxWidth: 500,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1b4b, #4338ca)',
            color: '#fff',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>Call SOP Quality Review</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)' }}>
              {call.name} · {call.duration} · Scored via QA engine
            </div>
          </div>
          <button
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Score Banner */}
        <div
          style={{
            padding: '14px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Award size={22} color="#4338ca" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>
                Script Adherence: {scorePct}%
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b' }}>
                {passedCount} of {sopItems.length} checkpoints confirmed in transcript
              </div>
            </div>
          </div>

          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#e0e7ff',
              color: '#4338ca',
              fontWeight: 800,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {scorePct}%
          </div>
        </div>

        {/* Checklist with Evidence */}
        <div
          style={{
            padding: '18px 20px',
            maxHeight: '60vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {sopItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: item.passed ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${item.passed ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.passed ? (
                    <CheckCircle2 size={16} color="#15803d" />
                  ) : (
                    <XCircle size={16} color="#b91c1c" />
                  )}
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: item.passed ? '#166534' : '#991b1b',
                    }}
                  >
                    {item.step}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: item.passed ? '#15803d' : '#b91c1c',
                  }}
                >
                  {item.passed ? 'PASSED' : 'MISSED'}
                </span>
              </div>

              <div
                style={{
                  fontSize: 12.5,
                  color: item.passed ? '#1e3a1e' : '#450a0a',
                  fontStyle: 'italic',
                  paddingLeft: 24,
                  lineHeight: 1.4,
                }}
              >
                {item.evidence}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 20px',
            background: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: 'none',
              background: '#4338ca',
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

