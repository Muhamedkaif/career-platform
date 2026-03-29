import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { Skeleton, SkeletonCard } from '../../components/Loader';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts';

const MetricPill = ({ value, label, delta, color = 'var(--accent-primary)', delay = 0 }) => (
  <div style={{
    background: 'var(--surface-elevated)',
    border: '1px solid rgba(15,23,42,0.06)',
    borderRadius: 'var(--radius-large)',
    padding: '16px 20px',
    minWidth: 140,
    boxShadow: 'var(--shadow-1)',
    animation: `fadeIn 0.5s ease-out ${delay}s both`,
    flexShrink: 0,
  }}>
    <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'var(--font-mono)', letterSpacing: '-1px' }}>{value}</div>
    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
    {delta && (
      <div style={{ fontSize: 11, color: 'var(--signal-success)', fontWeight: 600, marginTop: 4 }}>↑ {delta}</div>
    )}
  </div>
);

const CustomRadarDot = (props) => {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#4F46E5" stroke="#fff" strokeWidth={2} style={{ cursor: 'pointer' }} />
      <circle cx={cx} cy={cy} r={9} fill="rgba(79,70,229,0.15)" />
    </g>
  );
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSkill, setActiveSkill] = useState(null);
useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/students/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await res.json();

      console.log("Dashboard API:", userData);

      // ✅ Map backend → UI format (IMPORTANT)
      const mappedData = {
        skillScore: userData.skillScore || 70,
        jobsMatched: userData.jobsMatched || 0,
        internsActive: userData.internsActive || 0,
        certsEarned: userData.certsEarned || 0,

        skills: userData.skills || [],
        skillGaps: userData.skillGaps || [],
        opportunities: userData.opportunities || [],
        notifications: userData.notifications || [],
        internships: userData.internships || [],
      };

      setData(mappedData);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);
  const readinessPercent = 78;

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes progressFill { from { width: 0; } to { width: var(--target-width); } }
      `}</style>
      <Navbar title="" />

      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Contextual Header */}
        <div style={{ marginBottom: 24, animation: 'fadeIn 0.4s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 4 }}>
                Good morning, {user?.name?.split(' ')[0] || 'Student'} 👋
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Placement readiness</span>
                <div style={{ flex: 1, height: 8, background: 'var(--surface-sunken)', borderRadius: 4, overflow: 'hidden', width: 200 }}>
                  <div style={{
                    height: '100%', width: `${readinessPercent}%`,
                    background: 'linear-gradient(90deg, var(--accent-primary), #7C3AED)',
                    borderRadius: 4, transition: 'width 1s ease-out',
                  }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{readinessPercent}%</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => navigate('/student/jobs')} style={{ padding: '8px 16px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-default)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Browse Jobs →
              </button>
              <button onClick={() => navigate('/student/resume')} style={{ padding: '8px 16px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid rgba(15,23,42,0.12)', borderRadius: 'var(--radius-default)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Update Resume
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Strip */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} width={140} height={80} style={{ flexShrink: 0 }} />)
          ) : (
            <>
              <MetricPill value={data.skillScore} label="Skill Score" delta="12% this month" color="var(--accent-primary)" delay={0} />
              <MetricPill value={data.jobsMatched} label="Jobs Matched" delta="+4 new" color="var(--signal-info)" delay={0.1} />
              <MetricPill value={data.internsActive} label="Active Internships" color="var(--signal-warning)" delay={0.2} />
              <MetricPill value={data.certsEarned} label="Certificates" delta="+2 recently" color="var(--signal-success)" delay={0.3} />
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
          {/* Primary Zone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Skill Constellation */}
            <Card title="Skill Constellation" subtitle="Your proficiency across tracked skills" elevation={2}>
              {loading ? <Skeleton height={280} /> : (
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data.skills} margin={{ top: 8, right: 32, bottom: 8, left: 32 }}>
                      <PolarGrid stroke="rgba(15,23,42,0.08)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
                      />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="var(--accent-primary)"
                        fill="var(--accent-primary)"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        dot={<CustomRadarDot />}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Skill Gap Analysis */}
            <Card
              title="Skill Gap Analysis"
              subtitle="Identified gaps with learning paths"
              elevation={2}
              action={
                <button onClick={() => navigate('/student/skills')} style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600, background: 'var(--accent-subtle)', border: 'none', borderRadius: 'var(--radius-default)', padding: '4px 10px', cursor: 'pointer' }}>
                  View Plan →
                </button>
              }
            >
              {loading ? <Skeleton height={160} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {data.skillGaps.map(gap => (
                    <div key={gap.skill}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{gap.skill}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{gap.current}%</span>
                          <span style={{ fontSize: 11, color: 'var(--signal-warning)', fontWeight: 600, background: '#FFFBEB', border: '1px solid #FDE68A', padding: '1px 6px', borderRadius: 4 }}>+{gap.gap} pts needed</span>
                        </div>
                      </div>
                      <div style={{ height: 8, background: 'var(--surface-sunken)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${gap.target}%`, background: 'rgba(15,23,42,0.06)', borderRadius: 4 }} />
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${gap.current}%`, background: `linear-gradient(90deg, ${gap.color}, ${gap.color}cc)`, borderRadius: 4, transition: 'width 0.8s ease-out' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Side Zone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Opportunity Feed */}
            <Card title="🔥 Opportunity Feed" subtitle="Matched to your profile" elevation={2}>
              {loading ? <SkeletonCard lines={3} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {data.opportunities.map((opp, i) => {
                    const urgencyStyle = opp.urgency === 'critical'
                      ? { bg: '#FFF1F2', border: '#FECDD3', badge: '#DC2626' }
                      : opp.urgency === 'high'
                      ? { bg: '#FFFBEB', border: '#FDE68A', badge: '#D97706' }
                      : { bg: '#F0F9FF', border: '#BAE6FD', badge: '#0284C7' };

                    return (
                      <div key={opp.id} style={{
                        padding: '12px 14px',
                        background: urgencyStyle.bg,
                        border: `1px solid ${urgencyStyle.border}`,
                        borderRadius: 'var(--radius-default)',
                        animation: `fadeIn 0.4s ease-out ${i * 0.1}s both`,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{opp.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{opp.company}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: urgencyStyle.badge }}>
                            {opp.match}% match
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: urgencyStyle.badge, fontWeight: 500 }}>{opp.deadline}</span>
                          <button onClick={() => navigate('/student/jobs')} style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 4, padding: '3px 10px', cursor: 'pointer' }}>
                            Apply →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Notifications */}
            <Card title="📢 Recent Activity" elevation={2}>
              {loading ? <SkeletonCard lines={4} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {data.notifications.map((n, i) => (
                    <div key={n.id} style={{
                      display: 'flex', gap: 10, padding: '10px 0',
                      borderBottom: i < data.notifications.length - 1 ? '1px solid rgba(15,23,42,0.05)' : 'none',
                      animation: `fadeIn 0.4s ease-out ${i * 0.08}s both`,
                    }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Horizontal Scroll Cards */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '-0.2px' }}>Active Applications</h2>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              data.internships.map((intern, i) => (
                <div key={intern.id} style={{
                  minWidth: 200, background: 'var(--surface-elevated)',
                  border: '1px solid rgba(15,23,42,0.06)',
                  borderRadius: 'var(--radius-large)', padding: '16px',
                  boxShadow: 'var(--shadow-1)',
                  animation: `fadeIn 0.4s ease-out ${i * 0.1}s both`,
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'box-shadow 200ms, transform 200ms',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: intern.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                      {intern.company[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{intern.company}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{intern.role}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ height: 6, background: 'var(--surface-sunken)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${intern.progress}%`, background: intern.color, borderRadius: 3, transition: 'width 0.8s ease-out' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{intern.progress}%</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: intern.progress > 50 ? 'var(--signal-success)' : 'var(--signal-warning)', background: intern.progress > 50 ? '#F0FDF4' : '#FFFBEB', padding: '2px 8px', borderRadius: 4 }}>
                      {intern.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
