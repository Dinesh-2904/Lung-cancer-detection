import React from 'react';
import { ArrowRight, Zap, Brain, Shield, ChevronDown } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

// Inline SVG lung illustration
const LungIllustration: React.FC = () => (
  <svg viewBox="0 0 320 280" width="100%" height="100%" style={{ maxWidth: 320 }}>
    {/* Background glow */}
    <defs>
      <radialGradient id="lungGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="heatGlow" cx="60%" cy="40%" r="30%">
        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
        <stop offset="40%" stopColor="#f97316" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
      </radialGradient>
      <filter id="blur1">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="blur2">
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>

    {/* Background circle */}
    <ellipse cx="160" cy="140" rx="140" ry="120" fill="url(#lungGlow)" />

    {/* CT scan grid lines */}
    {[60, 100, 140, 180, 220, 260].map(x => (
      <line key={`v${x}`} x1={x} y1="20" x2={x} y2="260" stroke="rgba(6,182,212,0.08)" strokeWidth="1" />
    ))}
    {[40, 80, 120, 160, 200, 240].map(y => (
      <line key={`h${y}`} x1="20" y1={y} x2="300" y2={y} stroke="rgba(6,182,212,0.08)" strokeWidth="1" />
    ))}

    {/* Left lung */}
    <path
      d="M145 60 Q120 50 100 70 Q75 90 70 130 Q65 170 80 200 Q95 225 120 220 Q140 215 148 190 Q155 160 152 120 Z"
      fill="rgba(255,255,255,0.06)"
      stroke="rgba(6,182,212,0.5)"
      strokeWidth="1.5"
    />
    {/* Left lung inner */}
    <path
      d="M140 70 Q118 62 100 80 Q80 100 78 135 Q75 165 88 195 Q100 218 120 213 Q137 208 144 185 Q150 160 148 122 Z"
      fill="rgba(6,182,212,0.06)"
    />

    {/* Right lung */}
    <path
      d="M155 60 Q180 50 200 70 Q225 90 230 130 Q235 170 220 200 Q205 225 180 220 Q160 215 152 190 Q145 160 148 120 Z"
      fill="rgba(255,255,255,0.06)"
      stroke="rgba(6,182,212,0.5)"
      strokeWidth="1.5"
    />
    {/* Right lung inner */}
    <path
      d="M160 70 Q182 62 200 80 Q220 100 222 135 Q225 165 212 195 Q200 218 180 213 Q163 208 156 185 Q150 160 152 122 Z"
      fill="rgba(6,182,212,0.06)"
    />

    {/* Trachea */}
    <path
      d="M150 30 Q150 50 148 60 M150 30 Q150 50 152 60"
      stroke="rgba(6,182,212,0.5)"
      strokeWidth="2"
      fill="none"
    />
    <rect x="146" y="25" width="8" height="35" rx="3" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.5)" strokeWidth="1" />

    {/* Grad-CAM heatmap highlight (right lung focus area) */}
    <ellipse cx="195" cy="115" rx="30" ry="25" fill="url(#heatGlow)" filter="url(#blur2)" opacity="0.7" />
    <ellipse cx="193" cy="113" rx="15" ry="12" fill="#ef4444" opacity="0.2" />

    {/* Grad-CAM outline */}
    <ellipse
      cx="195" cy="115" rx="28" ry="22"
      fill="none"
      stroke="#f97316"
      strokeWidth="1.5"
      strokeDasharray="4 3"
      opacity="0.7"
    />

    {/* Neural network dots */}
    {[
      [50, 50], [50, 100], [50, 150],
      [90, 75], [90, 125],
      [265, 55], [265, 105], [265, 155],
      [230, 75], [230, 130],
    ].map(([cx, cy], i) => (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r="3.5"
        fill="rgba(6,182,212,0.4)"
        stroke="rgba(6,182,212,0.7)"
        strokeWidth="1"
      />
    ))}
    {/* Neural connections */}
    {[
      [[50,50],[90,75]], [[50,100],[90,75]], [[50,100],[90,125]], [[50,150],[90,125]],
      [[265,55],[230,75]], [[265,105],[230,75]], [[265,105],[230,130]], [[265,155],[230,130]],
    ].map(([[x1,y1],[x2,y2]], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(6,182,212,0.2)" strokeWidth="0.8" />
    ))}

    {/* Prediction label */}
    <rect x="60" y="238" width="200" height="28" rx="6" fill="rgba(37,99,235,0.2)" stroke="rgba(37,99,235,0.4)" strokeWidth="1" />
    <text x="160" y="257" textAnchor="middle" fill="rgba(103,232,249,0.9)" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">
      Adenocarcinoma · 82.4% Confidence
    </text>

    {/* Scan line animation */}
    <line x1="20" y1="140" x2="300" y2="140" stroke="rgba(6,182,212,0.4)" strokeWidth="1">
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,-120;0,120;0,-120"
        dur="3s"
        repeatCount="indefinite"
      />
    </line>
  </svg>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="hero-bg grid-pattern" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 68 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 60,
            alignItems: 'center',
          }}>
            {/* Left — Text */}
            <div>
              <div className="anim-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span className="badge badge-cyan" style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.3)' }}>
                  <Zap size={11} /> Explainable AI
                </span>
                <span className="badge badge-blue" style={{ background: 'rgba(37,99,235,0.15)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.3)' }}>
                  InceptionV3
                </span>
              </div>

              <h1
                className="anim-fade-up delay-100"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: 'white',
                  lineHeight: 1.15,
                  marginBottom: 20,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                AI-Powered Lung Cancer Detection{' '}
                <span style={{ background: 'linear-gradient(90deg, #06b6d4, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  with Explainable AI
                </span>
              </h1>

              <p
                className="anim-fade-up delay-200"
                style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: 32, maxWidth: 500 }}
              >
                Analyze CT scan images using a deep learning model and understand the regions that influenced the 
                prediction with Grad-CAM visual explanations.
              </p>

              <div className="anim-fade-up delay-300" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
                <button onClick={() => onNavigate('detection')} className="btn-primary">
                  Analyze CT Scan <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.08)',
                    color: 'white',
                    padding: '12px 28px',
                    borderRadius: 99,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    border: '1px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                >
                  How It Works
                </button>
              </div>

              {/* Stats */}
              <div className="anim-fade-up delay-400" style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[
                  { label: 'Classes', value: '4' },
                  { label: 'Architecture', value: 'InceptionV3' },
                  { label: 'XAI Method', value: 'Grad-CAM' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>{value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual */}
            <div className="anim-fade-up delay-200" style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="anim-float" style={{
                width: '100%', maxWidth: 380,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 24,
                border: '1px solid rgba(6,182,212,0.2)',
                padding: 24,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 60px rgba(6,182,212,0.12)',
              }}>
                {/* Header bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  {['#ef4444','#fbbf24','#22c55e'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
                  ))}
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>lung-ct-scan.png</span>
                </div>

                <LungIllustration />

                {/* Output */}
                <div style={{
                  marginTop: 16,
                  background: 'rgba(6,182,212,0.08)',
                  border: '1px solid rgba(6,182,212,0.2)',
                  borderRadius: 10,
                  padding: '10px 14px',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', marginBottom: 4 }}>
                    {'// model output'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#67e8f9', fontSize: '0.8rem', fontFamily: 'monospace' }}>predicted_class</span>
                    <span style={{ color: '#c4b5fd', fontSize: '0.8rem', fontFamily: 'monospace' }}>"Adenocarcinoma"</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span style={{ color: '#67e8f9', fontSize: '0.8rem', fontFamily: 'monospace' }}>confidence</span>
                    <span style={{ color: '#86efac', fontSize: '0.8rem', fontFamily: 'monospace' }}>0.824</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <button
              onClick={() => onNavigate('how-it-works')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.3)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                animation: 'float 2s ease-in-out infinite',
              }}
            >
              Scroll to explore
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="medical-bg" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Core Capabilities</div>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)' }}>Built for Accurate Analysis</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              {
                icon: <Brain size={24} color="#2563eb" />,
                iconBg: '#dbeafe',
                title: 'InceptionV3 Backbone',
                desc: 'Transfer learning with InceptionV3 pre-trained on ImageNet, fine-tuned for 4-class lung CT classification.',
              },
              {
                icon: <Zap size={24} color="#7c3aed" />,
                iconBg: '#ede9fe',
                title: 'Grad-CAM Explainability',
                desc: 'Visual explanation of model decisions using gradient-based class activation mapping on the final convolutional layer.',
              },
              {
                icon: <Shield size={24} color="#059669" />,
                iconBg: '#d1fae5',
                title: '4-Class Classification',
                desc: 'Classifies CT images into Adenocarcinoma, Large Cell Carcinoma, Squamous Cell Carcinoma, or Normal.',
              },
            ].map(({ icon, iconBg, title, desc }) => (
              <div key={title} className="card" style={{ padding: '28px 24px' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-soft)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CLASS INFORMATION ============ */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Classification Categories</div>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-navy)', marginBottom: 12 }}>Four Lung CT Classes</h2>
            <p style={{ color: 'var(--color-text-soft)', maxWidth: 520, margin: '0 auto', fontSize: '0.95rem' }}>
              The model classifies CT scans into four categories. Descriptions are educational only.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              {
                name: 'Adenocarcinoma',
                color: '#1d4ed8', bg: '#dbeafe', borderColor: '#bfdbfe',
                description: 'The most common lung cancer type in non-smokers. Typically arises in the outer regions of the lung and grows relatively slowly.',
                label: 'Malignant',
              },
              {
                name: 'Large Cell Carcinoma',
                color: '#7c3aed', bg: '#ede9fe', borderColor: '#ddd6fe',
                description: 'A fast-growing lung cancer that can appear in any part of the lung. Characterized by large, abnormal cells.',
                label: 'Malignant',
              },
              {
                name: 'Squamous Cell Carcinoma',
                color: '#0e7490', bg: '#cffafe', borderColor: '#a5f3fc',
                description: 'Often develops in the central chest area near the main airways. Frequently associated with a history of smoking.',
                label: 'Malignant',
              },
              {
                name: 'Normal',
                color: '#059669', bg: '#d1fae5', borderColor: '#a7f3d0',
                description: 'No malignant patterns detected in the CT scan. Lung tissue appears within the normal range of variation.',
                label: 'Benign',
              },
            ].map(({ name, color, bg, borderColor, description, label }) => (
              <div key={name} style={{
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                background: 'white',
                border: `1px solid ${borderColor}`,
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: color,
                  }} />
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '2px 10px', borderRadius: 99,
                    background: bg, color: color,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    {label}
                  </span>
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>{name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-soft)', lineHeight: 1.65 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #0a1628 0%, #1e3a6e 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: 16, fontFamily: 'Space Grotesk, sans-serif' }}>
            Ready to Analyze a CT Scan?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32, fontSize: '0.95rem', lineHeight: 1.7 }}>
            Upload a lung CT scan image and get an AI-powered classification with Grad-CAM visual explanation.
          </p>
          <button onClick={() => onNavigate('detection')} className="btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
            Analyze CT Scan <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
