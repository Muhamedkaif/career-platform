import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { Skeleton } from '../../components/Loader';
import { studentService } from '../../services/studentService';

export default function AIRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await studentService.analyzeRecommendations();
      setData(response.data);
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === 'string' ? err.response.data : '') ||
        'Failed to analyze your resume and GitHub profile.';
      setError(backendMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Navbar title="AI Recommendations" />

      <div style={{ padding: '24px 32px', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card
          title="Analyze Resume And GitHub"
          subtitle="Use your uploaded resume and saved GitHub profile to find matching jobs and internships"
          elevation={2}
          action={
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                padding: '10px 20px',
                background: loading ? 'var(--accent-subtle)' : 'var(--accent-primary)',
                color: loading ? 'var(--accent-primary)' : '#fff',
                border: 'none',
                borderRadius: 'var(--radius-default)',
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'default' : 'pointer',
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze Now'}
            </button>
          }
        >
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This will compare your resume and GitHub profile against all currently posted jobs and internships, then rank the best matches and highlight missing skills.
          </p>
        </Card>

        {error && (
          <div style={{ padding: '14px 18px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-default)', color: 'var(--signal-critical)', fontWeight: 600, fontSize: 14 }}>
            {error}
          </div>
        )}

        {loading ? (
          <>
            <Card title="Recommended Jobs" elevation={2}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} style={{ padding: 20, background: 'var(--surface-elevated)', borderRadius: 12 }}>
                    <Skeleton height={18} width="45%" style={{ marginBottom: 12 }} />
                    <Skeleton height={14} width="30%" style={{ marginBottom: 8 }} />
                    <Skeleton height={12} width="75%" />
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Recommended Internships" elevation={2}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} style={{ padding: 20, background: 'var(--surface-elevated)', borderRadius: 12 }}>
                    <Skeleton height={18} width="55%" style={{ marginBottom: 12 }} />
                    <Skeleton height={14} width="35%" style={{ marginBottom: 8 }} />
                    <Skeleton height={12} width="80%" />
                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : data ? (
          <>
            <Card title="Recommended Jobs" subtitle="Best job matches based on your resume and GitHub" elevation={2}>
              {data.jobs?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {data.jobs.map((job, index) => (
                    <div key={`${job.role}-${index}`} style={{ background: 'var(--surface-elevated)', border: '1px solid rgba(15,23,42,0.06)', borderRadius: 'var(--radius-large)', padding: 18, boxShadow: 'var(--shadow-1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{job.role}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{job.explanation}</div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--signal-success)', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '4px 10px', borderRadius: 999 }}>
                          {job.score}% match
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                        {(job.missing_skills || []).length > 0 ? (
                          job.missing_skills.map((skill) => (
                            <span key={skill} style={{ fontSize: 12, padding: '5px 10px', borderRadius: 999, background: '#FFF1F2', color: '#DC2626', fontWeight: 600 }}>
                              Missing: {skill}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: 12, padding: '5px 10px', borderRadius: 999, background: '#F0FDF4', color: '#059669', fontWeight: 600 }}>
                            Strong match
                          </span>
                        )}
                      </div>

                      {(job.recommended_courses || []).length > 0 && (
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          Suggested learning: {job.recommended_courses.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px 8px', color: 'var(--text-secondary)', fontSize: 14 }}>
                  No job recommendations available yet.
                </div>
              )}
            </Card>

            <Card title="Recommended Internships" subtitle="Best internship matches from posted opportunities" elevation={2}>
              {data.internships?.length ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {data.internships.map((internship, index) => (
                    <div key={`${internship.role}-${index}`} style={{ background: 'var(--surface-elevated)', border: '1px solid rgba(15,23,42,0.06)', borderRadius: 'var(--radius-large)', padding: 18, boxShadow: 'var(--shadow-1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{internship.role}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{internship.explanation}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--signal-success)' }}>
                          {internship.score}%
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                        {(internship.missing_skills || []).length > 0 ? (
                          internship.missing_skills.map((skill) => (
                            <span key={skill} style={{ fontSize: 12, padding: '5px 10px', borderRadius: 999, background: '#FFF1F2', color: '#DC2626', fontWeight: 600 }}>
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: 12, padding: '5px 10px', borderRadius: 999, background: '#F0FDF4', color: '#059669', fontWeight: 600 }}>
                            Ready to apply
                          </span>
                        )}
                      </div>

                      {(internship.recommended_courses || []).length > 0 && (
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          Suggested learning: {internship.recommended_courses.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px 8px', color: 'var(--text-secondary)', fontSize: 14 }}>
                  No internship recommendations available yet.
                </div>
              )}
            </Card>
          </>
        ) : (
          <Card title="Ready To Analyze" elevation={2}>
            <div style={{ padding: '20px 8px', color: 'var(--text-secondary)', fontSize: 14 }}>
              Run the analysis to see recommended jobs and internships from the opportunities already posted in the platform.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
