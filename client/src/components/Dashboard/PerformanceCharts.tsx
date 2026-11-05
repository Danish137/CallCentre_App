import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface PerformanceChartsProps {
  data: Array<{
    day: string;
    calls: number;
    csat: number;
    handleTime: number;
    conversion: number;
  }>;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Chart 1: Daily Calls & CSAT */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: 20,
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
              7-Day Call Volume & CSAT Trend
            </div>
            <div style={{ fontSize: 12.5, color: '#6b7280' }}>
              Total calls completed and customer satisfaction percentage
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 700 }}>
            <span style={{ color: '#0f6e56' }}>● Calls Handled</span>
            <span style={{ color: '#6b2fa0' }}>● CSAT %</span>
          </div>
        </div>

        <div style={{ height: 220, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f6e56" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0f6e56" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="csatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6b2fa0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6b2fa0" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#0f6e56"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#callsGrad)"
                name="Calls Handled"
              />
              <Area
                type="monotone"
                dataKey="csat"
                stroke="#6b2fa0"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#csatGrad)"
                name="CSAT (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Handle Time & Conversion Rate */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: 20,
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>
              Handle Time vs. Conversion
            </div>
            <div style={{ fontSize: 12.5, color: '#6b7280' }}>
              Average conversation duration (mins) & confirmed lead conversion (%)
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, fontWeight: 700 }}>
            <span style={{ color: '#185fa5' }}>■ Handle Time (min)</span>
            <span style={{ color: '#c8860a' }}>■ Conversion %</span>
          </div>
        </div>

        <div style={{ height: 200, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="handleTime" fill="#185fa5" radius={[4, 4, 0, 0]} name="Avg Handle Time (m)" />
              <Bar dataKey="conversion" fill="#c8860a" radius={[4, 4, 0, 0]} name="Conversion Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

