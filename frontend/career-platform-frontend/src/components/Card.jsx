import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  action,
  padding = 24,
  elevation = 1,
  style = {},
  className = '',
  glass = false,
  accent = false,
}) {
  const shadowMap = {
    1: 'var(--shadow-1)',
    2: 'var(--shadow-2)',
    3: 'var(--shadow-3)',
    4: 'var(--shadow-4)',
  };

  const cardStyle = {
    background: glass
      ? 'rgba(255,255,255,0.7)'
      : 'var(--surface-elevated)',
    backdropFilter: glass ? 'blur(12px)' : undefined,
    WebkitBackdropFilter: glass ? 'blur(12px)' : undefined,
    border: glass
      ? '1px solid rgba(255,255,255,0.4)'
      : accent
      ? '1px solid var(--accent-primary)'
      : '1px solid rgba(15,23,42,0.06)',
    borderRadius: 'var(--radius-large)',
    boxShadow: shadowMap[elevation],
    padding,
    transition: 'box-shadow 200ms ease-in-out, transform 200ms ease-in-out',
    ...style,
  };

  return (
    <div
      style={cardStyle}
      className={className}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = shadowMap[Math.min(elevation + 1, 4)];
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = shadowMap[elevation];
      }}
    >
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            {title && <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
