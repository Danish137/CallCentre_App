import React from 'react';
import { X, CheckCircle2, XCircle, Award, Radio, AlertCircle, Phone } from 'lucide-react';
import { RecentCall } from '../../types';

interface CallSopReviewModalProps {
  call: RecentCall;
  onClose: () => void;
}

export const CallSopReviewModal: React.FC<CallSopReviewModalProps> = ({ call, onClose }) => {
  const isReal = Boolean(call.isRealCall);

  // Six standard SOP checkpoints from the original design
  const defaultSopItems = [
    { step: 'Opening & Intent Confirm', passed: true, evidence: '"This is Arvind from The Sleep Company, is now an okay time?"' },
    { step: 'Needs Discovery', passed: true, evidence: '"Can I ask what matters most to you — firmness or price?"' },
    { step: 'Product Pitch', passed: true, evidence: '"The GRID layer gives pressure relief exactly where you need it."' },
    { step: 'EMI / Financing Mention', passed: true, evidence: '"We do have a 12-month zero-interest EMI plan if that helps."' },
    { step: 'Warranty Mention', passed: false, evidence: 'No mention of the 10-year warranty period anywhere in the call.' },
    { step: 'Closing / Callback Booking', passed: true, evidence: '"I\'ll send the quote over and follow up Thursday, does that work?"' },
  ];

  const sopItems = call.sopReview && call.sopReview.length > 0 ? call.sopReview : defaultSopItems;
  const passedCount = sopItems.filter((i) => i.passed).length;
  const scorePct = call.score !== undefined ? call.score : Math.round((passedCount / sopItems.length) * 100);
  const scoreColor = scorePct >= 80 ? '#0f6e56' : scorePct >= 50 ? '#c8860a' : '#e24b4a';

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
          maxWidth: 520,
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
            background: isReal
              ? 'linear-gradient(135deg, #064e3b, #0f6e56)'
              : 'linear-gradient(135deg, #1e1b4b, #4338ca)',
            color: '#fff',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 17, fontWeight: 800 }}>Call with {call.name}</div>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 6,
                  textTransform: 'uppercase',
                  background: isReal ? 'rgba(52, 211, 153, 0.25)' : 'rgba(251, 191, 36, 0.25)',
                  border: `1px solid ${isReal ? '#34d399' : '#fbbf24'}`,
                  color: isReal ? '#a7f3d0' : '#fde68a',
                }}
              >
                {isReal ? `Real Call · ${call.provider?.toUpperCase() || 'EXOTEL'}` : 'Simulated'}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
              {call.time} · Duration: {call.duration}
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

        {/* Real Call vs Simulated Call Content */}
        {isReal ? (
          /* REAL CALL: SOP Review Unavailable */
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '16px 18px',
              }}
            >
              <AlertCircle size={22} color="#64748b" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>
                  SOP Review Unavailable
                </div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, marginTop: 4 }}>
                  Automated script scoring and SOP checklist verification require raw conversational transcript data. This was a live PSTN carrier telephone call placed via <b>{call.provider?.toUpperCase() || 'EXOTEL'}</b> without speech-to-text processing.
                </div>
              </div>
            </div>

            {/* Real Telecom Record Details */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 14,
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0f6e56', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Telecom Carrier Metadata
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: 11.5, textTransform: 'uppercase', fontWeight: 700 }}>Carrier Bridge</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                    {call.provider?.toUpperCase() || 'EXOTEL'} Cloud PSTN
                  </div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: 11.5, textTransform: 'uppercase', fontWeight: 700 }}>Actual Call Duration</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                    {call.duration} ({call.durationSeconds}s)
                  </div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: 11.5, textTransform: 'uppercase', fontWeight: 700 }}>Customer Destination</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                    {call.phone}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: 11.5, textTransform: 'uppercase', fontWeight: 700 }}>Agent Handset Leg</div>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                    {call.agentPhone || 'Verified Exotel Phone'}
                  </div>
                </div>
              </div>

              {(call.outcome || call.notes) && (
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 4 }}>
                  <div style={{ color: '#64748b', fontSize: 11.5, textTransform: 'uppercase', fontWeight: 700 }}>Wrap-up Outcome & Notes</div>
                  <div style={{ fontSize: 13, color: '#1e293b', marginTop: 3 }}>
                    <b>{call.outcome || 'Completed'}</b>{call.notes ? ` — ${call.notes}` : ''}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SIMULATED CALL: 6-Step SOP Adherence Review */
          <>
            {/* Score Banner */}
            <div
              style={{
                padding: '14px 20px',
                background: '#faf9f6',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ flex: 1, paddingRight: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#6b6b74' }}>
                    SOP adherence on this call (Simulated)
                  </div>
                </div>
                <div style={{ height: 6, background: '#eee', borderRadius: 3, marginTop: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${scorePct}%`, height: '100%', background: scoreColor, transition: 'width 0.3s' }} />
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor }}>
                {scorePct}%
              </div>
            </div>

            {/* Checklist with Evidence */}
            <div
              style={{
                padding: '14px 20px',
                maxHeight: '55vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {sopItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '11px 0',
                    borderBottom: idx === sopItems.length - 1 ? 'none' : '1px solid #f2f2f5',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.passed ? (
                      <CheckCircle2 size={16} color="#1d9e75" style={{ flexShrink: 0 }} />
                    ) : (
                      <XCircle size={16} color="#e24b4a" style={{ flexShrink: 0 }} />
                    )}
                    <span
                      style={{
                        fontSize: 14,
                        color: '#1a1a1a',
                        fontWeight: item.passed ? 500 : 700,
                      }}
                    >
                      {item.step}
                    </span>
                    {!item.passed && (
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#e24b4a',
                          background: '#fdecec',
                          padding: '2px 7px',
                          borderRadius: 6,
                        }}
                      >
                        Missed
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: 12.5,
                      color: item.passed ? '#6b6b74' : '#a3311f',
                      fontStyle: item.passed ? 'italic' : 'normal',
                      paddingLeft: 24,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.evidence}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

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
              padding: '9px 20px',
              borderRadius: 8,
              border: 'none',
              background: isReal ? '#0f6e56' : '#4338ca',
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
