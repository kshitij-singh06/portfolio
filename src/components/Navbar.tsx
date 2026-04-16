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

// Dock magnification constants
const BASE_SIZE = 48;
const MAX_SIZE = 80;
const INFLUENCE_RADIUS = 150;

interface DockItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isTheme?: boolean;
}

// SVG Glass distortion filter — same filter used in the reference liquid-glass code
const GlassFilter = () => (
  <svg style={{ display: 'none' }}>
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
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const dockItems: DockItem[] = [
    ...navItems.map(item => ({
      id: item.id,
      label: item.label,
      icon: sectionIcons[item.id],
    })),
    {
      id: '__theme__',
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      icon: theme === 'dark' ? Sun : Moon,
      isTheme: true,
    },
  ];

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
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

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
    setTooltip(null);
  }, []);

  // Quadratic magnification falloff based on cursor distance
  const getItemSize = (index: number): number => {
    if (mouseX === null) return BASE_SIZE;
    const btn = itemRefs.current[index];
    if (!btn) return BASE_SIZE;
    const rect = btn.getBoundingClientRect();
    const itemCenterX = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - itemCenterX);
    if (dist > INFLUENCE_RADIUS) return BASE_SIZE;
    const t = 1 - dist / INFLUENCE_RADIUS;
    return BASE_SIZE + (MAX_SIZE - BASE_SIZE) * (t * t);
  };

  // ─── Shared glass shell layers ───────────────────────────────────────────────
  // Layer 1: SVG-filter distortion blur (the "liquid" wobble)
  // Layer 2: Tinted translucent fill
  // Layer 3: Inner highlight border via inset box-shadow
  const glassDistortionLayer = (
    <div
      className="absolute inset-0 z-0 overflow-hidden rounded-[24px]"
      style={{
        backdropFilter: 'blur(3px)',
        filter: 'url(#glass-distortion)',
        isolation: 'isolate',
      }}
    />
  );

  const glassFillLayer = (
    <div
      className="absolute inset-0 z-10 rounded-[24px]"
      style={{
        background:
          theme === 'dark'
            ? 'rgba(255, 255, 255, 0.07)'
            : 'rgba(20, 20, 30, 0.10)',
      }}
    />
  );

  const glassHighlightLayer = (
    <div
      className="absolute inset-0 z-20 rounded-[24px] pointer-events-none"
      style={{
        // No overflow:hidden here — icons must be able to grow upward past this layer
        boxShadow:
          theme === 'dark'
            ? 'inset 0 1px 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.13)'
            : 'inset 2px 2px 1px 0 rgba(255,255,255,0.55), inset -1px -1px 1px 1px rgba(255,255,255,0.35), 0 0 0 1px rgba(0,0,0,0.08)',
      }}
    />
  );

  return (
    <>
      {/* ── DESKTOP TOP RIGHT — plain text links (pre-scroll) ── */}
      <div
        className="hidden md:flex fixed top-8 right-8 z-50 items-center gap-8"
        style={{
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: scrolled ? 0 : 1,
          transform: scrolled ? 'translateY(-20px)' : 'translateY(0)',
          pointerEvents: scrolled ? 'none' : 'auto',
        }}
      >
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`text-sm tracking-wide font-medium transition-colors
              ${activeSection === item.id
                ? 'text-cyan-500 dark:text-cyan-400'
                : 'text-foreground/70 hover:text-foreground'}`}
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

      {/* ── DESKTOP macOS LIQUID-GLASS DOCK (bottom-center, post-scroll) ── */}
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-[24px]"
        style={{
          overflow: 'visible',
        }}
        // Note: overflow:visible is inlined because Tailwind's overflow-visible
        // can be overridden by child glass layers using overflow:hidden
        style={{
          boxShadow:
            theme === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
          transition:
            'opacity 0.5s cubic-bezier(0.175,0.885,0.32,2.2), transform 0.5s cubic-bezier(0.175,0.885,0.32,2.2)',
          opacity: scrolled ? 1 : 0,
          transform: scrolled
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(20px)',
          pointerEvents: scrolled ? 'auto' : 'none',
        }}
      >
        {/* Liquid glass shell */}
        {glassDistortionLayer}
        {glassFillLayer}
        {glassHighlightLayer}

        {/* Dock content — fixed height pill, icons anchor to bottom and grow upward */}
        <div
          className="relative z-30 flex items-end gap-2 px-5"
          style={{
            height: BASE_SIZE + 24, // fixed: padding-top 12 + icon BASE_SIZE + padding-bottom 12
            paddingBottom: 12,
            overflow: 'visible',
          }}
        >
          {dockItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = !item.isTheme && activeSection === item.id;
            const size = getItemSize(i);
            const isSeparatorBefore = i === dockItems.length - 1;

            return (
              <div
                key={item.id}
                className="relative flex flex-col items-center justify-end"
                style={{
                  width: BASE_SIZE,
                  height: BASE_SIZE,
                  overflow: 'visible',
                  flexShrink: 0,
                }}
              >
                {/* Tooltip — positioned above the icon regardless of its current size */}
                {tooltip === item.id && (
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl
                      border text-xs font-medium whitespace-nowrap shadow-xl backdrop-blur-sm
                      pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-150
                      ${theme === 'dark'
                        ? 'bg-white/10 border-white/15 text-white'
                        : 'bg-black/10 border-black/10 text-black/80'}`}
                    style={{
                      bottom: `calc(${getItemSize(i)}px + 2px)`,
                      zIndex: 50,
                    }}
                  >
                    <span className="relative z-10">{item.label}</span>
                  </div>
                )}

                {/* Separator before theme toggle */}
                {isSeparatorBefore && (
                  <div
                    className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-px h-8
                      ${theme === 'dark' ? 'bg-white/15' : 'bg-black/10'}`}
                  />
                )}

                <button
                  ref={el => { itemRefs.current[i] = el; }}
                  onClick={() => {
                    if (item.isTheme) toggleTheme();
                    else scrollToSection(item.id);
                  }}
                  onMouseEnter={() => setTooltip(item.id)}
                  onMouseLeave={() => setTooltip(null)}
                  aria-label={item.label}
                  style={{
                    width: size,
                    height: size,
                    // Grow upward from the bottom — this is the key macOS dock behaviour
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    transition:
                      'width 0.15s cubic-bezier(0.34,1.56,0.64,1), height 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                  className={`flex items-center justify-center rounded-2xl
                    group overflow-visible
                    ${isActive ? '' : 'transition-[width,height] duration-200'}`}
                >
                  <Icon
                    className={`shrink-0 relative z-30 transition-colors duration-200
                      ${isActive
                        ? 'text-[#35D4FF] drop-shadow-[0_0_8px_rgba(53,212,255,0.6)]'
                        : theme === 'dark'
                          ? 'text-[#C7CEDB] group-hover:text-white'
                          : 'text-black/55 group-hover:text-black/90'}`}
                    style={{ width: size * 0.44, height: size * 0.44 }}
                  />

                  {/* Active glow dot */}
                  {isActive && (
                    <span
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30
                        w-1 h-1 rounded-full bg-[#35D4FF]
                        shadow-[0_0_6px_rgba(53,212,255,0.9)]"
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE: glass top bar ── */}
      <nav
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled ? 'border-b border-border/40' : 'border-transparent'}`}
        style={{
          background: scrolled
            ? theme === 'dark'
              ? 'rgba(3,7,18,0.75)'
              : 'rgba(255,255,255,0.65)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
      >
        <div className="flex items-center justify-end px-4 h-14">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground
                hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground
                hover:bg-white/10 transition-colors"
            >
              <div className="relative w-5 h-5">
                <Menu
                  size={20}
                  className={`absolute inset-0 transition-all duration-200
                    ${mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}
                />
                <X
                  size={20}
                  className={`absolute inset-0 transition-all duration-200
                    ${mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown — liquid glass */}
      {mobileVisible && (
        <div
          className={`md:hidden fixed top-14 left-0 right-0 z-40 mx-3 mt-1 rounded-2xl
            overflow-hidden transition-all duration-300 origin-top
            ${mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95'}`}
          style={{
            boxShadow:
              theme === 'dark'
                ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.10)'
                : '0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.07)',
          }}
        >
          {/* Glass layers for mobile dropdown */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backdropFilter: 'blur(20px)',
              background:
                theme === 'dark'
                  ? 'rgba(3,7,18,0.80)'
                  : 'rgba(255,255,255,0.70)',
            }}
          />
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              boxShadow:
                theme === 'dark'
                  ? 'inset 0 1px 1px rgba(255,255,255,0.08)'
                  : 'inset 0 1px 1px rgba(255,255,255,0.7)',
            }}
          />

          <div className="relative z-20 px-3 py-3 space-y-0.5">
            {navItems.map(item => {
              const isActive = activeSection === item.id;
              const Icon = sectionIcons[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 flex items-center gap-3
                    ${isActive
                      ? theme === 'dark'
                        ? 'bg-white/8 text-white border border-white/10'
                        : 'bg-black/5 text-black border border-black/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/6'}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0
                      ${isActive
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-400'
                        : 'bg-transparent'}`}
                  />
                  {Icon && (
                    <Icon
                      size={15}
                      className={
                        isActive
                          ? 'text-cyan-500 dark:text-cyan-400'
                          : 'text-muted-foreground'
                      }
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SVG glass distortion filter definition */}
      <GlassFilter />
    </>
  );
}