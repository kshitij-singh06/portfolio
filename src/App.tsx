import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Navbar from './components/Navbar';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Page loader slightly longer so the animation fully completes
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999]"
          >
            <div className="relative flex flex-col items-center">
              {/* Spinning Logo Boxes */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-16 h-16 mb-8 relative flex items-center justify-center"
              >
                <motion.div
                  className="absolute inset-0 border-[3px] border-cyan-500/80 rounded-xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 border-[3px] border-violet-500/80 rounded-xl"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ scale: 0.75 }}
                />
                <div className="absolute font-black text-xl tracking-tighter bg-gradient-to-br from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                  KS
                </div>
              </motion.div>

              {/* Typed Text Loader */}
              <div className="flex gap-1 text-sm tracking-[0.3em] text-foreground/80 font-bold">
                {"LOADING".split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0.2, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.05,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: 1,
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>

              {/* Progress Line */}
              <div className="w-48 h-1 mt-6 bg-secondary overflow-hidden rounded-full relative">
                <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-violet-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.8, ease: "circInOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="min-h-screen bg-background text-foreground font-sans selection:bg-cyan-500/30"
        >
          <div className="bg-noise"></div>
          <Navbar scrolled={scrolled} theme={theme} toggleTheme={toggleTheme} />
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
          <Analytics />
        </motion.div>
      )}
    </>
  );
}

export default App;
