import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ModelPage from './pages/ModelPage';
import AboutPage from './pages/AboutPage';

type Page = 'home' | 'detection' | 'how-it-works' | 'model' | 'about';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Scroll to top on page change
  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update document title based on page
  useEffect(() => {
    const titles: Record<Page, string> = {
      'home':         'LungXAI — Explainable Lung Cancer Detection',
      'detection':    'CT Scan Analysis — LungXAI',
      'how-it-works': 'How It Works — LungXAI',
      'model':        'Model Information — LungXAI',
      'about':        'About the Project — LungXAI',
    };
    document.title = titles[currentPage] ?? 'LungXAI';
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':         return <HomePage onNavigate={navigate} />;
      case 'detection':    return <DetectionPage />;
      case 'how-it-works': return <HowItWorksPage />;
      case 'model':        return <ModelPage />;
      case 'about':        return <AboutPage />;
      default:             return <HomePage onNavigate={navigate} />;
    }
  };

  // Hero pages use a dark navbar with transparent-to-frosted behaviour;
  // other pages always use the frosted style.
  const isDarkHero = currentPage === 'home';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Always-dark background for the nav when not on hero */}
      {!isDarkHero && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99,
          height: 68,
          background: 'rgba(10,22,40,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }} />
      )}
      <Navbar currentPage={currentPage} onNavigate={navigate} />

      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
};

export default App;
