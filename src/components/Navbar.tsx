import { Menu, X, Home, User, Zap, FolderOpen, Mail, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { navItems } from '../data';
import type { LucideIcon } from 'lucide-react';

interface NavbarProps {
  scrolled: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Map section IDs to icons
const sectionIcons: Record<string, LucideIcon> = {
  hero: Home,
  about: User,
  skills: Zap,
  projects: FolderOpen,
  contact: Mail,
};

export default function Navbar({ scrolled, theme, toggleTheme }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileVisible, setMobileVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
      {/* ── TOP BAR (not scrolled, desktop) ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold font-heading bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              PORTFOLIO
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = sectionIcons[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-lg bg-primary/5 border border-primary/10" />
                    )}
                    {Icon && <Icon size={14} className="relative shrink-0" />}
                    <span className="relative">{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
                    )}
                  </button>
                );
              })}

              <div className="w-px h-6 bg-border mx-2" />

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
              >
                <div className="relative w-5 h-5">
                  <Menu size={20} className={`absolute inset-0 transition-all duration-200 ${mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                  <X size={20} className={`absolute inset-0 transition-all duration-200 ${mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── LEFT SIDE FLOATING PILL (scrolled, desktop only) ── */}
      <div
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-50 flex-col items-start gap-0.5
          rounded-2xl border border-border bg-background/80 backdrop-blur-xl
          shadow-[0_0_24px_4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)]
          dark:shadow-[0_0_24px_4px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]
          py-3 transition-all duration-500 ease-in-out overflow-hidden
          ${scrolled ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-8 pointer-events-none'}
          ${expanded ? 'w-40 px-2' : 'w-12 px-2'}`}
      >
        {/* Nav items */}
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = sectionIcons[item.id];
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              title={!expanded ? item.label : undefined}
              className={`relative flex items-center gap-3 w-full rounded-xl px-2 py-2.5 text-xs font-medium transition-all duration-200
                ${isActive
                  ? 'text-foreground bg-primary/5 border border-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-violet-400" />
              )}

              {/* Icon — always visible */}
              {Icon && (
                <Icon
                  size={16}
                  className={`shrink-0 transition-colors duration-200 ml-0.5
                    ${isActive ? 'text-cyan-500 dark:text-cyan-400' : 'text-muted-foreground'}`}
                />
              )}

              {/* Label — slides in on expand */}
              <span
                className={`whitespace-nowrap transition-all duration-300 overflow-hidden
                  ${expanded ? 'opacity-100 max-w-[100px]' : 'opacity-0 max-w-0'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        <div className="w-full h-px bg-border my-2" />

        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 w-full rounded-xl px-2 py-2.5 text-xs font-medium transition-all duration-200
            text-muted-foreground hover:text-foreground hover:bg-secondary/80`}
        >
          <div className="ml-0.5 shrink-0">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </div>
          <span
            className={`whitespace-nowrap transition-all duration-300 overflow-hidden
              ${expanded ? 'opacity-100 max-w-[100px]' : 'opacity-0 max-w-0'}`}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileVisible && (
        <div
          className={`md:hidden fixed top-16 left-0 right-0 z-40 mx-3 mt-1 rounded-2xl border border-border
            bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden
            transition-all duration-300 origin-top
            ${mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95'}`}
        >
          <div className="px-3 py-3 space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = sectionIcons[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3
                    ${isActive
                      ? 'bg-primary/5 text-foreground border border-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-gradient-to-r from-cyan-400 to-violet-400' : 'bg-transparent'}`} />
                  {Icon && <Icon size={15} className={isActive ? 'text-cyan-500 dark:text-cyan-400' : 'text-muted-foreground'} />}
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
