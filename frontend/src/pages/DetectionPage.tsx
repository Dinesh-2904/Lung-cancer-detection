import React, { useState } from 'react';
import { ScanLine, Info } from 'lucide-react';
import UploadPanel from '../components/UploadPanel';
import ResultPanel from '../components/ResultPanel';
import { PredictionResult } from '../services/api';

const DetectionPage: React.FC = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleResult = (r: PredictionResult) => {
    setResult(r);
    // Scroll to top of results
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="medical-bg" style={{ minHeight: '100vh', paddingTop: 88, paddingBottom: 60 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{
              width: 56, height: 56,
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
            }}>
              <ScanLine size={26} color="white" />
            </div>
          </div>
          <div className="section-label" style={{ marginBottom: 8 }}>CT Scan Analysis</div>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: 10 }}>
            {result ? 'Analysis Complete' : 'Upload Lung CT Scan'}
          </h1>
          <p style={{ color: 'var(--color-text-soft)', maxWidth: 520, margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.65 }}>
            {result
              ? 'Your CT scan has been analyzed. Review the prediction and Grad-CAM explanation below.'
              : 'Upload a CT scan image in JPG, JPEG, or PNG format for AI-powered lung cancer classification.'}
          </p>
        </div>

        {/* Info Bar (only before upload) */}
        {!result && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 24,
          }}>
            <Info size={16} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: '0.8rem', color: '#0369a1', lineHeight: 1.6 }}>
              <strong>Academic Project:</strong> This system uses a trained InceptionV3 model with Grad-CAM explainability. 
              For educational purposes only. Not intended for clinical use or medical diagnosis.
            </p>
          </div>
        )}

        {/* Content */}
        {!result ? (
          <div className="card" style={{ padding: '32px' }}>
            <UploadPanel onResult={handleResult} />
          </div>
        ) : (
          <ResultPanel result={result} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default DetectionPage;
