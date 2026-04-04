import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { studentService } from '../../services/studentService';

export default function Resume() {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [githubLink, setGithubLink] = useState('');
  const [githubUploading, setGithubUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await studentService.getResume();
      const url =
        typeof response.data === 'string'
          ? response.data
          : response.data?.resumeUrl || '';

      if (!url) {
        setResumeUrl(null);
        return;
      }

      setResumeUrl(url);
    } catch (error) {
      console.error('Error fetching resume:', error);
      setResumeUrl(null);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setSuccess('');
    try {
      await studentService.uploadResume(file);
      setSuccess('Resume uploaded successfully!');
      await fetchResume();
    } catch (error) {
      console.error('Error uploading resume:', error);
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === 'string' ? error.response.data : '') ||
        'Error uploading resume.';
      setSuccess(backendMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleGithubSubmit = async (e) => {
    e.preventDefault();
    if (!githubLink) return;
    setGithubUploading(true);
    setSuccess('');
    try {
      await studentService.uploadGithub(githubLink);
      setSuccess('GitHub link uploaded successfully!');
      setGithubLink('');
    } catch (error) {
      console.error('Error uploading GitHub link:', error);
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === 'string' ? error.response.data : '') ||
        'Error uploading GitHub link.';
      setSuccess(backendMessage);
    } finally {
      setGithubUploading(false);
    }
  };

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <Navbar title="Resume" />
      <div style={{ padding: '24px 32px', maxWidth: 800, margin: '0 auto' }}>
        {success && (
          <div style={{ padding: '14px 18px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-default)', marginBottom: 20, color: 'var(--signal-success)', fontWeight: 600, fontSize: 14 }}>
            {success}
          </div>
        )}

        <Card title="Upload Resume" elevation={2} style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                display: 'block',
                marginBottom: 6,
              }}
            >
              Select Resume File
            </label>

            <input
              type="file"
              accept="*/*"
              onChange={handleFileSelect}
              id="resume-upload"
              style={{ display: 'none' }}
            />

            <button
              type="button"
              onClick={() => document.getElementById('resume-upload').click()}
              style={{
                padding: '10px 20px',
                background: 'var(--accent-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-default)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Choose File
            </button>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? 'var(--accent-primary)' : 'rgba(15,23,42,0.12)'}`,
              borderRadius: 'var(--radius-large)', padding: '32px 24px',
              background: dragOver ? 'var(--accent-subtle)' : 'var(--surface-secondary)',
              textAlign: 'center', transition: 'all 200ms ease-out', cursor: 'pointer',
            }}
          >
            {uploading ? (
              <div>
                <div style={{ fontSize: 32, marginBottom: 8 }}>Uploading</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Uploading resume...</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 40, marginBottom: 12 }}>File</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Or drop your resume here</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Any file type up to 10MB</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Resume Preview" elevation={2} style={{ marginBottom: 20 }}>
          <div
            style={{
              background: 'var(--surface-sunken)',
              borderRadius: 'var(--radius-default)',
              padding: 16,
              minHeight: 300,
            }}
          >
            {resumeUrl ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 220,
                gap: 12,
                textAlign: 'center',
              }}>
                <span style={{ fontSize: 48 }}>File</span>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Your resume is uploaded. You can open it in a new tab or download it.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 20px',
                      background: 'var(--accent-primary)',
                      color: '#fff',
                      borderRadius: 'var(--radius-default)',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    View Resume
                  </a>
                  <a
                    href={resumeUrl}
                    download="resume"
                    style={{
                      padding: '10px 20px',
                      background: 'var(--surface-primary)',
                      color: 'var(--text-primary)',
                      borderRadius: 'var(--radius-default)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      border: '1px solid rgba(15,23,42,0.12)',
                    }}
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                height: 200,
              }}>
                <span style={{ fontSize: 48 }}>Preview</span>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Resume preview will be displayed here after upload
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Add GitHub Link" elevation={2}>
          <form onSubmit={handleGithubSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>GitHub Profile URL</label>
              <input
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder="https://github.com/yourusername"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid rgba(15,23,42,0.1)',
                  borderRadius: 'var(--radius-default)', fontSize: 14,
                  outline: 'none', background: 'var(--surface-primary)', color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={githubUploading}
              style={{
                padding: '10px 20px', background: githubUploading ? 'var(--accent-subtle)' : 'var(--accent-primary)',
                color: githubUploading ? 'var(--accent-primary)' : '#fff', border: 'none',
                borderRadius: 'var(--radius-default)', fontSize: 14, fontWeight: 600, cursor: githubUploading ? 'default' : 'pointer',
              }}
            >
              {githubUploading ? 'Uploading...' : 'Add GitHub Link'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
