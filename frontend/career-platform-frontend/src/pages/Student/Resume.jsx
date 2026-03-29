import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { Skeleton } from '../../components/Loader';

const mockResume = {
  score: 82,
  lastUpdated: 'Nov 28, 2024',
  aiSuggestions: [
    { id: 1, type: 'improvement', text: 'Add quantifiable impact to your internship bullet points (e.g., "improved performance by 40%")' },
    { id: 2, type: 'missing', text: 'Add a Projects section — your GitHub projects would significantly strengthen this resume' },
    { id: 3, type: 'keyword', text: 'Include keywords: "microservices", "CI/CD", "REST APIs" to pass ATS filters' },
    { id: 4, type: 'positive', text: 'Strong skill section with relevant technologies — well formatted' },
  ],
  atsScore: 74,
  keywords: { found: ['React', 'Python', 'Node.js', 'SQL', 'MongoDB'], missing: ['TypeScript', 'Kubernetes', 'REST APIs', 'CI/CD'] },
};

const suggestionConfig = {
  improvement: { icon: '⚡', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  missing: { icon: '❌', color: '#DC2626', bg: '#FFF1F2', border: '#FECDD3' },
  keyword: { icon: '🔍', color: '#0284C7', bg: '#EFF6FF', border: '#BFDBFE' },
  positive: { icon: '✅', color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
};

export default function Resume() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setTimeout(() => { setData(mockResume); setLoading(false); }, 700);
  }, []);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => setUploading(false), 2000);
  };

  const scoreColor = data?.score >= 80 ? 'var(--signal-success)' : data?.score >= 60 ? 'var(--signal-warning)' : 'var(--signal-critical)';

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Navbar title="Resume Builder" actions={
        <button style={{ padding: '7px 16px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-default)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Download PDF ↓
        </button>
      } />

      <div style={{ padding: '24px 32px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Left: Upload + Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Upload Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(); }}
            style={{
              border: `2px dashed ${dragOver ? 'var(--accent-primary)' : 'rgba(15,23,42,0.12)'}`,
              borderRadius: 'var(--radius-large)', padding: '32px 24px',
              background: dragOver ? 'var(--accent-subtle)' : 'var(--surface-secondary)',
              textAlign: 'center', transition: 'all 200ms ease-out', cursor: 'pointer',
              animation: 'fadeIn 0.4s ease-out',
            }}
            onClick={handleUpload}
          >
            {uploading ? (
              <div>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Analyzing resume with AI...</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Drop your resume here</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>PDF, DOCX up to 10MB · AI analysis included</p>
                <button style={{ padding: '9px 20px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-default)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Choose File
                </button>
              </div>
            )}
          </div>

          {/* Current Resume Preview */}
          <Card title="Current Resume" subtitle={`Last updated: ${data?.lastUpdated || '—'}`} elevation={2} action={
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>priya_sharma_resume.pdf</span>
          }>
            {loading ? <Skeleton height={400} /> : (
              <div style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-default)', padding: 24, minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 48 }}>📋</span>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Resume preview would render here</p>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>PDF viewer integration required</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right: AI Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Score Card */}
          <Card elevation={2} style={{ textAlign: 'center', animation: 'fadeIn 0.4s ease-out 0.1s both' }}>
            {loading ? <Skeleton height={120} /> : (
              <>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Resume Score</p>
                <div style={{ fontSize: 56, fontWeight: 900, color: scoreColor, fontFamily: 'var(--font-mono)', letterSpacing: '-2px', lineHeight: 1 }}>{data.score}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, marginBottom: 16 }}>out of 100</div>
                <div style={{ height: 8, background: 'var(--surface-sunken)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ height: '100%', width: `${data.score}%`, background: scoreColor, borderRadius: 4, transition: 'width 1s ease-out' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-tertiary)' }}>
                  <span>Poor</span><span>Good</span><span>Excellent</span>
                </div>
              </>
            )}
          </Card>

          {/* ATS Score */}
          <Card title="ATS Compatibility" elevation={1}>
            {loading ? <Skeleton height={80} /> : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Keyword Match Rate</span>
                  <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--signal-warning)' }}>{data.atsScore}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface-sunken)', borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
                  <div style={{ height: '100%', width: `${data.atsScore}%`, background: 'var(--signal-warning)', borderRadius: 3 }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Keywords Found</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {data.keywords.found.map(k => <span key={k} style={{ fontSize: 11, padding: '2px 7px', background: '#F0FDF4', color: 'var(--signal-success)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{k}</span>)}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Missing Keywords</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {data.keywords.missing.map(k => <span key={k} style={{ fontSize: 11, padding: '2px 7px', background: '#FFF1F2', color: 'var(--signal-critical)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{k}</span>)}
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* AI Suggestions */}
          <Card title="AI Suggestions" subtitle="Powered by CareerOS AI" elevation={1}>
            {loading ? <Skeleton height={200} /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.aiSuggestions.map((s, i) => {
                  const cfg = suggestionConfig[s.type];
                  return (
                    <div key={s.id} style={{ padding: '10px 12px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 'var(--radius-default)', animation: `fadeIn 0.3s ease-out ${i * 0.07}s both` }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{cfg.icon}</span>
                        <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5 }}>{s.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
