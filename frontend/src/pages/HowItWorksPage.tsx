import React from 'react';
import {
  Upload, Cpu, Layers, BarChart2, Zap, Eye,
  ArrowDown, CheckCircle
} from 'lucide-react';

const steps = [
  {
    icon: <Upload size={22} color="#2563eb" />,
    iconBg: '#dbeafe',
    number: '01',
    title: 'CT Scan Upload',
    description: 'A lung CT scan image (JPG/PNG) is uploaded through the web interface and securely sent to the backend API.',
    detail: 'Supports drag-and-drop or file browsing. Validated for format and size before sending.',
  },
  {
    icon: <Layers size={22} color="#0e7490" />,
    iconBg: '#cffafe',
    number: '02',
    title: 'Image Preprocessing',
    description: 'The CT image is resized to 299×299 pixels and normalized using ImageNet statistics — exactly matching the training pipeline.',
    detail: 'Mean: [0.485, 0.456, 0.406] · Std: [0.229, 0.224, 0.225]',
  },
  {
    icon: <Cpu size={22} color="#7c3aed" />,
    iconBg: '#ede9fe',
    number: '03',
    title: 'InceptionV3 Inference',
    description: 'The preprocessed image is passed through the trained InceptionV3 neural network with transfer learning.',
    detail: 'Deep features are extracted through the convolutional layers before the final classification head.',
  },
  {
    icon: <BarChart2 size={22} color="#059669" />,
    iconBg: '#d1fae5',
    number: '04',
    title: '4-Class Prediction',
    description: 'The final linear layer produces 4 logits, converted to probabilities via Softmax. The highest probability class is predicted.',
    detail: 'Classes: Adenocarcinoma · Large Cell Carcinoma · Squamous Cell Carcinoma · Normal',
  },
  {
    icon: <Zap size={22} color="#db2777" />,
    iconBg: '#fce7f3',
    number: '05',
    title: 'Grad-CAM Computation',
    description: 'Gradients of the predicted class score are computed with respect to the Mixed_7c layer activations using backpropagation.',
    detail: 'The gradient-weighted feature map is pooled and ReLU-activated to generate the attention heatmap.',
  },
  {
    icon: <Eye size={22} color="#d97706" />,
    iconBg: '#fef3c7',
    number: '06',
    title: 'Visual Explanation',
    description: 'The Grad-CAM heatmap is resized to match the original CT scan dimensions and overlaid using a Jet colormap.',
    detail: 'Warmer colors (red/orange) indicate higher influence on the prediction. Results returned as base64 PNG.',
  },
];

const HowItWorksPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, paddingBottom: 80, background: '#f8fafc' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ marginBottom: 10 }}>Methodology</div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginBottom: 14 }}>How It Works</h1>
          <p style={{ color: 'var(--color-text-soft)', maxWidth: 560, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.75 }}>
            A step-by-step walkthrough of the complete pipeline — from CT scan upload to AI prediction and Grad-CAM visual explanation.
          </p>
        </div>

        {/* Pipeline Steps */}
        <div style={{ position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute',
            left: 35,
            top: 60,
            bottom: 60,
            width: 2,
            background: 'linear-gradient(180deg, #2563eb, #06b6d4, #818cf8)',
            opacity: 0.25,
            borderRadius: 99,
          }} />

          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
              {/* Left: number + icon */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 72 }}>
                <div style={{
                  width: 56, height: 56,
                  borderRadius: 16,
                  background: step.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  position: 'relative', zIndex: 1,
                }}>
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8, paddingBottom: 8 }}>
                    <ArrowDown size={14} color="#cbd5e1" />
                  </div>
                )}
              </div>

              {/* Right: content */}
              <div className="card" style={{ flex: 1, padding: '20px 24px', marginBottom: i < steps.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 800,
                    color: '#cbd5e1',
                    letterSpacing: '0.1em',
                    fontFamily: 'Space Grotesk, monospace',
                  }}>STEP {step.number}</span>
                  <CheckCircle size={14} color="#22c55e" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-soft)', lineHeight: 1.65, marginBottom: 10 }}>
                  {step.description}
                </p>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                  color: '#64748b',
                  fontFamily: 'monospace',
                  lineHeight: 1.5,
                }}>
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline summary diagram */}
        <div style={{
          marginTop: 48,
          background: 'linear-gradient(135deg, #0a1628, #1e3a6e)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          color: 'white',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: 24, color: '#67e8f9' }}>Complete Pipeline Overview</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            flexWrap: 'wrap',
            rowGap: 12,
          }}>
            {[
              'CT Scan', 'Preprocessing', 'InceptionV3',
              'Feature Extraction', '4-Class Output', 'Grad-CAM', 'Explanation'
            ].map((label, i, arr) => (
              <React.Fragment key={label}>
                <div style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.9)',
                  whiteSpace: 'nowrap',
                }}>
                  {label}
                </div>
                {i < arr.length - 1 && (
                  <div style={{ color: 'rgba(6,182,212,0.5)', fontSize: '0.9rem', padding: '0 4px' }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorksPage;
