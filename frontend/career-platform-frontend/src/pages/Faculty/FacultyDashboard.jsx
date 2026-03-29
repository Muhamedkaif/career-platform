import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { Skeleton } from '../../components/Loader';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';

const mockData = {
  kpis: [
    { label: 'Total Students', value: 324, delta: '+12 this sem', deltaDir: 'up', icon: '▲', color: '#4F46E5' },
    { label: 'Placement Rate', value: '78.5%', delta: '↑ 8% YoY', deltaDir: 'up', icon: '●', color: '#059669' },
    { label: 'Active Jobs', value: 47, delta: '15 expiring', deltaDir: 'warn', icon: '◆', color: '#0284C7' },
    { label: 'Avg Skill Score', value: 72, delta: '↑ 3 pts', deltaDir: 'up', icon: '★', color: '#7C3AED' },
  ],
  placementTrend: [
    { month: 'Jan', placed: 12, target: 20 },
    { month: 'Feb', placed: 18, target: 20 },
    { month: 'Mar', placed: 15, target: 22 },
    { month: 'Apr', placed: 25, target: 22 },
    { month: 'May', placed: 30, target: 25 },
    { month: 'Jun', placed: 28, target: 25 },
    { month: 'Jul', placed: 35, target: 30 },
    { month: 'Aug', placed: 42, target: 35 },
  ],
  skillHeatmap: [
    { dept: 'CSE', React: 82, Python: 78, SQL: 70, DSA: 85, DevOps: 45 },
    { dept: 'IT', React: 75, Python: 65, SQL: 72, DSA: 68, DevOps: 38 },
    { dept: 'ECE', React: 40, Python: 55, SQL: 60, DSA: 72, DevOps: 30 },
    { dept: 'ME', React: 20, Python: 35, SQL: 45, DSA: 40, DevOps: 25 },
  ],
  alerts: [
    { id: 1, severity: 'critical', title: '15 students below threshold', desc: 'Score < 50 in placement readiness', action: 'View List' },
    { id: 2, severity: 'warning', title: '8 resumes pending review', desc: 'Submitted more than 3 days ago', action: 'Review Now' },
    { id: 3, severity: 'warning', title: '5 jobs expiring this week', desc: 'Deadlines approaching fast', action: 'Extend' },
    { id: 4, severity: 'info', title: 'New batch onboarding complete', desc: '2025 batch fully onboarded', action: 'View Report' },
  ],
  students: [
    { id: 1, name: 'Rahul Sharma', dept: 'CSE', score: 85, status: 'active', applications: 12, risk: 'low' },
    { id: 2, name: 'Priya Patel', dept: 'IT', score: 78, status: 'placed', applications: 8, risk: 'none' },
    { id: 3, name: 'Amit Kumar', dept: 'ECE', score: 45, status: 'at-risk', applications: 2, risk: 'high' },
    { id: 4, name: 'Sneha Reddy', dept: 'CSE', score: 91, status: 'active', applications: 15, risk: 'low' },
    { id: 5, name: 'Karan Singh', dept: 'ME', score: 38, status: 'at-risk', applications: 1, risk: 'critical' },
    { id: 6, name: 'Ananya Das', dept: 'IT', score: 72, status: 'active', applications: 6, risk: 'low' },
  ],
};

