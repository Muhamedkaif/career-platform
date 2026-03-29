import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import JobCard from '../../components/JobCard';
import { Skeleton } from '../../components/Loader';

const mockJobs = [
  { id: 1, title: 'Software Engineer', company: 'Google', salary: '₹18–24 LPA', location: 'Bangalore', type: 'Full-time', match: 92, urgency: 'critical', deadline: 'Closes in 2 days', skills: ['React', 'Python', 'DSA'], brandColor: '#4285F4', brandColorEnd: '#34A853' },
  { id: 2, title: 'Azure Cloud Engineer', company: 'Microsoft', salary: '₹16–22 LPA', location: 'Hyderabad', type: 'Full-time', match: 95, urgency: 'high', deadline: '5 days left', skills: ['Azure', 'Python', 'Docker'], brandColor: '#0078D4', brandColorEnd: '#00BCF2' },
  { id: 3, title: 'ML Engineer', company: 'OpenAI', salary: '₹20–30 LPA', location: 'Remote', type: 'Full-time', match: 78, urgency: 'normal', deadline: '2 weeks', skills: ['Python', 'ML', 'PyTorch'], brandColor: '#000', brandColorEnd: '#444' },
  { id: 4, title: 'Frontend Developer', company: 'Figma', salary: '₹14–20 LPA', location: 'Remote', type: 'Full-time', match: 88, urgency: 'normal', deadline: '3 weeks', skills: ['React', 'TypeScript', 'CSS'], brandColor: '#F24E1E', brandColorEnd: '#FF7262' },
  { id: 5, title: 'Data Engineer', company: 'Stripe', salary: '₹15–22 LPA', location: 'Pune', type: 'Full-time', match: 70, urgency: 'normal', deadline: '4 weeks', skills: ['Python', 'SQL', 'Spark'], brandColor: '#635BFF', brandColorEnd: '#8A84FF' },
  { id: 6, title: 'Backend Engineer', company: 'Zepto', salary: '₹12–18 LPA', location: 'Mumbai', type: 'Full-time', match: 82, urgency: 'high', deadline: '1 week', skills: ['Node.js', 'MongoDB', 'Redis'], brandColor: '#8B5CF6', brandColorEnd: '#C084FC' },
];

const FILTERS = ['All', 'Best Match', 'Urgent', 'Remote', 'Full-time'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [applied, setApplied] = useState(new Set());

  useEffect(() => {
    setTimeout(() => { setJobs(mockJobs); setLoading(false); }, 700);
  }, []);

  const filtered = jobs
    .filter(j => {
      const q = search.toLowerCase();
      return !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.skills.some(s => s.toLowerCase().includes(q));
    })
    .filter(j => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Best Match') return j.match >= 85;
      if (activeFilter === 'Urgent') return j.urgency === 'critical' || j.urgency === 'high';
      if (activeFilter === 'Remote') return j.location === 'Remote';
      if (activeFilter === 'Full-time') return j.type === 'Full-time';
      return true;
    });

  const handleApply = (id) => {
    return new Promise(res => {
      setTimeout(() => {
        setApplied(prev => new Set([...prev, id]));
        res();
      }, 600);
    });
  };

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Navbar title="Job Opportunities" />

      <div style={{ padding: '24px 32px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-tertiary)' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by role, company, or skill..."
              style={{
                width: '100%', padding: '10px 14px 10px 38px',
                border: '1.5px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)',
                fontSize: 14, outline: 'none', background: 'var(--surface-primary)', fontFamily: 'var(--font-ui)',
                transition: 'border-color 200ms', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding: '8px 14px', border: `1.5px solid ${activeFilter === f ? 'var(--accent-primary)' : 'rgba(15,23,42,0.1)'}`,
                borderRadius: 'var(--radius-default)', background: activeFilter === f ? 'var(--accent-subtle)' : 'var(--surface-primary)',
                color: activeFilter === f ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: activeFilter === f ? 600 : 400, cursor: 'pointer',
                transition: 'all 150ms',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> opportunities
          </span>
          {applied.size > 0 && (
            <span style={{ fontSize: 13, color: 'var(--signal-success)', background: '#F0FDF4', padding: '3px 10px', borderRadius: 4, fontWeight: 600 }}>
              ✓ {applied.size} applied
            </span>
          )}
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ padding: 20, background: 'var(--surface-elevated)', borderRadius: 12, border: '1px solid rgba(15,23,42,0.06)' }}>
                <Skeleton height={20} width="50%" style={{ marginBottom: 12 }} />
                <Skeleton height={14} width="30%" style={{ marginBottom: 8 }} />
                <Skeleton height={12} width="80%" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '64px 32px', textAlign: 'center', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-large)', border: '1px solid rgba(15,23,42,0.06)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No jobs found</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setActiveFilter('All'); }} style={{ marginTop: 16, padding: '8px 20px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-default)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((job, i) => (
              <div key={job.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
                <JobCard job={{ ...job, applied: applied.has(job.id) }} onApply={handleApply} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
