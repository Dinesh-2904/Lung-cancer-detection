import React, { useState, useEffect } from 'react';
import { Activity, Zap, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'detection', label: 'Detection' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'model', label: 'Model' },
  { id: 'about', label: 'About' },
];

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(10,22,40,0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={20} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'white', lineHeight: 1.1 }}>
                LungXAI
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400, letterSpacing: '0.05em' }}>
                Explainable Lung Cancer Detection
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  color: currentPage === item.id ? '#67e8f9' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (currentPage !== item.id) (e.target as HTMLButtonElement).style.color = 'white';
                }}
                onMouseLeave={e => {
                  if (currentPage !== item.id) (e.target as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button + Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => handleNav('detection')}
              className="btn-primary"
              style={{ padding: '9px 20px', fontSize: '0.85rem' }}
            >
              <Zap size={14} />
              Analyze CT Scan
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                background: 'none', border: 'none', cursor: 'pointer', color: 'white',
                padding: 4,
              }}
              className="mobile-toggle"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            background: 'rgba(10,22,40,0.97)',
            borderRadius: 12,
            padding: '12px 0',
            marginBottom: 8,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '11px 20px',
                  color: currentPage === item.id ? '#67e8f9' : 'rgba(255,255,255,0.8)',
                  fontWeight: 500, fontSize: '0.95rem',
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
