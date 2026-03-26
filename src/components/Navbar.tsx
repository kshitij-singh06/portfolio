import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { navItems } from '../data';

interface NavbarProps {
  scrolled: boolean;
}

export default function Navbar({ scrolled }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileVisible, setMobileVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Active section via IntersectionObserver
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  // Animate mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileVisible(true);
    } else {
      const t = setTimeout(() => setMobileVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ── TOP BAR (before scroll, desktop) ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-900 flex items-center justify-center text-sm font-bold bg-gradient-to-br from-cyan-400 to-violet-500 bg-clip-text text-transparent hover:border-zinc-500 transition-colors"
            >
              KS
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-lg bg-white/10 border border-white/10" />
                    )}
                    <span className="relative">{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
            >
              <div className="relative w-5 h-5">
                <Menu size={20} className={`absolute inset-0 transition-all duration-200 ${mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X size={20} className={`absolute inset-0 transition-all duration-200 ${mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── LEFT SIDE FLOATING PILL (after scroll, desktop only) ── */}
      <div
        className={`hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-1
          rounded-2xl border border-zinc-700/60 bg-zinc-950/85 backdrop-blur-xl shadow-xl shadow-black/40 px-2 py-3
          transition-all duration-500
          ${scrolled ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-8 pointer-events-none'}`}
      >
        {/* Logo at top */}
        <button
          onClick={() => scrollToSection('hero')}
          className="w-7 h-7 mb-2 rounded-lg border border-zinc-700 bg-zinc-900 flex items-center justify-center text-xs font-bold bg-gradient-to-br from-cyan-400 to-violet-500 bg-clip-text text-transparent hover:border-zinc-500 transition-colors"
        >
          KS
        </button>

        {/* Thin separator */}
        <div className="w-4 h-px bg-zinc-700 mb-1" />

        {/* Vertical nav items */}
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              title={item.label}
              className={`relative group flex items-center justify-center w-full px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200
                ${isActive
                  ? 'text-white bg-white/10 border border-white/10'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-violet-400" />
              )}
              <span className="writing-mode-vertical rotate-0">{item.label}</span>

              {/* Tooltip on hover */}
              <span className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs text-white bg-zinc-800 border border-zinc-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── MOBILE MENU (slide down, always from top) ── */}
      {mobileVisible && (
        <div
          className={`md:hidden fixed top-14 left-0 right-0 z-40 mx-3 mt-1 rounded-2xl border border-zinc-700/60
            bg-zinc-950/95 backdrop-blur-xl shadow-xl shadow-black/40 overflow-hidden
            transition-all duration-300 origin-top
            ${mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95'}`}
        >
          <div className="px-3 py-3 space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3
                    ${isActive
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-gradient-to-r from-cyan-400 to-violet-400' : 'bg-transparent'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
