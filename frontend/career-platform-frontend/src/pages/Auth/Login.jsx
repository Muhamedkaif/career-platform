import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import ritImage from '../../assets/rit-chennai.jpg';

const stats = [
  { value: '850+', label: 'Placements' },
  { value: '₹12 LPA', label: 'Avg Package' },
  { value: '200+', label: 'Partner Companies' },
  { value: '95%', label: 'Satisfaction' },
];

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    triggerError("Please fill in all fields");
    return;
  }

  setLoading(true);
  setError("");

  try {
    let response;

    if (role === "student") {
      response = await authService.loginStudent({ email, password });
    } else {
      response = await authService.loginAdmin({ email, password });
    }

    const token = response.data;

    // ✅ Prefer backend role if available
    const userRole = response.data.role || role;

    console.log("Sending:", { email, password, userRole });

    // ✅ Store auth data
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    console.log(token);
    // ✅ Update context
    login({ email }, userRole, token);

    // ✅ Navigate correctly (FIXED route)
    navigate(userRole === "admin" ? "/admin/dashboard" : "/students/dashboard");

  } catch (err) {
    triggerError(
      err.response?.data?.message || "Invalid credentials"
    );
  } finally {
    setLoading(false);
  }
};

  const triggerError = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F172A' }}>
      <style>{`
        @keyframes meshMove {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          33% { transform: translate(30px, -20px) rotate(120deg); }
          66% { transform: translate(-20px, 15px) rotate(240deg); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-12px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.7; }
        }
        @keyframes statPop {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes formSlide {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes pillSlide {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .login-form-field input:focus {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.12) !important;
        }
        .login-submit:hover:not(:disabled) {
          background: var(--accent-hover) !important;
          transform: scale(1.01) !important;
          box-shadow: 0 8px 20px rgba(79,70,229,0.4) !important;
        }
        .login-submit:active:not(:disabled) {
          transform: scale(0.99) !important;
        }
      `}</style>

      {/* Visual Panel */}
      <div style={{
        width: '55%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #1e3a5f 60%, #0c4a6e 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: 48,
      }}>
        {/* Animated mesh blobs */}
        {[
          { w: 500, h: 500, top: '-20%', left: '-10%', c1: '#4F46E5', c2: '#7C3AED', dur: '8s' },
          { w: 400, h: 400, top: '40%', right: '-15%', c1: '#0284C7', c2: '#4F46E5', dur: '12s' },
          { w: 300, h: 300, bottom: '-10%', left: '30%', c1: '#7C3AED', c2: '#EC4899', dur: '10s' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: b.w, height: b.h,
            top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${b.c1}44 0%, ${b.c2}22 60%, transparent 100%)`,
            animation: `meshMove ${b.dur} ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            filter: 'blur(40px)',
          }} />
        ))}

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ marginBottom: 48, animation: 'statPop 0.6s ease-out' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-xl)', padding: '12px 24px',
            }}>
              <div style={{
  width: 40,
  height: 40,
  borderRadius: 10,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--accent-primary)'
}}>
  <img
    src={ritImage}
    alt="Logo"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
  />
</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px' }}>CareerOS</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Placement Intelligence</div>
              </div>
            </div>
          </div>

          <h2 style={{
            color: '#fff', fontSize: 36, fontWeight: 800, letterSpacing: '-1px',
            lineHeight: 1.2, marginBottom: 16,
            animation: 'statPop 0.6s ease-out 0.1s both',
          }}>
            Where Careers<br />
            <span style={{ background: 'linear-gradient(135deg, #818CF8, #C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Take Shape
            </span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 48, animation: 'statPop 0.6s ease-out 0.2s both' }}>
            AI-powered placement intelligence for the next generation of talent.
          </p>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 380 }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-large)',
                padding: '20px 16px',
                animation: `statPop 0.5s ease-out ${0.3 + i * 0.1}s both`,
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '-0.5px' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 4, height: 4,
            borderRadius: '50%',
            background: `rgba(${[130, 168, 200, 130, 168, 200][i]},${[120, 200, 255, 120, 200, 255][i]},255,0.6)`,
            top: `${[20, 40, 60, 75, 85, 30][i]}%`,
            left: `${[15, 75, 20, 80, 40, 55][i]}%`,
            animation: `floatUp ${[3, 4, 3.5, 5, 4.5, 3.8][i]}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}
      </div>

      {/* Form Panel */}
      <div style={{
        width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFFFFF', padding: '48px 64px',
      }}>
        <div style={{
          width: '100%', maxWidth: 380,
          animation: mounted ? 'formSlide 0.5s ease-out' : 'none',
        }}>
          {/* Role Toggle */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sign in as</p>
            <div style={{
              display: 'flex', background: 'var(--surface-sunken)',
              borderRadius: 'var(--radius-large)', padding: 4, width: 'fit-content',
              gap: 2,
            }}>
              {['student', 'admin'].map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: '10px 24px', border: 'none', cursor: 'pointer',
                    borderRadius: 'var(--radius-default)',
                    background: role === r ? 'var(--surface-elevated)' : 'transparent',
                    boxShadow: role === r ? 'var(--shadow-2)' : 'none',
                    color: role === r ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: role === r ? 600 : 400,
                    fontSize: 14, fontFamily: 'var(--font-ui)',
                    transition: 'all 300ms ease-out',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <span>{r === 'student' ? '🎓' : '🧑‍🏫'}</span>
                  <span style={{ textTransform: 'capitalize' }}>{r}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Sign in to your {role === 'admin' ? 'admin' : 'student'} account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email */}
            <div className="login-form-field">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'faculty@college.edu' : 'you@college.edu'}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: `1.5px solid ${error ? 'var(--signal-critical)' : 'rgba(15,23,42,0.12)'}`,
                  borderRadius: 'var(--radius-default)',
                  fontSize: 14, color: 'var(--text-primary)',
                  background: 'var(--surface-primary)',
                  outline: 'none', transition: 'all 200ms ease-out',
                  fontFamily: 'var(--font-ui)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password */}
            <div className="login-form-field">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '11px 44px 11px 14px',
                    border: `1.5px solid ${error ? 'var(--signal-critical)' : 'rgba(15,23,42,0.12)'}`,
                    borderRadius: 'var(--radius-default)',
                    fontSize: 14, color: 'var(--text-primary)',
                    background: 'var(--surface-primary)',
                    outline: 'none', transition: 'all 200ms ease-out',
                    fontFamily: 'var(--font-ui)',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: `translateY(-50%) rotate(${showPass ? 180 : 0}deg)`,
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 16, transition: 'transform 200ms ease-out',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', background: '#FFF1F2',
                border: '1px solid #FECDD3', borderRadius: 'var(--radius-default)',
                color: 'var(--signal-critical)', fontSize: 13, fontWeight: 500,
                animation: shake ? 'shake 400ms ease-out' : 'none',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="login-submit"
              style={{
                padding: '13px 24px',
                background: loading ? 'var(--accent-subtle)' : 'var(--accent-primary)',
                color: loading ? 'var(--accent-primary)' : '#fff',
                border: 'none', borderRadius: 'var(--radius-default)',
                fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
                transition: 'all 150ms ease-out',
                fontFamily: 'var(--font-ui)', letterSpacing: '-0.2px',
                boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid var(--accent-primary)', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </span>
              ) : (
                `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)} →`
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
              Demo mode — credentials pre-filled. Just click sign in.
            </p>
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
