import { Home, User, Zap, FolderOpen, Mail, Sun, Moon, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { navItems } from '../data';
import type { LucideIcon } from 'lucide-react';

interface NavbarProps {
  scrolled: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const sectionIcons: Record<string, LucideIcon> = {
  hero: Home,
  about: User,
  skills: Zap,
  projects: FolderOpen,
  contact: Mail,
};

// The base and max icon sizes for the magnification effect
const BASE_SIZE = 44;
const MAX_SIZE = 72;
const INFLUENCE_RADIUS = 130; // px — how far the magnification spreads

interface DockItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isTheme?: boolean;
}

// SVG Filter Component
const GlassFilter = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="200"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

export default function Navbar({ scrolled, theme, toggleTheme }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const dockItems: DockItem[] = [
    ...navItems.map(item => ({ id: item.id, label: item.label, icon: sectionIcons[item.id] })),
    { id: '__theme__', label: theme === 'dark' ? 'Light Mode' : 'Dark Mode', icon: theme === 'dark' ? Sun : Moon, isTheme: true },
  ];

  // IntersectionObserver for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Mobile menu animation
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

  // Track mouse X position relative to dock for magnification
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
    setHoveredIndex(null);
    setTooltip(null);
  }, []);

  // Calculate magnified size for each dock item
  const getItemSize = (index: number): number => {
    if (mouseX === null) return BASE_SIZE;
    const btn = itemRefs.current[index];
    if (!btn) return BASE_SIZE;
    const rect = btn.getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - itemCenterX);
    if (dist > INFLUENCE_RADIUS) return BASE_SIZE;
    const t = 1 - dist / INFLUENCE_RADIUS; // 0..1
    return BASE_SIZE + (MAX_SIZE - BASE_SIZE) * (t * t); // quadratic falloff
  };

  return (
    <>
      {/* ── DESKTOP TOP RIGHT NAVBAR (Not Scrolled) ── */}
      <div
        className="hidden md:flex fixed top-8 right-8 z-50 items-center gap-8"
        style={{
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: scrolled ? 0 : 1,
          transform: scrolled ? 'translateY(-20px)' : 'translateY(0)',
          pointerEvents: scrolled ? 'none' : 'auto',
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`text-sm tracking-wide font-medium transition-colors
              ${activeSection === item.id ? 'text-cyan-500 dark:text-cyan-400' : 'text-foreground/70 hover:text-foreground'}`}
          >
            {item.label}
          </button>
        ))}
        <div className="w-px h-4 bg-foreground/20" />
        <button
          onClick={toggleTheme}
          className="text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      {/* ── DESKTOP macOS DOCK (bottom-center) ── */}
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 overflow-hidden rounded-[24px]"
        style={{
          boxShadow: theme === 'dark' ? "0 6px 6px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 0, 0, 0.2)" : "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
          transition: 'opacity 0.5s cubic-bezier(0.175, 0.885, 0.32, 2.2), transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 2.2)',
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(16px)',
          pointerEvents: scrolled ? 'auto' : 'none',
        }}
      >
        {/* Glass Layers */}
        <div
          className="absolute inset-0 z-0 overflow-hidden rounded-[24px]"
          style={{
            backdropFilter: "blur(3px)",
            filter: "url(#glass-distortion)",
            isolation: "isolate",
          }}
        />
        <div
          className="absolute inset-0 z-10 rounded-[24px]"
          style={{ background: theme === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(30, 27, 26, 0.12)" }}
        />
        <div
          className="absolute inset-0 z-20 rounded-[24px] overflow-hidden pointer-events-none"
          style={{
            boxShadow: theme === 'dark'
              ? "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.15), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.15)"
              : "inset 2px 2px 1px 0 rgba(0, 0, 0, 0.1), inset -1px -1px 1px 1px rgba(0, 0, 0, 0.08)",
          }}
        />

        {/* Content */}
        <div className="relative z-30 flex items-end gap-2 px-4 py-3">
          {dockItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = !item.isTheme && activeSection === item.id;
            const size = getItemSize(i);
            const isSeparator = i === dockItems.length - 1;

            return (
              <div key={item.id} className="relative flex flex-col items-center" style={{ width: size }}>
                {/* Tooltip */}
                {tooltip === item.id && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg
                    bg-background/90 border border-border text-foreground text-xs font-medium
                    whitespace-nowrap shadow-lg backdrop-blur-sm pointer-events-none
                    animate-in fade-in slide-in-from-bottom-1 duration-150">
                    {item.label}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45
                      bg-background/90 border-r border-b border-border" />
                  </div>
                )}

                {/* Separator before theme button */}
                {isSeparator && (
                  <div className={`absolute -left-3 top-1/2 -translate-y-1/2 w-px h-8 ${theme === 'dark' ? 'bg-white/20' : 'bg-black/10'}`} />
                )}

                <button
                  ref={el => { itemRefs.current[i] = el; }}
                  onClick={() => {
                    if (item.isTheme) toggleTheme();
                    else scrollToSection(item.id);
                  }}
                  onMouseEnter={() => { setHoveredIndex(i); setTooltip(item.id); }}
                  onMouseLeave={() => { setHoveredIndex(null); setTooltip(null); }}
                  aria-label={item.label}
                  style={{
                    width: size,
                    height: size,
                    transition: 'width 0.15s cubic-bezier(0.34,1.56,0.64,1), height 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                  className={`relative flex items-center justify-center rounded-xl
                    transition-all duration-200 group z-10
                    ${isActive
                      ? 'shadow-[0_0_14px_rgba(34,211,238,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] bg-gradient-to-br from-cyan-500/25 to-violet-500/25 border border-cyan-400/40'
                      : theme === 'dark'
                        ? 'bg-white/12 border border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-md'
                        : 'bg-black/12 border border-black/20 hover:bg-black/18 hover:border-black/30 hover:shadow-md'
                    }`}
                >
                  <Icon
                    className={`shrink-0 transition-colors duration-200
                      ${isActive
                        ? 'text-cyan-400 dark:text-cyan-300'
                        : theme === 'dark'
                          ? 'text-white/60 group-hover:text-white/90'
                          : 'text-black/60 group-hover:text-black/90'
                      }`}
                    style={{ width: size * 0.45, height: size * 0.45 }}
                  />

                  {/* Active dot */}
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full
                      bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE: simple top bar ── */}
      <nav
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled ? 'border-b border-border/50 bg-background/80 backdrop-blur-xl' : 'bg-transparent border-transparent'}`}
      >
        <div className="flex items-center justify-end px-4 h-14">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <div className="relative w-5 h-5">
                <Menu size={20} className={`absolute inset-0 transition-all duration-200 ${mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X size={20} className={`absolute inset-0 transition-all duration-200 ${mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileVisible && (
        <div
          className={`md:hidden fixed top-14 left-0 right-0 z-40 mx-3 mt-1 rounded-2xl border border-border
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
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 flex items-center gap-3
                    ${isActive
                      ? 'bg-primary/5 text-foreground border border-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0
                    ${isActive ? 'bg-gradient-to-r from-cyan-400 to-violet-400' : 'bg-transparent'}`} />
                  {Icon && <Icon size={15} className={isActive ? 'text-cyan-500 dark:text-cyan-400' : 'text-muted-foreground'} />}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SVG Filter Definition */}
      <GlassFilter />
    </>
  );
}
