import React from 'react';
import { BookOpen, Brain, Zap, Code2, ArrowRight, GraduationCap } from 'lucide-react';

const techStack = [
  { label: 'Deep Learning', desc: 'Neural networks trained to learn from CT scan image data', color: '#2563eb', bg: '#dbeafe' },
  { label: 'Transfer Learning', desc: 'InceptionV3 pre-trained on ImageNet, fine-tuned on lung CT data', color: '#7c3aed', bg: '#ede9fe' },
  { label: 'InceptionV3', desc: 'State-of-the-art CNN architecture with multi-scale feature extraction', color: '#0e7490', bg: '#cffafe' },
  { label: 'Explainable AI', desc: 'Making model decisions transparent and interpretable to humans', color: '#db2777', bg: '#fce7f3' },
  { label: 'Grad-CAM', desc: 'Gradient-based visual explanation of convolutional network predictions', color: '#d97706', bg: '#fef3c7' },
  { label: 'CT Image Classification', desc: '4-class categorization of chest CT scans using deep neural networks', color: '#059669', bg: '#d1fae5' },
];

const AboutPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 88, paddingBottom: 80, background: '#f8fafc' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label" style={{ marginBottom: 10 }}>Academic Project</div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--color-navy)', marginBottom: 14 }}>About the Project</h1>
          <p style={{ color: 'var(--color-text-soft)', maxWidth: 580, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.75 }}>
            An academic deep learning project combining medical image classification with explainable AI to make model predictions interpretable.
          </p>
        </div>

        {/* About Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #1e3a6e 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          color: 'white',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: -40,
            width: 160, height: 160,
            background: 'radial-gradient(circle, rgba(129,140,248,0.12), transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(6,182,212,0.15)',
              border: '1px solid rgba(6,182,212,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <GraduationCap size={24} color="#67e8f9" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'white', marginBottom: 4 }}>
                Lung Cancer Detection with Explainable AI
              </h2>
              <span style={{
                display: 'inline-block',
                background: 'rgba(6,182,212,0.15)',
                border: '1px solid rgba(6,182,212,0.25)',
                borderRadius: 99,
                padding: '3px 12px',
                fontSize: '0.72rem',
                color: '#67e8f9',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Academic Deep Learning Project
              </span>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 20 }}>
            This project applies deep learning and Explainable AI to CT scan image classification. 
            <strong style={{ color: 'white' }}> InceptionV3</strong> is used as the backbone model with 
            <strong style={{ color: 'white' }}> transfer learning</strong> from ImageNet weights, fine-tuned to classify 
            chest CT images into four categories: Adenocarcinoma, Large Cell Carcinoma, Squamous Cell Carcinoma, and Normal.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.8 }}>
            <strong style={{ color: '#67e8f9' }}>Grad-CAM</strong> (Gradient-weighted Class Activation Mapping) provides a visual explanation 
            of the regions in the CT scan that most influenced the model's prediction, making the AI's decision-making process 
            transparent and understandable to medical professionals and researchers.
          </p>
        </div>

        {/* Technology Stack */}
        <div className="card" style={{ padding: '28px', marginBottom: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>Technology Stack</div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>Key Technologies &amp; Concepts</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {techStack.map(({ label, desc, color, bg }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '14px',
                background: bg,
                borderRadius: 10,
                border: `1px solid ${color}22`,
              }}>
                <ArrowRight size={14} color={color} style={{ flexShrink: 0, marginTop: 3 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.55 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Architecture */}
        <div className="card" style={{ padding: '28px', marginBottom: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>System Design</div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-navy)' }}>Full-Stack Architecture</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              {
                icon: <Code2 size={20} color="#2563eb" />,
                iconBg: '#dbeafe',
                title: 'Frontend',
                items: ['React + TypeScript', 'Tailwind CSS', 'Vite build tool', 'Responsive design'],
              },
              {
                icon: <Brain size={20} color="#7c3aed" />,
                iconBg: '#ede9fe',
                title: 'Backend API',
                items: ['FastAPI (Python)', 'PyTorch inference', 'OpenCV processing', 'REST API'],
              },
              {
                icon: <Zap size={20} color="#db2777" />,
                iconBg: '#fce7f3',
                title: 'AI / ML',
                items: ['InceptionV3 model', 'Transfer learning', 'Grad-CAM XAI', '4-class Softmax'],
              },
              {
                icon: <BookOpen size={20} color="#059669" />,
                iconBg: '#d1fae5',
                title: 'Data Flow',
                items: ['CT scan upload', 'Image preprocessing', 'Model inference', 'Base64 result images'],
              },
            ].map(({ icon, iconBg, title, items }) => (
              <div key={title} style={{
                background: '#f8fafc',
                borderRadius: 12,
                padding: '18px',
                border: '1px solid #e2e8f0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {icon}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-navy)' }}>{title}</span>
                </div>
                {items.map(item => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 0',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.82rem',
                    color: 'var(--color-text-soft)',
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#cbd5e1', flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          display: 'flex', alignItems: 'flex-start', gap: 14,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: '#fef3c7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <BookOpen size={18} color="#d97706" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#92400e', marginBottom: 6 }}>
              Academic &amp; Educational Use Only
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.7 }}>
              This system is built as an academic research and demonstration project. 
              AI-assisted analysis only. Not intended as a substitute for professional medical diagnosis. 
              All predictions should be reviewed by a qualified physician before any clinical decisions are made.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
