import React from 'react';
import { Cpu, GitBranch, Database, Zap, Code2, Layers, BarChart } from 'lucide-react';

const modelCards = [
  { icon: <Cpu size={22} color="#2563eb" />, iconBg: '#dbeafe', label: 'Model', value: 'InceptionV3' },
  { icon: <GitBranch size={22} color="#7c3aed" />, iconBg: '#ede9fe', label: 'Learning', value: 'Transfer Learning' },
  { icon: <Layers size={22} color="#0e7490" />, iconBg: '#cffafe', label: 'Task', value: '4-Class CT Classification' },
  { icon: <Zap size={22} color="#db2777" />, iconBg: '#fce7f3', label: 'Explainability', value: 'Grad-CAM' },
  { icon: <Code2 size={22} color="#d97706" />, iconBg: '#fef3c7', label: 'Framework', value: 'PyTorch' },
  { icon: <BarChart size={22} color="#059669" />, iconBg: '#d1fae5', label: 'Classes', value: '4' },
  { icon: <Database size={22} color="#64748b" />, iconBg: '#f1f5f9', label: 'Dataset', value: 'Chest CT-Scan Images' },
];

const architectureSteps = [
  { step: 'Input', detail: '299 × 299 × 3 CT scan image (RGB)', color: '#dbeafe', textColor: '#1d4ed8' },
  { step: 'Stem', detail: 'Conv 3×3, stride 2 → BatchNorm → ReLU', color: '#f1f5f9', textColor: '#475569' },
  { step: 'Inception Blocks A', detail: '3× Mixed_5b, Mixed_5c, Mixed_5d', color: '#f1f5f9', textColor: '#475569' },
  { step: 'Inception Blocks B', detail: '5× Mixed_6a … Mixed_6e', color: '#f1f5f9', textColor: '#475569' },
  { step: 'Inception Blocks C', detail: '3× Mixed_7a, Mixed_7b, Mixed_7c ← Grad-CAM target', color: '#ede9fe', textColor: '#6d28d9' },
  { step: 'Global Avg Pool', detail: '8 × 8 → 1 × 1 × 2048', color: '#f1f5f9', textColor: '#475569' },
  { step: 'Dropout', detail: 'p = 0.5 (training only)', color: '#f1f5f9', textColor: '#475569' },
  { step: 'FC Layer', detail: 'Linear(2048 → 4)', color: '#cffafe', textColor: '#0e7490' },
  { step: 'Softmax', detail: '4-class probability distribution', color: '#d1fae5', textColor: '#059669' },
];

const ModelPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, paddingBottom: 80, background: '#f8fafc' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ marginBottom: 10 }}>Deep Learning Architecture</div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginBottom: 14 }}>Model Information</h1>
          <p style={{ color: 'var(--color-text-soft)', maxWidth: 560, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.75 }}>
            Technical details of the InceptionV3-based classification model with transfer learning and Grad-CAM explainability.
          </p>
        </div>

        {/* Model Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 40,
        }}>
          {modelCards.map(({ icon, iconBg, label, value }) => (
            <div
              key={label}
              className="card"
              style={{
                padding: '20px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
              }}>
                {icon}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-navy)', lineHeight: 1.3 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <div className="card" style={{ padding: '28px', marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>Architecture</div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>InceptionV3 Architecture Flow</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {architectureSteps.map(({ step, detail, color, textColor }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'stretch', gap: 12 }}>
                {/* Connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: textColor, flexShrink: 0, marginTop: 14,
                  }} />
                  {i < architectureSteps.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: '#e2e8f0', marginTop: 4 }} />
                  )}
                </div>

                {/* Block */}
                <div style={{
                  flex: 1,
                  background: color,
                  borderRadius: 8,
                  padding: '10px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 8,
                  marginBottom: 2,
                }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: textColor }}>{step}</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace' }}>{detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grad-CAM Info */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          color: 'white',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(129,140,248,0.2)',
              border: '1px solid rgba(129,140,248,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Zap size={22} color="#a5b4fc" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: 8, color: '#a5b4fc' }}>
                Grad-CAM Explainability
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 12 }}>
                Gradient-weighted Class Activation Mapping (Grad-CAM) computes the gradient of the predicted class score 
                with respect to the feature maps of the <strong style={{ color: '#c4b5fd' }}>Mixed_7c</strong> layer — the final convolutional 
                block in InceptionV3.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 10,
              }}>
                {[
                  ['Target Layer', 'Mixed_7c'],
                  ['Method', 'Backpropagation'],
                  ['Activation', 'ReLU (positive only)'],
                  ['Pooling', 'Global Average (spatial)'],
                  ['Output', 'Upsampled heatmap'],
                  ['Colormap', 'Jet (OpenCV)'],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 8, padding: '8px 12px',
                  }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#e0e7ff', fontFamily: 'monospace' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preprocessing spec */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div className="section-label" style={{ marginBottom: 8 }}>Preprocessing Config</div>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-navy)', marginBottom: 16 }}>Training-Matched Preprocessing</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {[
              { label: 'IMAGE_SIZE', value: '299 × 299 px' },
              { label: 'NUM_CLASSES', value: '4' },
              { label: 'NORM_MEAN', value: '[0.485, 0.456, 0.406]' },
              { label: 'NORM_STD', value: '[0.229, 0.224, 0.225]' },
              { label: 'COLOR MODE', value: 'RGB' },
              { label: 'INTERPOLATION', value: 'Bilinear (LANCZOS)' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: '#f8fafc',
                borderRadius: 8, padding: '12px',
                border: '1px solid #e2e8f0',
              }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', fontFamily: 'monospace' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModelPage;
