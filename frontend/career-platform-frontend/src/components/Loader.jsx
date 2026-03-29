import React from 'react';

const styles = {
  skeleton: {
    background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s linear infinite',
    borderRadius: 'var(--radius-default)',
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid var(--accent-subtle)',
    borderTop: '3px solid var(--accent-primary)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  fullPage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'var(--surface-secondary)',
    flexDirection: 'column',
    gap: 16,
  },
  logoText: {
    fontFamily: 'var(--font-ui)',
    fontWeight: 700,
    fontSize: 20,
    color: 'var(--accent-primary)',
    letterSpacing: '-0.5px',
  },
};

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg); } }`;

export function Skeleton({ width, height, style = {} }) {
  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
      <div style={{ ...styles.skeleton, width: width || '100%', height: height || 16, ...style }} />
    </>
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div style={{ padding: 20, background: 'var(--surface-elevated)', borderRadius: 'var(--radius-large)', boxShadow: 'var(--shadow-1)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton height={20} width="60%" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? '40%' : '100%'} />
      ))}
    </div>
  );
}

export default function Loader({ fullPage = false, text = 'Loading...' }) {
  return (
    <>
      <style>{spinKeyframes}</style>
      {fullPage ? (
        <div style={styles.fullPage}>
          <div style={styles.spinner} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{text}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16 }}>
          <div style={{ ...styles.spinner, width: 20, height: 20, borderWidth: 2 }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{text}</span>
        </div>
      )}
    </>
  );
}
