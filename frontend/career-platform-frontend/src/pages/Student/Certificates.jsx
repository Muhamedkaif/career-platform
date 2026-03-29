import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Skeleton } from '../../components/Loader';

const mockCerts = [
  { id: 1, name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', status: 'in-progress', progress: 65, earned: null, color: '#FF9900', icon: '☁️', expiry: null },
  { id: 2, name: 'Google Professional ML Engineer', issuer: 'Google Cloud', status: 'earned', progress: 100, earned: 'Oct 2024', color: '#4285F4', icon: '🤖', expiry: 'Oct 2026' },
  { id: 3, name: 'Meta React Developer', issuer: 'Meta / Coursera', status: 'earned', progress: 100, earned: 'Aug 2024', color: '#0866FF', icon: '⚛️', expiry: null },
  { id: 4, name: 'Python for Data Science', issuer: 'IBM / Coursera', status: 'earned', progress: 100, earned: 'Jun 2024', color: '#054ADA', icon: '🐍', expiry: null },
  { id: 5, name: 'Kubernetes Administrator', issuer: 'CNCF', status: 'not-started', progress: 0, earned: null, color: '#326CE5', icon: '⚙️', expiry: null },
  { id: 6, name: 'System Design Mastery', issuer: 'Educative', status: 'in-progress', progress: 30, earned: null, color: '#7C3AED', icon: '🏗️', expiry: null },
];

const statusConfig = {
  'earned': { label: 'Earned', bg: '#F0FDF4', text: '#059669', border: '#BBF7D0' },
  'in-progress': { label: 'In Progress', bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' },
  'not-started': { label: 'Not Started', bg: 'var(--surface-sunken)', text: 'var(--text-tertiary)', border: 'rgba(15,23,42,0.08)' },
};

export default function Certificates() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTimeout(() => { setData(mockCerts); setLoading(false); }, 600);
  }, []);

  const filtered = data.filter(c => filter === 'all' || c.status === filter);
  const earned = data.filter(c => c.status === 'earned').length;
  const inProgress = data.filter(c => c.status === 'in-progress').length;

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Navbar title="Certificates & Credentials" />

      <div style={{ padding: '24px 32px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Earned', value: earned, color: 'var(--signal-success)', bg: '#F0FDF4' },
            { label: 'In Progress', value: inProgress, color: 'var(--accent-primary)', bg: 'var(--accent-subtle)' },
            { label: 'Total', value: data.length, color: 'var(--text-primary)', bg: 'var(--surface-sunken)' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 'var(--radius-large)', padding: '16px 20px', flex: 1, border: '1px solid rgba(15,23,42,0.06)' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[['all', 'All'], ['earned', 'Earned'], ['in-progress', 'In Progress'], ['not-started', 'Not Started']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding: '7px 14px', border: `1.5px solid ${filter === val ? 'var(--accent-primary)' : 'rgba(15,23,42,0.1)'}`,
              borderRadius: 'var(--radius-default)', background: filter === val ? 'var(--accent-subtle)' : 'var(--surface-primary)',
              color: filter === val ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: filter === val ? 600 : 400, cursor: 'pointer', transition: 'all 150ms',
            }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ background: 'var(--surface-elevated)', borderRadius: 12, padding: 20 }}><Skeleton height={160} /></div>)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map((cert, i) => {
              const sc = statusConfig[cert.status];
              return (
                <div key={cert.id} style={{
                  background: 'var(--surface-elevated)', border: '1px solid rgba(15,23,42,0.06)',
                  borderRadius: 'var(--radius-large)', padding: 20, boxShadow: 'var(--shadow-1)',
                  transition: 'all 200ms', animation: `fadeIn 0.3s ease-out ${i * 0.06}s both`,
                  position: 'relative', overflow: 'hidden',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Top accent bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cert.status === 'earned' ? `linear-gradient(90deg, ${cert.color}, ${cert.color}88)` : cert.status === 'in-progress' ? `linear-gradient(90deg, ${cert.color}66, transparent)` : 'transparent' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{cert.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: sc.text, background: sc.bg, border: `1px solid ${sc.border}`, padding: '3px 8px', borderRadius: 4 }}>
                      {sc.label}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{cert.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>{cert.issuer}</p>

                  {cert.status !== 'not-started' && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Progress</span>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, color: cert.status === 'earned' ? 'var(--signal-success)' : 'var(--accent-primary)' }}>{cert.progress}%</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--surface-sunken)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${cert.progress}%`, background: cert.status === 'earned' ? 'var(--signal-success)' : cert.color, borderRadius: 3, transition: 'width 0.8s ease-out' }} />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {cert.earned && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Earned: {cert.earned}</span>}
                      {cert.expiry && <span style={{ fontSize: 11, color: 'var(--signal-warning)', display: 'block' }}>Expires: {cert.expiry}</span>}
                    </div>
                    <button style={{
                      fontSize: 12, fontWeight: 600, padding: '6px 12px',
                      background: cert.status === 'earned' ? '#F0FDF4' : cert.status === 'in-progress' ? 'var(--accent-subtle)' : 'var(--surface-sunken)',
                      color: cert.status === 'earned' ? 'var(--signal-success)' : cert.status === 'in-progress' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      border: 'none', borderRadius: 'var(--radius-default)', cursor: 'pointer',
                    }}>
                      {cert.status === 'earned' ? 'View Cert →' : cert.status === 'in-progress' ? 'Continue →' : 'Start Now →'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
