import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { Skeleton } from '../../components/Loader';

const allStudents = [
  { id: 1, name: 'Rahul Sharma', dept: 'CSE', score: 85, status: 'active', applications: 12, risk: 'low', batch: '2025', cgpa: '8.9', skills: ['React', 'Python', 'DSA'] },
  { id: 2, name: 'Priya Patel', dept: 'IT', score: 78, status: 'placed', applications: 8, risk: 'none', batch: '2025', cgpa: '8.2', skills: ['Node.js', 'SQL', 'MongoDB'] },
  { id: 3, name: 'Amit Kumar', dept: 'ECE', score: 45, status: 'at-risk', applications: 2, risk: 'high', batch: '2025', cgpa: '6.1', skills: ['Python', 'MATLAB'] },
  { id: 4, name: 'Sneha Reddy', dept: 'CSE', score: 91, status: 'active', applications: 15, risk: 'low', batch: '2025', cgpa: '9.2', skills: ['React', 'TypeScript', 'AWS'] },
  { id: 5, name: 'Karan Singh', dept: 'ME', score: 38, status: 'at-risk', applications: 1, risk: 'critical', batch: '2025', cgpa: '5.8', skills: ['CAD', 'Python'] },
  { id: 6, name: 'Ananya Das', dept: 'IT', score: 72, status: 'active', applications: 6, risk: 'low', batch: '2025', cgpa: '7.8', skills: ['Java', 'Spring Boot', 'SQL'] },
  { id: 7, name: 'Rohan Mehta', dept: 'CSE', score: 66, status: 'active', applications: 9, risk: 'low', batch: '2025', cgpa: '7.5', skills: ['Go', 'Docker', 'Kubernetes'] },
  { id: 8, name: 'Nisha Verma', dept: 'ECE', score: 55, status: 'active', applications: 4, risk: 'low', batch: '2025', cgpa: '7.0', skills: ['Embedded C', 'Python'] },
];

const statusStyles = {
  active: { color: '#059669', bg: '#F0FDF4', label: '● Active' },
  placed: { color: '#0284C7', bg: '#EFF6FF', label: '● Placed' },
  'at-risk': { color: '#DC2626', bg: '#FFF1F2', label: '○ At Risk' },
};

export default function Students() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setTimeout(() => { setData(allStudents); setLoading(false); }, 600);
  }, []);

  const filtered = data
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => deptFilter === 'All' || s.dept === deptFilter);

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Navbar title="Student Management" />

      <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: 20 }}>
        <Card elevation={2}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-tertiary)' }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name..."
                style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1.5px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 13, outline: 'none', background: 'var(--surface-primary)', fontFamily: 'var(--font-ui)', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'}
              />
            </div>
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{ padding: '8px 12px', border: '1.5px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 13, background: 'var(--surface-primary)', outline: 'none' }}>
              {['All', 'CSE', 'IT', 'ECE', 'ME'].map(d => <option key={d}>{d}</option>)}
            </select>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>{filtered.length} students</span>
          </div>

          {loading ? <Skeleton height={300} /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {filtered.map((s, i) => {
                const ss = statusStyles[s.status];
                return (
                  <div key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)}
                    style={{
                      padding: 16, background: selected?.id === s.id ? 'var(--accent-subtle)' : 'var(--surface-sunken)',
                      border: `1.5px solid ${selected?.id === s.id ? 'var(--accent-primary)' : 'rgba(15,23,42,0.06)'}`,
                      borderRadius: 'var(--radius-large)', cursor: 'pointer', transition: 'all 200ms',
                      animation: `fadeIn 0.3s ease-out ${i * 0.04}s both`,
                    }}
                    onMouseEnter={e => { if (selected?.id !== s.id) e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                    onMouseLeave={e => { if (selected?.id !== s.id) e.currentTarget.style.borderColor = 'rgba(15,23,42,0.06)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>{s.name[0]}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s.dept} · {s.batch}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: ss.color, background: ss.bg, padding: '2px 7px', borderRadius: 4 }}>{ss.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1, background: 'var(--surface-primary)', borderRadius: 6, padding: '6px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: s.score >= 70 ? 'var(--signal-success)' : s.score >= 50 ? 'var(--signal-warning)' : 'var(--signal-critical)' }}>{s.score}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Score</div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--surface-primary)', borderRadius: 6, padding: '6px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{s.cgpa}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>CGPA</div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--surface-primary)', borderRadius: 6, padding: '6px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{s.applications}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Apps</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Detail Panel */}
        {selected && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <Card title={selected.name} subtitle={`${selected.dept} · Batch ${selected.batch}`} elevation={2} action={
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 16 }}>✕</button>
            }>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ l: 'Skill Score', v: selected.score, mono: true }, { l: 'CGPA', v: selected.cgpa, mono: true }, { l: 'Applications', v: selected.applications, mono: true }, { l: 'Risk Level', v: selected.risk, mono: false }].map(i => (
                    <div key={i.l} style={{ background: 'var(--surface-sunken)', borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{i.l}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, fontFamily: i.mono ? 'var(--font-mono)' : 'var(--font-ui)', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{i.v}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Skills</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selected.skills.map(sk => <span key={sk} style={{ fontSize: 11, padding: '3px 8px', background: 'var(--accent-subtle)', color: 'var(--accent-primary)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{sk}</span>)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ flex: 1, padding: '9px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-default)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View Full Profile</button>
                  <button style={{ padding: '9px 14px', background: 'var(--surface-sunken)', color: 'var(--text-secondary)', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 'var(--radius-default)', fontSize: 13, cursor: 'pointer' }}>Message</button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
