import React, { useState } from 'react';
import { PredictionResult } from '../services/api';
import ConfidenceBar from './ConfidenceBar';
import {
  CheckCircle, Info, ChevronDown, ChevronUp,
  Eye, Zap, Layers, AlertTriangle, RotateCcw
} from 'lucide-react';

interface ResultPanelProps {
  result: PredictionResult;
  onReset: () => void;
}

const CLASS_INFO: Record<string, { color: string; bg: string; brief: string }> = {
  'Adenocarcinoma': {
    color: '#1d4ed8',
    bg: '#dbeafe',
    brief: 'The most common type of lung cancer, typically found in the outer areas of the lung.',
  },
  'Large Cell Carcinoma': {
    color: '#7c3aed',
    bg: '#ede9fe',
    brief: 'A fast-growing type of lung cancer that can occur in any part of the lung.',
  },
  'Squamous Cell Carcinoma': {
    color: '#0e7490',
    bg: '#cffafe',
    brief: 'Often found in the central chest area near the main airways of the lung.',
  },
  'Normal': {
    color: '#059669',
    bg: '#d1fae5',
    brief: 'No malignant patterns detected. CT scan appears within normal range.',
  },
};

const ImageCard: React.FC<{ src: string; label: string; sublabel: string; icon: React.ReactNode }> = ({
  src, label, sublabel, icon
}) => (
  <div style={{ flex: 1, minWidth: 200 }}>
    <div style={{
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
      background: '#0a1628',
    }}>
      <img
        src={`data:image/png;base64,${src}`}
        alt={label}
        style={{ width: '100%', height: 200, objectFit: 'contain', display: 'block' }}
      />
    </div>
    <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <div style={{ color: '#2563eb', marginTop: 1 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-navy)' }}>{label}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{sublabel}</div>
      </div>
    </div>
  </div>
);

const ResultPanel: React.FC<ResultPanelProps> = ({ result, onReset }) => {
  const [showXAI, setShowXAI] = useState(true);

  const info = CLASS_INFO[result.predicted_class] ?? {
    color: '#1e3a6e',
    bg: '#e0f2fe',
    brief: 'Classification result from the InceptionV3 model.',
  };

  const isNormal = result.predicted_class === 'Normal';
  const pct = Math.round(result.confidence * 1000) / 10;

  return (
    <div className="anim-fade-up" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>Analysis Complete</div>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)' }}>Analysis Result</h2>
      </div>

      {/* Main Prediction Card */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        marginBottom: 20,
        boxShadow: 'var(--shadow-lg)',
        border: `2px solid ${info.color}22`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background accent */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180,
          background: `radial-gradient(circle, ${info.color}12, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          {/* Status icon */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: info.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <CheckCircle size={28} color={info.color} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>
              AI Prediction
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: 6 }}>
              {result.predicted_class}
            </h3>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: info.bg,
              color: info.color,
              padding: '4px 14px',
              borderRadius: 99,
              fontSize: '0.8rem',
              fontWeight: 700,
            }}>
              {pct.toFixed(1)}% Confidence
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-soft)', marginTop: 10, lineHeight: 1.6 }}>
              {info.brief}
            </p>
          </div>

          {/* Confidence ring */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ position: 'relative', width: 96, height: 96 }}>
              <svg viewBox="0 0 96 96" width="96" height="96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle
                  cx="48" cy="48" r="40"
                  fill="none"
                  stroke={info.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.confidence)}`}
                  transform="rotate(-90 48 48)"
                  style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: info.color }}>{pct.toFixed(0)}%</span>
                <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600 }}>CONF.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical warning */}
        {!isNormal && (
          <div style={{
            marginTop: 20,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 10,
            padding: '10px 14px',
          }}>
            <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.5 }}>
              This is an AI-generated classification. Always consult a qualified physician for medical evaluation and diagnosis.
            </p>
          </div>
        )}
      </div>

      {/* Confidence Distribution */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ marginBottom: 18 }}>
          <div className="section-label" style={{ marginBottom: 4 }}>Class Probabilities</div>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)' }}>Confidence Distribution</h3>
        </div>
        {Object.entries(result.probabilities)
          .sort(([, a], [, b]) => b - a)
          .map(([cls, prob], i) => (
            <ConfidenceBar
              key={cls}
              label={cls}
              value={prob}
              isPredicted={cls === result.predicted_class}
              delay={i * 120}
            />
          ))}
      </div>

      {/* Grad-CAM XAI Section */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: 20 }}>
        {/* Header */}
        <button
          onClick={() => setShowXAI(!showXAI)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            textAlign: 'left', marginBottom: showXAI ? 20 : 0,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #818cf8, #c4b5fd)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={14} color="white" />
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-navy)' }}>
                Why did the model make this prediction?
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: 36 }}>
              Grad-CAM visual explanation
            </p>
          </div>
          {showXAI ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
        </button>

        {showXAI && (
          <div>
            {/* Three images */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              <ImageCard
                src={result.original_image}
                label="Original CT Scan"
                sublabel="Input image as uploaded"
                icon={<Eye size={14} />}
              />
              <ImageCard
                src={result.gradcam_heatmap}
                label="Grad-CAM Heatmap"
                sublabel="Jet colormap activation map"
                icon={<Zap size={14} />}
              />
              <ImageCard
                src={result.gradcam_overlay}
                label="Highlighted Regions"
                sublabel="Heatmap overlaid on CT scan"
                icon={<Layers size={14} />}
              />
            </div>

            {/* Explanation text */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '14px 18px',
              marginBottom: 12,
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-soft)', lineHeight: 1.7 }}>
                <strong>Grad-CAM</strong> (Gradient-weighted Class Activation Mapping) highlights image regions that contributed most strongly 
                to the model's prediction. Warmer colors (red/orange) indicate higher influence on the classification decision.
              </p>
            </div>

            {/* Medical disclaimer */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: 10,
              padding: '12px 16px',
            }}>
              <Info size={16} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: '0.8rem', color: '#0369a1', lineHeight: 1.6 }}>
                <strong>Important:</strong> Highlighted regions represent areas that influenced the model's prediction and should 
                not be interpreted as a definitive medical diagnosis or the confirmed anatomical location of disease. 
                Professional medical evaluation is always required.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reset button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <button onClick={onReset} className="btn-secondary">
          <RotateCcw size={15} />
          Analyze Another CT Scan
        </button>
      </div>
    </div>
  );
};

export default ResultPanel;
