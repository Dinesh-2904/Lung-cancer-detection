import React from 'react';

interface ConfidenceBarProps {
  label: string;
  value: number;       // 0–1
  isPredicted: boolean;
  delay?: number;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ label, value, isPredicted, delay = 0 }) => {
  const pct = Math.round(value * 100 * 10) / 10;

  return (
    <div style={{ marginBottom: 14 }}>
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: isPredicted ? 700 : 500,
          color: isPredicted ? 'var(--color-navy)' : 'var(--color-text-soft)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {isPredicted && (
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              display: 'inline-block', flexShrink: 0,
            }} />
          )}
          {label}
        </span>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: isPredicted ? 700 : 600,
          color: isPredicted ? '#1d4ed8' : 'var(--color-text-soft)',
          minWidth: 48,
          textAlign: 'right',
        }}>
          {pct.toFixed(1)}%
        </span>
      </div>

      {/* Bar track */}
      <div style={{
        height: 8, borderRadius: 99,
        background: '#f1f5f9',
        overflow: 'hidden',
      }}>
        <div
          style={{
            height: '100%',
            borderRadius: 99,
            width: `${pct}%`,
            background: isPredicted
              ? 'linear-gradient(90deg, #1d4ed8, #06b6d4)'
              : 'linear-gradient(90deg, #94a3b8, #cbd5e1)',
            boxShadow: isPredicted ? '0 0 8px rgba(6,182,212,0.4)' : 'none',
            transition: `width 1s ${delay}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
