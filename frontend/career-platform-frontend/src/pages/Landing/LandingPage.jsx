import React from 'react';
import { useNavigate } from 'react-router-dom';
import ritImage from '../../assets/rit-chennai.jpg';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <style>{`
        @keyframes floatUp { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={{
  width: 120,
  height: 120,
  borderRadius: 20,
  overflow: 'hidden',
  marginBottom: 24,
  animation: 'floatUp 3s ease-in-out infinite',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
}}>
  <img
    src={ritImage}
    alt="RIT Chennai"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
  />
</div>
      <h1 style={{ color: '#fff', fontSize: 52, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16, animation: 'fadeIn 0.6s ease-out 0.1s both' }}>
        CareerOS
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, marginBottom: 40, maxWidth: 480, lineHeight: 1.6, animation: 'fadeIn 0.6s ease-out 0.2s both' }}>
        Next-generation placement intelligence platform for students and faculty.
      </p>
      <button onClick={() => navigate('/login')} style={{
        padding: '14px 36px', background: 'var(--accent-primary)', color: '#fff',
        border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(79,70,229,0.4)', transition: 'all 200ms',
        animation: 'fadeIn 0.6s ease-out 0.3s both',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Get Started →
      </button>
    </div>
  );
}
