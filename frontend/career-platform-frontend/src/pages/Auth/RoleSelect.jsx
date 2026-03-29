import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelect() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ textAlign: 'center', maxWidth: 500 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, color: 'var(--text-primary)' }}>Continue as</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[{ role: 'student', icon: '🎓', label: 'Student', desc: 'Track skills & find jobs', path: '/students' }, { role: 'admin', icon: '🧑‍🏫', label: 'Admin', desc: 'Manage placements & analytics', path: '/admin' }].map(r => (
            <button key={r.role} onClick={() => navigate('/login')} style={{ padding: 24, background: 'var(--surface-elevated)', border: '2px solid rgba(15,23,42,0.08)', borderRadius: 'var(--radius-xl)', cursor: 'pointer', textAlign: 'center', transition: 'all 200ms', fontFamily: 'var(--font-ui)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--accent-subtle)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(15,23,42,0.08)'; e.currentTarget.style.background = 'var(--surface-elevated)'; }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>{r.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
