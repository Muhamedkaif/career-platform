import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { Skeleton } from '../../components/Loader';

const mockAnnouncements = [
  { id: 1, title: 'Infosys Campus Drive – Dec 15', body: 'Infosys will be conducting a campus recruitment drive on December 15th. Eligible students from CSE and IT with CGPA ≥ 7.0 are invited to participate.', author: 'Dr. Rajesh Kumar', date: 'Nov 30, 2024', priority: 'high', audience: 'CSE, IT' },
  { id: 2, title: 'Pre-Placement Workshop', body: 'Mandatory aptitude and communication skills workshop for all final-year students scheduled for December 5th, 10 AM – 4 PM in Seminar Hall 3.', author: 'Prof. Sanya Patel', date: 'Nov 28, 2024', priority: 'normal', audience: 'All' },
  { id: 3, title: 'Resume Submission Deadline', body: 'Please submit your updated resumes for the upcoming placement season by December 10th. Late submissions will not be considered.', author: 'Placement Cell', date: 'Nov 25, 2024', priority: 'critical', audience: 'All' },
];

const priorityConfig = {
  critical: { color: '#DC2626', bg: '#FFF1F2', border: '#FECDD3', label: 'Urgent' },
  high: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Important' },
  normal: { color: '#0284C7', bg: '#EFF6FF', border: '#BFDBFE', label: 'Info' },
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', priority: 'normal', audience: 'All' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => { setAnnouncements(mockAnnouncements); setLoading(false); }, 600);
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    const newAnn = { id: Date.now(), ...form, author: 'Dr. Rajesh Kumar', date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) };
    setAnnouncements(prev => [newAnn, ...prev]);
    setForm({ title: '', body: '', priority: 'normal', audience: 'All' });
    setSubmitting(false);
    setShowForm(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Navbar title="Announcements" actions={
        <button onClick={() => setShowForm(v => !v)} style={{ padding: '7px 16px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-default)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? '✕ Cancel' : '+ New Announcement'}
        </button>
      } />

      <div style={{ padding: '24px 32px', maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {success && (
          <div style={{ padding: '12px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-default)', color: 'var(--signal-success)', fontSize: 13, fontWeight: 600, animation: 'fadeIn 0.3s ease-out' }}>
            ✅ Announcement posted and students notified!
          </div>
        )}

        {/* New Announcement Form */}
        {showForm && (
          <Card title="New Announcement" elevation={2} style={{ animation: 'fadeIn 0.25s ease-out' }}>
            <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title..."
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 14, fontFamily: 'var(--font-ui)', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Message *</label>
                <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write your announcement..." rows={4}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 14, fontFamily: 'var(--font-ui)', outline: 'none', resize: 'vertical', minHeight: 100, lineHeight: 1.6, boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 14, fontFamily: 'var(--font-ui)', outline: 'none', background: 'var(--surface-primary)', cursor: 'pointer' }}>
                    <option value="normal">Normal</option>
                    <option value="high">Important</option>
                    <option value="critical">Urgent</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Target Audience</label>
                  <select value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 14, fontFamily: 'var(--font-ui)', outline: 'none', background: 'var(--surface-primary)', cursor: 'pointer' }}>
                    {['All', 'CSE', 'IT', 'ECE', 'ME'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid rgba(15,23,42,0.12)', borderRadius: 'var(--radius-default)', fontSize: 14, cursor: 'pointer', color: 'var(--text-secondary)' }}>Cancel</button>
                <button type="submit" disabled={submitting || !form.title || !form.body} style={{ padding: '9px 24px', background: submitting ? 'var(--accent-subtle)' : 'var(--accent-primary)', color: submitting ? 'var(--accent-primary)' : '#fff', border: 'none', borderRadius: 'var(--radius-default)', fontSize: 14, fontWeight: 700, cursor: (!form.title || !form.body) ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Posting...' : 'Post Announcement'}
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Announcements List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ background: 'var(--surface-elevated)', borderRadius: 12, padding: 20 }}><Skeleton lines={3} height={80} /></div>)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {announcements.map((ann, i) => {
              const cfg = priorityConfig[ann.priority];
              return (
                <div key={ann.id} style={{
                  background: 'var(--surface-elevated)', borderRadius: 'var(--radius-large)',
                  border: `1px solid rgba(15,23,42,0.06)`, boxShadow: 'var(--shadow-1)',
                  overflow: 'hidden', transition: 'box-shadow 200ms',
                  animation: `fadeIn 0.3s ease-out ${i * 0.07}s both`,
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-2)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-1)'}
                >
                  <div style={{ height: 3, background: cfg.color }} />
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>{ann.title}</h3>
                          <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '2px 8px', borderRadius: 4 }}>{cfg.label}</span>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ann.body}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(15,23,42,0.05)' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>👤 {ann.author}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>📅 {ann.date}</span>
                      <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 500 }}>👥 {ann.audience}</span>
                    </div>
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
