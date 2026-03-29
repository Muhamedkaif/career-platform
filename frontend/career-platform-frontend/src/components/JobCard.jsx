import React, { useState } from 'react';

const urgencyColors = {
  critical: { bg: '#FFF1F2', border: '#FECDD3', text: '#DC2626', dot: '#DC2626' },
  high: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', dot: '#D97706' },
  normal: { bg: '#F0FDF4', border: '#BBF7D0', text: '#059669', dot: '#059669' },
  info: { bg: '#EFF6FF', border: '#BFDBFE', text: '#0284C7', dot: '#0284C7' },
};

export default function JobCard({ job, onApply, compact = false }) {
  const [hovered, setHovered] = useState(false);
  const [applying, setApplying] = useState(false);
  const urgency = job.urgency || 'normal';
  const colors = urgencyColors[urgency];

  const handleApply = async () => {
    if (applying || job.applied) return;
    setApplying(true);
    try {
      await onApply?.(job.id);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--surface-secondary)' : 'var(--surface-elevated)',
        border: `1px solid ${hovered ? 'var(--accent-primary)' : 'rgba(15,23,42,0.06)'}`,
        borderRadius: 'var(--radius-large)',
        padding: compact ? '12px 16px' : '16px 20px',
        transition: 'all 200ms ease-in-out',
        cursor: 'default',
        boxShadow: hovered ? 'var(--shadow-2)' : 'var(--shadow-1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            {/* Company logo placeholder */}
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${job.brandColor || '#4F46E5'}, ${job.brandColorEnd || '#7C3AED'})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              {job.company?.[0] || 'C'}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{job.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{job.company}</div>
            </div>
          </div>

          {!compact && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {job.skills?.slice(0, 3).map(skill => (
                <span key={skill} style={{
                  fontSize: 11, fontWeight: 500, padding: '2px 8px',
                  background: 'var(--accent-subtle)', color: 'var(--accent-primary)',
                  borderRadius: 'var(--radius-micro)', fontFamily: 'var(--font-mono)',
                }}>
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          {job.match && (
            <span style={{
              fontSize: 12, fontWeight: 700, color: 'var(--signal-success)',
              background: '#F0FDF4', border: '1px solid #BBF7D0',
              padding: '2px 8px', borderRadius: 'var(--radius-micro)',
            }}>
              {job.match}% match
            </span>
          )}
          {job.deadline && (
            <span style={{
              fontSize: 11, color: colors.text, background: colors.bg,
              border: `1px solid ${colors.border}`, padding: '2px 8px',
              borderRadius: 'var(--radius-micro)',
            }}>
              {job.deadline}
            </span>
          )}
        </div>
      </div>

      {!compact && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {job.salary && <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{job.salary}</span>}
            {job.location && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>📍 {job.location}</span>}
            {job.type && <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{job.type}</span>}
          </div>
          <button
            onClick={handleApply}
            disabled={applying || job.applied}
            style={{
              fontSize: 13, fontWeight: 600, padding: '6px 16px',
              background: job.applied ? 'var(--surface-sunken)' : applying ? 'var(--accent-subtle)' : 'var(--accent-primary)',
              color: job.applied ? 'var(--text-secondary)' : applying ? 'var(--accent-primary)' : '#fff',
              border: 'none', borderRadius: 'var(--radius-default)', cursor: job.applied ? 'default' : 'pointer',
              transition: 'all 150ms ease-out',
              transform: hovered && !job.applied ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {job.applied ? 'Applied ✓' : applying ? 'Applying...' : 'Apply →'}
          </button>
        </div>
      )}
    </div>
  );
}
