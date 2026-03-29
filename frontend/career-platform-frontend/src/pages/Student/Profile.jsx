import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { Skeleton } from '../../components/Loader';

const mockProfile = {
  name: 'Priya Sharma', email: 'priya@college.edu', phone: '+91 98765 43210',
  rollNo: 'CS20B001', department: 'Computer Science & Engineering', batch: '2020-2024',
  cgpa: 8.7, linkedin: 'linkedin.com/in/priyasharma', github: 'github.com/priya-sharma',
  bio: 'Passionate full-stack developer with a love for building impactful products. Currently exploring ML/AI applications in fintech.',
  skills: ['React', 'Python', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'GraphQL'],
  experiences: [
    { role: 'SDE Intern', company: 'Razorpay', duration: 'May–Aug 2023', type: 'Internship' },
    { role: 'Open Source Contributor', company: 'Mozilla', duration: 'Jan 2023–Present', type: 'Volunteer' },
  ],
  achievements: ['Winner — HackIIIT 2023', 'Published paper in IEEE ICCT 2023', 'Smart India Hackathon 2022 Finalist'],
};

const inputStyle = { width:'100%', padding:'8px 12px', border:'1.5px solid rgba(79,70,229,0.3)', borderRadius:'var(--radius-default)', fontSize:13, color:'var(--text-primary)', background:'var(--surface-primary)', outline:'none', fontFamily:'var(--font-ui)', boxSizing:'border-box' };

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { setTimeout(() => { setProfile(mockProfile); setForm(mockProfile); setLoading(false); }, 700); }, []);

  const handleSave = () => { setProfile(form); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div style={{ flex:1, overflow:'auto' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
      <Navbar title="My Profile" actions={
        editing ? (
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => { setEditing(false); setForm(profile); }} style={{ padding:'7px 14px', background:'transparent', border:'1px solid rgba(15,23,42,0.12)', borderRadius:'var(--radius-default)', fontSize:13, cursor:'pointer', color:'var(--text-secondary)' }}>Cancel</button>
            <button onClick={handleSave} style={{ padding:'7px 16px', background:'var(--accent-primary)', color:'#fff', border:'none', borderRadius:'var(--radius-default)', fontSize:13, fontWeight:600, cursor:'pointer' }}>Save Changes</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} style={{ padding:'7px 16px', background:'var(--accent-subtle)', color:'var(--accent-primary)', border:'1px solid rgba(79,70,229,0.2)', borderRadius:'var(--radius-default)', fontSize:13, fontWeight:600, cursor:'pointer' }}>✏️ Edit Profile</button>
        )
      } />
      {saved && <div style={{ position:'fixed', top:72, right:24, zIndex:1000, background:'#fff', border:'1px solid #BBF7D0', borderRadius:'var(--radius-default)', padding:'12px 18px', boxShadow:'var(--shadow-3)', animation:'slideInRight 300ms ease-out', display:'flex', alignItems:'center', gap:8 }}><span>✅</span><span style={{ fontSize:13, fontWeight:600, color:'var(--signal-success)' }}>Profile saved</span></div>}
      <div style={{ padding:'24px 32px', maxWidth:960, margin:'0 auto' }}>
        <Card elevation={2} style={{ marginBottom:20, animation:'fadeIn 0.4s ease-out' }}>
          <div style={{ display:'flex', gap:24, alignItems:'flex-start', flexWrap:'wrap' }}>
            <div style={{ width:88, height:88, borderRadius:'50%', background:'linear-gradient(135deg, var(--accent-primary), #7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:32, fontWeight:800, boxShadow:'0 0 0 4px var(--accent-subtle)' }}>
              {(profile?.name||'P')[0]}
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              {loading ? <Skeleton height={24} width="40%" style={{ marginBottom:8 }} /> : editing ? (
                <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} style={{ ...inputStyle, fontSize:18, fontWeight:700, marginBottom:8 }} />
              ) : (
                <h2 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.5px', marginBottom:4 }}>{profile?.name}</h2>
              )}
              {loading ? <Skeleton height={14} width="60%" style={{ marginBottom:6 }} /> : (
                <div style={{ display:'flex', flexWrap:'wrap', gap:12, alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:14, color:'var(--text-secondary)' }}>{profile?.department}</span>
                  <span style={{ fontSize:13, fontFamily:'var(--font-mono)', fontWeight:600, color:'var(--signal-success)', background:'#F0FDF4', border:'1px solid #BBF7D0', padding:'2px 8px', borderRadius:4 }}>CGPA: {profile?.cgpa}</span>
                </div>
              )}
              {loading ? <Skeleton height={14} width="80%" /> : editing ? (
                <textarea value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} rows={2} style={{ ...inputStyle, resize:'vertical' }} />
              ) : (
                <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.6 }}>{profile?.bio}</p>
              )}
            </div>
          </div>
        </Card>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <Card title="Contact Information" elevation={2} style={{ animation:'fadeIn 0.5s ease-out 0.1s both' }}>
            {loading ? <Skeleton height={120} /> : (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[{label:'Email',key:'email',icon:'📧'},{label:'Phone',key:'phone',icon:'📱'},{label:'Roll No',key:'rollNo',icon:'🎓'}].map(f=>(
                  <div key={f.key}>
                    <div style={{ fontSize:11, fontWeight:600, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{f.icon} {f.label}</div>
                    {editing ? <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={inputStyle}/> : <div style={{ fontSize:14, color:'var(--text-primary)' }}>{profile?.[f.key]}</div>}
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card title="Technical Skills" elevation={2} style={{ animation:'fadeIn 0.5s ease-out 0.2s both' }}>
            {loading ? <Skeleton height={120} /> : (
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {profile?.skills.map(skill=>(
                  <span key={skill} style={{ fontSize:12, fontWeight:500, padding:'4px 10px', background:'var(--accent-subtle)', color:'var(--accent-primary)', borderRadius:'var(--radius-default)', fontFamily:'var(--font-mono)', border:'1px solid rgba(79,70,229,0.15)' }}>{skill}</span>
                ))}
              </div>
            )}
          </Card>
          <Card title="Experience" elevation={2} style={{ animation:'fadeIn 0.5s ease-out 0.3s both' }}>
            {loading ? <Skeleton height={100} /> : (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {profile?.experiences.map((exp,i)=>(
                  <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:36, height:36, borderRadius:8, background:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{exp.type==='Internship'?'💼':'🌐'}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)' }}>{exp.role}</div>
                      <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{exp.company} · {exp.duration}</div>
                      <span style={{ fontSize:11, color:'var(--accent-primary)', background:'var(--accent-subtle)', padding:'1px 6px', borderRadius:4, fontWeight:500 }}>{exp.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card title="Achievements" elevation={2} style={{ animation:'fadeIn 0.5s ease-out 0.4s both' }}>
            {loading ? <Skeleton height={100} /> : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {profile?.achievements.map((ach,i)=>(
                  <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <span style={{ color:'#F59E0B', fontSize:16, flexShrink:0 }}>🏆</span>
                    <span style={{ fontSize:13, color:'var(--text-primary)', lineHeight:1.5 }}>{ach}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
