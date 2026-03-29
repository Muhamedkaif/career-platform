import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { Skeleton } from '../../components/Loader';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid,
} from 'recharts';

const mockSkills = {
  radar: [
    { subject: 'React', A: 85 },
    { subject: 'Python', A: 72 },
    { subject: 'SQL', A: 68 },
    { subject: 'ML', A: 55 },
    { subject: 'System Design', A: 40 },
    { subject: 'DSA', A: 76 },
    { subject: 'DevOps', A: 35 },
    { subject: 'Node.js', A: 70 },
  ],
  categories: [
    {
      name: 'Frontend', color: '#4F46E5',
      skills: [
        { name: 'React', level: 85, target: 90, trend: '+5' },
        { name: 'TypeScript', level: 30, target: 80, trend: '+0' },
        { name: 'CSS/Tailwind', level: 78, target: 85, trend: '+8' },
      ],
    },
    {
      name: 'Backend', color: '#0284C7',
      skills: [
        { name: 'Node.js', level: 70, target: 85, trend: '+10' },
        { name: 'Python', level: 72, target: 80, trend: '+3' },
        { name: 'SQL', level: 68, target: 80, trend: '+2' },
      ],
    },
    {
      name: 'CS Fundamentals', color: '#7C3AED',
      skills: [
        { name: 'DSA', level: 76, target: 95, trend: '+6' },
        { name: 'System Design', level: 40, target: 90, trend: '+0' },
        { name: 'OS Concepts', level: 60, target: 75, trend: '+4' },
      ],
    },
    {
      name: 'Cloud & DevOps', color: '#059669',
      skills: [
        { name: 'AWS', level: 20, target: 70, trend: '+0' },
        { name: 'Docker', level: 45, target: 70, trend: '+5' },
        { name: 'Linux', level: 55, target: 70, trend: '+3' },
      ],
    },
  ],
  resources: {
    TypeScript: [
      { title: 'TypeScript Handbook', type: 'Docs', time: '4h', link: '#' },
      { title: 'TypeScript Deep Dive', type: 'Book', time: '8h', link: '#' },
    ],
    'System Design': [
      { title: 'Grokking System Design', type: 'Course', time: '20h', link: '#' },
      { title: 'System Design Primer', type: 'GitHub', time: '6h', link: '#' },
    ],
    AWS: [
      { title: 'AWS SAA-C03', type: 'Cert', time: '40h', link: '#' },
      { title: 'AWS Practitioner', type: 'Course', time: '10h', link: '#' },
    ],
  },
};

export default function SkillTracker() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [expandedSkill, setExpandedSkill] = useState(null);

  useEffect(() => {
    setTimeout(() => { setData(mockSkills); setLoading(false); }, 700);
  }, []);

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Navbar title="Skill Tracker" />

      <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Overview Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
          <Card title="Skill Constellation" subtitle="Proficiency radar across all domains" elevation={2}>
            {loading ? <Skeleton height={300} /> : (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data.radar}>
                    <PolarGrid stroke="rgba(15,23,42,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                    <Radar dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.12} strokeWidth={2} dot={{ r: 4, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card title="Category Breakdown" subtitle="Avg proficiency per domain" elevation={2}>
            {loading ? <Skeleton height={300} /> : (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categories.map(c => ({ name: c.name, avg: Math.round(c.skills.reduce((s, sk) => s + sk.level, 0) / c.skills.length), color: c.color }))} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 8, fontSize: 13 }}
                      formatter={(v) => [`${v}%`, 'Avg Score']}
                    />
                    <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                      {data.categories.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* Category Tabs + Skills */}
        <Card title="Skill Details" elevation={2}>
          {loading ? <Skeleton height={300} /> : (
            <>
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {data.categories.map((cat, i) => (
                  <button key={i} onClick={() => setSelectedCategory(i)} style={{
                    padding: '7px 16px', border: 'none', borderRadius: 'var(--radius-default)', cursor: 'pointer',
                    background: selectedCategory === i ? cat.color : 'var(--surface-sunken)',
                    color: selectedCategory === i ? '#fff' : 'var(--text-secondary)',
                    fontSize: 13, fontWeight: 600, transition: 'all 200ms ease-out',
                  }}>
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Skills List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.categories[selectedCategory].skills.map((skill, i) => (
                  <div key={skill.name} style={{ animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
                    <div
                      onClick={() => setExpandedSkill(expandedSkill === skill.name ? null : skill.name)}
                      style={{
                        padding: '14px 16px', background: 'var(--surface-sunken)',
                        borderRadius: 'var(--radius-default)', cursor: 'pointer',
                        border: `1px solid ${expandedSkill === skill.name ? data.categories[selectedCategory].color + '44' : 'transparent'}`,
                        transition: 'all 200ms',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{skill.name}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--signal-success)', background: '#F0FDF4', padding: '2px 7px', borderRadius: 4 }}>{skill.trend} this month</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                            {skill.level}<span style={{ color: 'var(--text-tertiary)' }}>/{skill.target}</span>
                          </span>
                          <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>{expandedSkill === skill.name ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      <div style={{ position: 'relative', height: 8, background: 'var(--surface-primary)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${skill.target}%`, background: `${data.categories[selectedCategory].color}20`, borderRadius: 4 }} />
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${skill.level}%`, background: data.categories[selectedCategory].color, borderRadius: 4, transition: 'width 0.6s ease-out' }} />
                      </div>
                    </div>

                    {/* Expanded Resources */}
                    {expandedSkill === skill.name && mockSkills.resources[skill.name] && (
                      <div style={{ padding: '12px 16px', background: 'var(--surface-primary)', border: '1px solid rgba(15,23,42,0.06)', borderRadius: '0 0 var(--radius-default) var(--radius-default)', marginTop: -4, animation: 'fadeIn 0.2s ease-out' }}>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recommended Resources</p>
                        <div style={{ display: 'flex', gap: 10 }}>
                          {mockSkills.resources[skill.name].map((r, ri) => (
                            <a key={ri} href={r.link} style={{
                              display: 'flex', flexDirection: 'column', gap: 4,
                              padding: '10px 14px', background: 'var(--surface-sunken)',
                              borderRadius: 'var(--radius-default)', textDecoration: 'none',
                              border: '1px solid rgba(15,23,42,0.06)', transition: 'all 150ms',
                              flex: 1,
                            }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(15,23,42,0.06)'; }}
                            >
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.title}</span>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <span style={{ fontSize: 11, color: 'var(--accent-primary)', background: 'var(--accent-subtle)', padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>{r.type}</span>
                                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>~{r.time}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
