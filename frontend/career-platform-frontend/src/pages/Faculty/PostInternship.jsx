import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';

const SKILL_OPTIONS = ['React', 'Python', 'Node.js', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'DSA', 'TypeScript', 'Machine Learning', 'Data Analysis', 'UI/UX'];

export default function PostInternship() {
  const [form, setForm] = useState({ title: '', company: '', location: '', duration: '', stipend: '', description: '', deadline: '', skills: [], openings: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })); };
  const toggleSkill = (skill) => setForm(f => ({ ...f, skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill] }));

  const validate = () => {
    const errs = {};
    if (!form.title) errs.title = 'Required';
    if (!form.company) errs.company = 'Required';
    if (!form.deadline) errs.deadline = 'Required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSuccess(true);
    setForm({ title: '', company: '', location: '', duration: '', stipend: '', description: '', deadline: '', skills: [], openings: '' });
    setSubmitting(false);
  };

  const inputStyle = (key) => ({
    width: '100%', padding: '10px 14px',
    border: `1.5px solid ${errors[key] ? 'var(--signal-critical)' : 'rgba(15,23,42,0.1)'}`,
    borderRadius: 'var(--radius-default)', fontSize: 14,
    fontFamily: 'var(--font-ui)', outline: 'none',
    background: 'var(--surface-primary)', color: 'var(--text-primary)', boxSizing: 'border-box',
  });

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Navbar title="Post an Internship" />
      <div style={{ padding: '24px 32px', maxWidth: 800, margin: '0 auto' }}>
        {success && (
          <div style={{ padding: '14px 18px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-default)', marginBottom: 20, color: 'var(--signal-success)', fontWeight: 600, fontSize: 14 }}>
            ✅ Internship posted! Students will see it in their feed.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <Card title="Internship Details" elevation={2} style={{ marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { key: 'title', label: 'Internship Title *', placeholder: 'Frontend Developer Intern' },
                { key: 'company', label: 'Company *', placeholder: 'Amazon' },
                { key: 'location', label: 'Location', placeholder: 'Mumbai / Remote' },
                { key: 'duration', label: 'Duration', placeholder: '3 months' },
                { key: 'stipend', label: 'Stipend', placeholder: '₹30,000/month' },
                { key: 'openings', label: 'Number of Openings', placeholder: '5' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>{field.label}</label>
                  <input value={form[field.key]} onChange={e => set(field.key, e.target.value)} placeholder={field.placeholder} style={inputStyle(field.key)}
                    onFocus={e => { if (!errors[field.key]) e.target.style.borderColor = 'var(--accent-primary)'; }}
                    onBlur={e => { if (!errors[field.key]) e.target.style.borderColor = 'rgba(15,23,42,0.1)'; }}
                  />
                  {errors[field.key] && <span style={{ fontSize: 11, color: 'var(--signal-critical)', marginTop: 4, display: 'block' }}>{errors[field.key]}</span>}
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Application Deadline *</label>
                <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} style={inputStyle('deadline')}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'}
                />
                {errors.deadline && <span style={{ fontSize: 11, color: 'var(--signal-critical)', marginTop: 4, display: 'block' }}>{errors.deadline}</span>}
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe what the intern will be working on..." rows={4}
                style={{ ...inputStyle('description'), resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'} onBlur={e => e.target.style.borderColor = 'rgba(15,23,42,0.1)'}
              />
            </div>
          </Card>

          <Card title="Required Skills" elevation={2} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SKILL_OPTIONS.map(skill => {
                const active = form.skills.includes(skill);
                return (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)} style={{
                    padding: '7px 14px', border: `1.5px solid ${active ? 'var(--accent-primary)' : 'rgba(15,23,42,0.1)'}`,
                    borderRadius: 'var(--radius-default)', background: active ? 'var(--accent-subtle)' : 'transparent',
                    color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 150ms',
                  }}>
                    {active && '✓ '}{skill}
                  </button>
                );
              })}
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={() => setForm({ title: '', company: '', location: '', duration: '', stipend: '', description: '', deadline: '', skills: [], openings: '' })}
              style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(15,23,42,0.12)', borderRadius: 'var(--radius-default)', fontSize: 14, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              Clear
            </button>
            <button type="submit" disabled={submitting} style={{
              padding: '10px 28px', background: submitting ? 'var(--accent-subtle)' : 'var(--accent-primary)',
              color: submitting ? 'var(--accent-primary)' : '#fff', border: 'none',
              borderRadius: 'var(--radius-default)', fontSize: 14, fontWeight: 700, cursor: submitting ? 'default' : 'pointer',
            }}>
              {submitting ? 'Posting...' : 'Post Internship →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
