import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title, actions }) {
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);

  const notifications = [
    { id: 1, text: 'Your resume was reviewed', time: '2m ago', type: 'success' },
    { id: 2, text: 'New internship matched', time: '1h ago', type: 'info' },
    { id: 3, text: 'Certificate ready to claim', time: '3h ago', type: 'warning' },
  ];

  return (
    <header style={{
      height: 60,
      background: 'var(--surface-primary)',
      borderBottom: '1px solid rgba(15,23,42,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-1)',
    }}>
      <div>
        {title && <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{title}</h1>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {actions}

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(v => !v)}
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius-default)',
              background: 'transparent', border: '1px solid rgba(15,23,42,0.08)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, transition: 'all 150ms ease-out',
              position: 'relative',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-secondary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            🔔
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 16, height: 16, borderRadius: '50%',
              background: 'var(--signal-critical)',
              color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #fff',
            }}>3</span>
          </button>

          {showNotifs && (
            <div style={{
              position: 'absolute', top: 44, right: 0,
              width: 300, background: 'var(--surface-elevated)',
              border: '1px solid rgba(15,23,42,0.08)',
              borderRadius: 'var(--radius-large)', boxShadow: 'var(--shadow-3)',
              overflow: 'hidden',
              animation: 'fadeIn 200ms ease-out',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(15,23,42,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Notifications</span>
                <span style={{ fontSize: 11, color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }}>Mark all read</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(15,23,42,0.04)', cursor: 'pointer', transition: 'background 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-secondary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-primary), #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 0 0 2px var(--accent-subtle)',
        }}>
          {user?.name?.[0] || 'U'}
        </div>
      </div>
    </header>
  );
}