const alertColors = {
  critical: { bg: '#FFF1F2', border: '#FECDD3', dot: '#DC2626', text: '#DC2626', icon: '🔴' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', dot: '#D97706', text: '#D97706', icon: '🟡' },
  info: { bg: '#EFF6FF', border: '#BFDBFE', dot: '#0284C7', text: '#0284C7', icon: '🟢' },
};

const statusStyles = {
  active: { color: '#059669', bg: '#F0FDF4', label: '● Active' },
  placed: { color: '#0284C7', bg: '#EFF6FF', label: '● Placed' },
  'at-risk': { color: '#DC2626', bg: '#FFF1F2', label: '○ At Risk' },
};

const riskStyles = {
  none: null,
  low: { color: '#D97706', bg: '#FFFBEB' },
  high: { color: '#DC2626', bg: '#FFF1F2' },
  critical: { color: '#fff', bg: '#DC2626' },
};

const SKILL_KEYS = ['React', 'Python', 'SQL', 'DSA', 'DevOps'];
const SKILL_COLORS = ['#4F46E5', '#059669', '#0284C7', '#7C3AED', '#D97706'];

function getHeatColor(value) {
  if (value >= 80) return '#059669';
  if (value >= 65) return '#4F46E5';
  if (value >= 50) return '#D97706';
  return '#DC2626';
}

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedAlert, setExpandedAlert] = useState(null);

  useEffect(() => {
    setTimeout(() => { setData(mockData); setLoading(false); }, 900);
  }, []);

  const filteredStudents = (data?.students || [])
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => deptFilter === 'All' || s.dept === deptFilter)
    .filter(s => statusFilter === 'All' || s.status === statusFilter);

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Navbar title="Placement Analytics" actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '6px 14px', background: 'var(--surface-secondary)', color: 'var(--text-secondary)', border: '1px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 13, cursor: 'pointer' }}>
            Export ↓
          </button>
          <button style={{ padding: '6px 14px', background: 'var(--surface-secondary)', color: 'var(--text-secondary)', border: '1px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 13, cursor: 'pointer' }}>
            Q4 2024 ▼
          </button>
          <span style={{ fontSize: 12, color: 'var(--signal-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--signal-success)', display: 'inline-block' }} />
            Live
          </span>
        </div>
      } />

      <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, animation: 'fadeIn 0.4s ease-out' }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ background: 'var(--surface-elevated)', borderRadius: 12, padding: 20 }}><Skeleton height={80} /></div>)
            : data.kpis.map((kpi, i) => (
              <div key={i} style={{
                background: 'var(--surface-elevated)',
                border: '1px solid rgba(15,23,42,0.06)',
                borderRadius: 'var(--radius-large)', padding: '20px',
                boxShadow: 'var(--shadow-1)',
                transition: 'all 200ms', cursor: 'default',
                position: 'relative', overflow: 'hidden',
                animation: `fadeIn 0.4s ease-out ${i * 0.07}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '50%', background: `${kpi.color}0A`, transform: 'translate(20px, -20px)' }} />
                <div style={{ fontSize: 22, marginBottom: 4, color: kpi.color }}>{kpi.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '-1px', lineHeight: 1 }}>{kpi.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0' }}>{kpi.label}</div>
                <div style={{ fontSize: 12, color: kpi.deltaDir === 'up' ? 'var(--signal-success)' : kpi.deltaDir === 'warn' ? 'var(--signal-warning)' : 'var(--text-tertiary)', fontWeight: 600 }}>{kpi.delta}</div>
              </div>
            ))}
        </div>

        {/* Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Left Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Placement Trend Chart */}
            <Card title="Placement Trend" subtitle="Monthly placements vs target" elevation={2}>
              {loading ? <Skeleton height={240} /> : (
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.placementTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="placedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E2E8F0" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#E2E8F0" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.05)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 8, fontSize: 13 }} />
                      <Area type="monotone" dataKey="target" stroke="#CBD5E1" strokeDasharray="4 2" fill="url(#targetGrad)" strokeWidth={1.5} dot={false} name="Target" />
                      <Area type="monotone" dataKey="placed" stroke="#4F46E5" fill="url(#placedGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }} name="Placed" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Skill Heatmap */}
            <Card title="Skill Heatmap" subtitle="Dept-wise proficiency across key skills" elevation={2}>
              {loading ? <Skeleton height={180} /> : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, padding: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dept</th>
                        {SKILL_KEYS.map((k, i) => (
                          <th key={k} style={{ textAlign: 'center', fontSize: 12, color: SKILL_COLORS[i], fontWeight: 600, padding: '0 8px 12px', fontFamily: 'var(--font-mono)' }}>{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.skillHeatmap.map((row, ri) => (
                        <tr key={row.dept}>
                          <td style={{ padding: '6px 0', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{row.dept}</td>
                          {SKILL_KEYS.map(k => {
                            const val = row[k];
                            const heatColor = getHeatColor(val);
                            return (
                              <td key={k} style={{ padding: '6px 8px', textAlign: 'center' }}>
                                <div style={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  width: 52, height: 28, borderRadius: 6,
                                  background: `${heatColor}18`,
                                  border: `1px solid ${heatColor}30`,
                                  fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)',
                                  color: heatColor, cursor: 'default',
                                }}>
                                  {val}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Alert Center */}
            <Card title="Alert Center" subtitle="Priority-based notifications" elevation={2} padding={16}>
              {loading ? <Skeleton height={200} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {data.alerts.map((alert, i) => {
                    const cfg = alertColors[alert.severity];
                    const isExpanded = expandedAlert === alert.id;
                    return (
                      <div key={alert.id} style={{
                        background: cfg.bg, border: `1px solid ${cfg.border}`,
                        borderRadius: 'var(--radius-default)', padding: '10px 12px',
                        cursor: 'pointer', transition: 'all 150ms',
                        animation: `fadeIn 0.3s ease-out ${i * 0.07}s both`,
                      }}
                        onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <span style={{ fontSize: 14 }}>{cfg.icon}</span>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: cfg.text, lineHeight: 1.3 }}>{alert.title}</div>
                              {isExpanded && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{alert.desc}</div>}
                            </div>
                          </div>
                          <span style={{ fontSize: 12, color: cfg.text, flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
                        </div>
                        {isExpanded && (
                          <button style={{
                            marginTop: 10, fontSize: 12, fontWeight: 600, padding: '5px 12px',
                            background: 'rgba(255,255,255,0.7)', border: `1px solid ${cfg.border}`,
                            borderRadius: 6, cursor: 'pointer', color: cfg.text,
                          }}>
                            {alert.action} →
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions" elevation={1} padding={16}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '+ Post Job', to: '/faculty/post-job', color: 'var(--accent-primary)' },
                  { label: '+ Announcement', to: '/faculty/announcements', color: '#059669' },
                  { label: '📊 Full Report', to: '/faculty/analytics', color: '#7C3AED' },
                ].map(a => (
                  <button key={a.label} onClick={() => navigate(a.to)} style={{
                    padding: '10px 16px', background: 'var(--surface-sunken)',
                    border: `1px solid rgba(15,23,42,0.06)`, borderRadius: 'var(--radius-default)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', color: a.color,
                    textAlign: 'left', transition: 'all 150ms',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-secondary)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-sunken)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Student Table */}
        <Card title="Student Overview" subtitle="Searchable & filterable student roster" elevation={2} style={{ animation: 'fadeIn 0.5s ease-out 0.2s both' }}>
          {/* Table Controls */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-tertiary)' }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
                style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1.5px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 13, outline: 'none', background: 'var(--surface-primary)', fontFamily: 'var(--font-ui)', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'}
              />
            </div>
            {[
              { label: 'All Depts', key: 'dept', options: ['All', 'CSE', 'IT', 'ECE', 'ME'], value: deptFilter, setter: setDeptFilter },
              { label: 'All Status', key: 'status', options: ['All', 'active', 'placed', 'at-risk'], value: statusFilter, setter: setStatusFilter },
            ].map(f => (
              <select key={f.key} value={f.value} onChange={e => f.setter(e.target.value)} style={{
                padding: '8px 12px', border: '1.5px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)',
                fontSize: 13, background: 'var(--surface-primary)', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none',
              }}>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{filteredStudents.length} students</span>
          </div>

          {loading ? <Skeleton height={200} /> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)' }}>
                    {['Name', 'Dept', 'Score', 'Status', 'Applications', 'Risk', ''].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(15,23,42,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s, i) => {
                    const ss = statusStyles[s.status];
                    const rs = riskStyles[s.risk];
                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(15,23,42,0.04)', transition: 'background 150ms', animation: `fadeIn 0.3s ease-out ${i * 0.04}s both` }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-secondary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>{s.name[0]}</div>
                            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{s.dept}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 60, height: 6, background: 'var(--surface-sunken)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${s.score}%`, background: s.score >= 70 ? 'var(--signal-success)' : s.score >= 50 ? 'var(--signal-warning)' : 'var(--signal-critical)', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: s.score >= 70 ? 'var(--signal-success)' : s.score >= 50 ? 'var(--signal-warning)' : 'var(--signal-critical)' }}>{s.score}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: ss.color, background: ss.bg, padding: '3px 8px', borderRadius: 4 }}>{ss.label}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{s.applications}</td>
                        <td style={{ padding: '12px 14px' }}>
                          {rs && <span style={{ fontSize: 11, fontWeight: 700, color: rs.color, background: rs.bg, padding: '3px 8px', borderRadius: 4, textTransform: 'capitalize' }}>{s.risk}</span>}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button style={{ fontSize: 12, color: 'var(--accent-primary)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            View →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>
                  No students match your search
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
