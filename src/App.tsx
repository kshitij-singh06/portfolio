import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Navbar from './components/Navbar';

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      <div className="bg-noise"></div>
      <Navbar scrolled={scrolled} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Analytics />
    </div>
  );
}

export default App;
