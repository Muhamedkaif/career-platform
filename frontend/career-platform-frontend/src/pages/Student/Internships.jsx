import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { Skeleton } from '../../components/Loader';
import { jobService } from '../../services/jobService';

const statusColors = {
  Open: { bg: '#F0FDF4', text: '#059669', border: '#BBF7D0' },
  Applied: { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' },
  Shortlisted: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  Rejected: { bg: '#FFF1F2', text: '#DC2626', border: '#FECDD3' },
};

export default function Internships() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState(new Set(['4']));

  useEffect(() => {
    jobService.getAllInternships().then(response => {
      setData(response.data);
    }).catch(error => {
      console.error('Error fetching internships:', error);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const filtered = data.filter(i => {
    const q = search.toLowerCase();
    return !q || i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q);
  });

  const handleApply = (id) => {
    setApplied(prev => new Set([...prev, String(id)]));
  };

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Navbar title="Internship Opportunities" />

      <div style={{ padding: '24px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ position: 'relative', marginBottom: 24, maxWidth: 360 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-tertiary)' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search internships..."
            style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1.5px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 14, outline: 'none', background: 'var(--surface-primary)', fontFamily: 'var(--font-ui)', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'}
          />
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ background: 'var(--surface-elevated)', borderRadius: 12, padding: 20 }}><Skeleton height={140} /></div>)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map((intern, i) => {
              const isApplied = applied.has(String(intern.id)) || intern.status === 'Applied';
              const sc = statusColors[isApplied ? 'Applied' : intern.status] || statusColors.Open;
              return (
                <div key={intern.id} style={{
                  background: 'var(--surface-elevated)', border: '1px solid rgba(15,23,42,0.06)',
                  borderRadius: 'var(--radius-large)', padding: 20, boxShadow: 'var(--shadow-1)',
                  transition: 'all 200ms ease-out', animation: `fadeIn 0.3s ease-out ${i * 0.06}s both`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: intern.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>
                        {intern.company[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{intern.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{intern.company}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: sc.text, background: sc.bg, border: `1px solid ${sc.border}`, padding: '3px 8px', borderRadius: 4 }}>
                      {isApplied ? 'Applied' : intern.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    {[
                      { label: 'Duration', value: intern.duration },
                      { label: 'Stipend', value: intern.stipend },
                      { label: 'Location', value: intern.location },
                      { label: 'Deadline', value: intern.deadline },
                    ].map(d => (
                      <div key={d.label} style={{ background: 'var(--surface-sunken)', borderRadius: 6, padding: '8px 10px' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{d.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{d.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {intern.skills.map(s => (
                      <span key={s} style={{ fontSize: 11, padding: '3px 8px', background: 'var(--accent-subtle)', color: 'var(--accent-primary)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--signal-success)' }}>{intern.match}% match</span>
                    <button
                      onClick={() => handleApply(intern.id)}
                      disabled={isApplied}
                      style={{
                        padding: '7px 18px', background: isApplied ? 'var(--surface-sunken)' : 'var(--accent-primary)',
                        color: isApplied ? 'var(--text-secondary)' : '#fff',
                        border: 'none', borderRadius: 'var(--radius-default)', fontSize: 13, fontWeight: 600,
                        cursor: isApplied ? 'default' : 'pointer', transition: 'all 150ms',
                      }}
                    >
                      {isApplied ? 'Applied ✓' : 'Apply Now →'}
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
