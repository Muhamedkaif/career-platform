import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { jobService } from '../../services/jobService';

const SKILL_OPTIONS = ['React', 'Python', 'Node.js', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'DSA', 'TypeScript', 'Go', 'Rust'];

export default function PostJob() {
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', requirements: '', deadline: '', skills: [] });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })); };

  const toggleSkill = (skill) => {
    setForm(f => ({ ...f, skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill] }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title) errs.title = 'Required';
    if (!form.company) errs.company = 'Required';
    if (!form.deadline) errs.deadline = 'Required';
    if (form.skills.length === 0) errs.skills = 'Select at least one skill';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setSuccess(true);
      setForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', requirements: '', deadline: '', skills: [] });
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (key) => ({
    width: '100%', padding: '10px 14px',
    border: `1.5px solid ${errors[key] ? 'var(--signal-critical)' : 'rgba(15,23,42,0.1)'}`,
    borderRadius: 'var(--radius-default)', fontSize: 14,
    fontFamily: 'var(--font-ui)', outline: 'none',
    background: 'var(--surface-primary)', color: 'var(--text-primary)',
    boxSizing: 'border-box', transition: 'border-color 200ms',
  });

  const labelStyle = { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 };

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Navbar title="Post a Job" />
      <div style={{ padding: '24px 32px', maxWidth: 800, margin: '0 auto' }}>
        {success && (
          <div style={{ padding: '14px 18px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-default)', marginBottom: 20, color: 'var(--signal-success)', fontWeight: 600, fontSize: 14 }}>
            ✅ Job posted successfully! Students will be notified.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card title="Job Details" elevation={2} style={{ marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Job Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Software Engineer" style={inputStyle('title')}
                  onFocus={e => { if (!errors.title) e.target.style.borderColor = 'var(--accent-primary)'; }}
                  onBlur={e => { if (!errors.title) e.target.style.borderColor = 'rgba(15,23,42,0.1)'; }}
                />
                {errors.title && <span style={{ fontSize: 11, color: 'var(--signal-critical)', marginTop: 4, display: 'block' }}>{errors.title}</span>}
              </div>
              <div>
                <label style={labelStyle}>Company *</label>
                <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Google" style={inputStyle('company')}
                  onFocus={e => { if (!errors.company) e.target.style.borderColor = 'var(--accent-primary)'; }}
                  onBlur={e => { if (!errors.company) e.target.style.borderColor = 'rgba(15,23,42,0.1)'; }}
                />
                {errors.company && <span style={{ fontSize: 11, color: 'var(--signal-critical)', marginTop: 4, display: 'block' }}>{errors.company}</span>}
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Bangalore / Remote" style={inputStyle('location')} onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'} />
              </div>
              <div>
                <label style={labelStyle}>Job Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} style={{ ...inputStyle('type'), cursor: 'pointer' }}>
                  {['Full-time', 'Part-time', 'Contract', 'Freelance'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Salary / CTC</label>
                <input value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="₹12–18 LPA" style={inputStyle('salary')} onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'} />
              </div>
              <div>
                <label style={labelStyle}>Application Deadline *</label>
                <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} style={inputStyle('deadline')} onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'} />
                {errors.deadline && <span style={{ fontSize: 11, color: 'var(--signal-critical)', marginTop: 4, display: 'block' }}>{errors.deadline}</span>}
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Job Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the role, responsibilities, and what the ideal candidate looks like..." rows={4}
                style={{ ...inputStyle('description'), resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'}
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Requirements</label>
              <textarea value={form.requirements} onChange={e => set('requirements', e.target.value)} placeholder="List key requirements, qualifications, and experience needed..." rows={3}
                style={{ ...inputStyle('requirements'), resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'}
              />
            </div>
          </Card>

          <Card title="Required Skills *" subtitle="Select skills students must have" elevation={2} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SKILL_OPTIONS.map(skill => {
                const active = form.skills.includes(skill);
                return (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)} style={{
                    padding: '7px 14px', border: `1.5px solid ${active ? 'var(--accent-primary)' : 'rgba(15,23,42,0.1)'}`,
                    borderRadius: 'var(--radius-default)', background: active ? 'var(--accent-subtle)' : 'transparent',
                    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: active ? 600 : 400, cursor: 'pointer',
                    transition: 'all 150ms',
                  }}>
                    {active && '✓ '}{skill}
                  </button>
                );
              })}
            </div>
            {errors.skills && <p style={{ fontSize: 12, color: 'var(--signal-critical)', marginTop: 8 }}>{errors.skills}</p>}
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={() => setForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', requirements: '', deadline: '', skills: [] })}
              style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(15,23,42,0.12)', borderRadius: 'var(--radius-default)', fontSize: 14, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              Clear
            </button>
            <button type="submit" disabled={submitting} style={{
              padding: '10px 28px', background: submitting ? 'var(--accent-subtle)' : 'var(--accent-primary)',
              color: submitting ? 'var(--accent-primary)' : '#fff', border: 'none',
              borderRadius: 'var(--radius-default)', fontSize: 14, fontWeight: 700, cursor: submitting ? 'default' : 'pointer',
              transition: 'all 150ms',
            }}>
              {submitting ? 'Posting...' : 'Post Job →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
