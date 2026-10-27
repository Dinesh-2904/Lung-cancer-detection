import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X, FileImage, Loader2, AlertCircle } from 'lucide-react';
import { predictCTScan, PredictionResult, ApiError } from '../services/api';

interface UploadPanelProps {
  onResult: (result: PredictionResult) => void;
}

type Stage = 'idle' | 'preview' | 'loading' | 'error';

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_MB = 20;

const UploadPanel: React.FC<UploadPanelProps> = ({ onResult }) => {
  const [stage, setStage] = useState<Stage>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (f: File): string => {
    if (!ACCEPTED.includes(f.type)) return 'Please upload a JPG, JPEG, or PNG image.';
    if (f.size > MAX_MB * 1024 * 1024) return `File too large. Maximum allowed size is ${MAX_MB} MB.`;
    return '';
  };

  const selectFile = (f: File) => {
    const err = validateFile(f);
    if (err) { setError(err); setStage('error'); return; }
    setFile(f);
    setError('');
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setStage('preview');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) selectFile(f);
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) selectFile(f);
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setStage('idle');
    setError('');
  };

  const analyze = async () => {
    if (!file) return;
    setStage('loading');
    setError('');
    try {
      const result = await predictCTScan(file);
      onResult(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof TypeError) {
        setError('Model is currently unavailable. Please ensure the backend server is running and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setStage('preview');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div>
      {/* Drop Zone (shown when idle or error) */}
      {(stage === 'idle' || stage === 'error') && (
        <div>
          <label
            htmlFor="ct-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 40px',
              borderRadius: 'var(--radius-xl)',
              border: `2px dashed ${dragging ? '#2563eb' : '#cbd5e1'}`,
              background: dragging ? '#eff6ff' : '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
            }}
          >
            <input
              id="ct-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />

            {/* Upload Icon */}
            <div style={{
              width: 80, height: 80,
              background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(6,182,212,0.1))',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
              border: '2px solid rgba(37,99,235,0.15)',
            }}>
              <Upload size={32} color="#2563eb" />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>
              Upload CT Scan
            </h3>
            <p style={{ color: 'var(--color-text-soft)', fontSize: '0.9rem', marginBottom: 6 }}>
              Drag &amp; drop your image here
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: 20 }}>
              Supported formats: JPG, JPEG, PNG · Max {MAX_MB} MB
            </p>

            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              color: 'white', padding: '10px 24px', borderRadius: 99,
              fontWeight: 600, fontSize: '0.875rem',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              transition: 'all 0.2s',
            }}>
              <FileImage size={15} />
              Browse Files
            </span>
          </label>

          {/* Error message */}
          {stage === 'error' && error && (
            <div style={{
              marginTop: 16,
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: '12px 16px',
            }}>
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: '#dc2626', fontSize: '0.875rem', lineHeight: 1.5 }}>{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Preview Stage */}
      {(stage === 'preview' || stage === 'loading') && file && previewUrl && (
        <div>
          {/* Image Preview Card */}
          <div className="card" style={{ overflow: 'hidden', marginBottom: 16 }}>
            {/* Header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ImageIcon size={16} color="#2563eb" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-navy)' }}>
                  Selected CT Scan
                </span>
              </div>
              <button
                onClick={removeFile}
                disabled={stage === 'loading'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500,
                  padding: '4px 8px', borderRadius: 6,
                  transition: 'all 0.2s',
                  opacity: stage === 'loading' ? 0.4 : 1,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
              >
                <X size={14} /> Remove
              </button>
            </div>

            {/* Image */}
            <div style={{ position: 'relative', background: '#0a1628' }}>
              <img
                src={previewUrl}
                alt="Selected CT scan"
                style={{
                  width: '100%',
                  maxHeight: 380,
                  objectFit: 'contain',
                  display: 'block',
                  opacity: stage === 'loading' ? 0.5 : 1,
                  transition: 'opacity 0.3s',
                }}
              />
              {stage === 'loading' && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 14,
                }}>
                  {/* Scanning animation */}
                  <div style={{
                    width: 64, height: 64,
                    border: '3px solid rgba(6,182,212,0.2)',
                    borderTopColor: '#06b6d4',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  <div style={{
                    background: 'rgba(10,22,40,0.85)',
                    borderRadius: 10,
                    padding: '10px 20px',
                    backdropFilter: 'blur(8px)',
                  }}>
                    <p style={{ color: '#67e8f9', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                      Analyzing CT Scan…
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textAlign: 'center', marginTop: 4 }}>
                      Running InceptionV3 + Grad-CAM
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* File Info */}
            <div style={{
              padding: '14px 20px',
              background: '#f8fafc',
              borderTop: '1px solid var(--color-border)',
              display: 'flex', gap: 24, flexWrap: 'wrap',
            }}>
              {[
                { label: 'File Name', value: file.name },
                { label: 'Format', value: file.type.split('/')[1]?.toUpperCase() || 'IMAGE' },
                { label: 'Size', value: formatSize(file.size) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && stage === 'preview' && (
            <div style={{
              marginBottom: 16,
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '12px 16px',
            }}>
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: '#dc2626', fontSize: '0.875rem', lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={analyze}
              disabled={stage === 'loading'}
              className="btn-primary"
              style={{
                flex: 1, justifyContent: 'center',
                opacity: stage === 'loading' ? 0.7 : 1,
                cursor: stage === 'loading' ? 'not-allowed' : 'pointer',
                minWidth: 160,
              }}
            >
              {stage === 'loading' ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
                  Analyzing…
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Analyze Image
                </>
              )}
            </button>

            <button
              onClick={removeFile}
              disabled={stage === 'loading'}
              className="btn-secondary"
              style={{
                flex: 1, justifyContent: 'center',
                opacity: stage === 'loading' ? 0.5 : 1,
                cursor: stage === 'loading' ? 'not-allowed' : 'pointer',
                minWidth: 120,
              }}
            >
              <X size={15} />
              Remove Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPanel;
