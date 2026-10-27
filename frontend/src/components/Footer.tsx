import React from 'react';
import { Activity, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer style={{
      background: 'var(--color-navy)',
      color: 'rgba(255,255,255,0.6)',
      padding: '48px 24px 28px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Top Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Activity size={18} color="white" />
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>
                LungXAI
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)' }}>
              Lung Cancer Detection with Explainable AI — Academic Deep Learning Project
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', marginBottom: 12 }}>Navigation</h4>
            {[
              { id: 'home', label: 'Home' },
              { id: 'detection', label: 'Detection' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'model', label: 'Model' },
              { id: 'about', label: 'About' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'block', background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem',
                  padding: '4px 0', transition: 'color 0.2s', textAlign: 'left',
                }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#67e8f9'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Technology */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', marginBottom: 12 }}>Technology</h4>
            {['InceptionV3', 'Transfer Learning', 'Grad-CAM XAI', 'PyTorch', 'FastAPI', 'React + TypeScript'].map(tech => (
              <div key={tech} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', padding: '4px 0' }}>
                {tech}
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', marginBottom: 12 }}>Medical Disclaimer</h4>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)' }}>
              AI-assisted analysis only. Not a substitute for professional medical diagnosis. 
              Always consult a qualified healthcare professional for medical decisions.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }} />

        {/* Bottom Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
            LungXAI — Lung Cancer Detection with Explainable AI
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>
            <Heart size={12} fill="currentColor" />
            Academic Deep Learning Project
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
