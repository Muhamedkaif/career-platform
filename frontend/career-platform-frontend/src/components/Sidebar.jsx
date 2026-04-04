import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { to: '/students/dashboard', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/students/profile', label: 'Profile', icon: '◉' },
  { to: '/students/skills', label: 'Skills', icon: '◈' },
  { to: '/students/jobs', label: 'Jobs', icon: '◎' },
  { to: '/students/internships', label: 'Internships', icon: '◷' },
  { to: '/students/ai-recommendations', label: 'AI Analyze', icon: '✦' },
  { to: '/students/certificates', label: 'Certificates', icon: '◆' },
  { to: '/students/resume', label: 'Resume', icon: '◻' },
];

const facultyLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/admin/students', label: 'Students', icon: '◉' },
  { to: '/admin/post-job', label: 'Post Job', icon: '◎' },
  { to: '/admin/post-internship', label: 'Post Internship', icon: '◷' },
  { to: '/admin/analytics', label: 'Analytics', icon: '◈' },
  { to: '/admin/announcements', label: 'Announcements', icon: '◆' },
];

export default function Sidebar() {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const links = role === 'admin' ? facultyLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: collapsed ? 64 : 220,
      minHeight: '100vh',
      background: 'var(--surface-primary)',
      borderRight: '1px solid rgba(15,23,42,0.06)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      transition: 'width 250ms cubic-bezier(0.4,0,0.2,1)',
      position: 'fixed',
      top: 0, left: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-1)',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '20px 16px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: '1px solid rgba(15,23,42,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0,
        }}>C</div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>CareerOS</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{role}</div>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 10px',
              borderRadius: 'var(--radius-default)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-subtle)' : 'transparent',
              transition: 'all 150ms ease-out',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('EEF2FF')) {
                e.currentTarget.style.background = 'var(--surface-secondary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.className.includes('active')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: 'center' }}>{link.icon}</span>
            {!collapsed && link.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(15,23,42,0.06)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            borderRadius: 'var(--radius-default)', color: 'var(--text-tertiary)',
            fontSize: 14, transition: 'all 150ms ease-out', width: '100%',
          }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <span style={{ fontSize: 16 }}>{collapsed ? '▷' : '◁'}</span>
          {!collapsed && <span>Collapse</span>}
        </button>

        {!collapsed && user && (
          <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary), #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {user.name?.[0] || user.email?.[0] || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'User'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            borderRadius: 'var(--radius-default)', color: 'var(--signal-critical)',
            fontSize: 14, transition: 'all 150ms ease-out', width: '100%',
          }}
        >
          <span style={{ fontSize: 16 }}>↩</span>
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  );
}
