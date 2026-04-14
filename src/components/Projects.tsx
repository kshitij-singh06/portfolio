import {
  useRef,
  useEffect,
  useState,
  useCallback,
  CSSProperties,
} from 'react';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data';
import { AnimatedText } from './ui/AnimatedText';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ─────────────────────────────────────────────────────────────────────
type Project = (typeof projects)[0];
type RGB = { r: number; g: number; b: number };

// ─── Dominant-color sampler ────────────────────────────────────────────────────
// Draws the image onto a tiny canvas and averages all non-dark pixels.
function sampleDominantColor(src: string): Promise<RGB> {
  return new Promise((resolve) => {
    const fallback: RGB = { r: 99, g: 102, b: 241 }; // indigo default
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const SIZE = 64;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(fallback);
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const brightness = data[i] + data[i + 1] + data[i + 2];
          // Skip near-black pixels (background) and near-white
          if (brightness > 80 && brightness < 720) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        if (count === 0) return resolve(fallback);
        resolve({
          r: Math.round(r / count),
          g: Math.round(g / count),
          b: Math.round(b / count),
        });
      } catch {
        resolve(fallback);
      }
    };
    img.onerror = () => resolve(fallback);
    img.src = src;
  });
}

const rgbStr = (c: RGB) => `${c.r},${c.g},${c.b}`;

// ─── Transform calculator ──────────────────────────────────────────────────────
function getTransform(offset: number, cardW: number) {
  const abs = Math.abs(offset);
  if (abs > 2) {
    return {
      tx: offset > 0 ? cardW * 2.5 : -cardW * 2.5,
      tz: -500, ry: offset > 0 ? 55 : -55,
      scale: 0.4, opacity: 0, zIndex: 0, blur: 12,
    };
  }
  if (offset === 0) {
    return { tx: 0, tz: 0, ry: 0, scale: 1, opacity: 1, zIndex: 10, blur: 0 };
  }
  const sign = offset > 0 ? 1 : -1;
  if (abs === 1) {
    return {
      tx: sign * cardW * 0.66, tz: -180, ry: sign * -40,
      scale: 0.78, opacity: 0.7, zIndex: 7, blur: 2,
    };
  }
  return {
    tx: sign * cardW * 1.15, tz: -340, ry: sign * -55,
    scale: 0.56, opacity: 0.3, zIndex: 4, blur: 5,
  };
}

// ─── CarouselCard ──────────────────────────────────────────────────────────────
const CarouselCard = ({
  project, offset, cardW, glowColor, onClick,
}: {
  project: Project;
  offset: number;
  cardW: number;
  glowColor: RGB;           // dominant color of the ACTIVE card
  onClick: () => void;
}) => {
  const { tx, tz, ry, scale, opacity, zIndex, blur } = getTransform(offset, cardW);
  const isActive = offset === 0;
  const [hovered, setHovered] = useState(false);
  const hoverScale = isActive && hovered ? 1.025 : scale;
  const gc = rgbStr(glowColor);

  const wrapStyle: CSSProperties = {
    position: 'absolute',
    width: `${cardW}px`,
    left: '50%',
    top: '50%',
    marginLeft: `-${cardW / 2}px`,
    marginTop: '-240px',
    transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${hoverScale})`,
    opacity,
    zIndex,
    filter: blur > 0 ? `blur(${blur}px)` : 'none',
    transition:
      'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease, filter 0.5s ease',
    cursor: isActive ? 'default' : 'pointer',
    willChange: 'transform, opacity, filter',
  };

  const cardStyle: CSSProperties = {
    borderRadius: '20px',
    overflow: 'hidden',
    background: isActive ? 'rgba(8, 8, 18, 0.9)' : 'rgb(8, 8, 18)',
    backdropFilter: isActive ? 'blur(24px)' : 'none',
    WebkitBackdropFilter: isActive ? 'blur(24px)' : 'none',
    border: isActive
      ? `1.5px solid rgba(${gc}, 0.7)`
      : '1.5px solid rgba(148,163,184,0.1)',
    boxShadow: isActive
      ? `0 0 0 1px rgba(${gc},0.1), 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(${gc},0.35), 0 0 160px rgba(${gc},0.15)`
      : '0 12px 40px rgba(0,0,0,0.5)',
    transition: 'border-color 0.8s ease, box-shadow 0.8s ease',
  };

  return (
    <div
      style={wrapStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={cardStyle}>
        {/* Dynamic color top bar */}
        <div
          style={{
            height: '3px',
            background: isActive
              ? `linear-gradient(90deg, rgba(${gc},0.9), rgba(${gc},0.5))`
              : 'rgba(148,163,184,0.12)',
            transition: 'background 0.8s ease, opacity 0.5s ease',
          }}
        />

        {/* Shine sweep */}
        {isActive && (
          <div
            style={{
              position: 'absolute',
              top: 0, left: '-75%',
              width: '50%', height: '100%',
              background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.06), transparent)',
              transform: 'skewX(-20deg)',
              animation: 'shineSweep 4s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        )}

        {/* Thumbnail */}
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
          <img
            src={project.image}
            alt={project.title}
            crossOrigin="anonymous"
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: isActive && hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          />
          {/* Scrim */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 35%, rgba(8,8,18,0.92) 100%)',
            }}
          />
          {/* Color-tinted vignette overlay (active only) */}
          {isActive && (
            <div
              style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at bottom, rgba(${gc},0.12) 0%, transparent 70%)`,
                transition: 'background 0.8s ease',
                pointerEvents: 'none',
              }}
            />
          )}
          {/* Active badge */}
          {isActive && (project as any).featured && (
            <span
              style={{
                position: 'absolute', top: '12px', left: '12px',
                padding: '4px 10px', borderRadius: '20px',
                background: `rgba(${gc},0.2)`,
                border: `1px solid rgba(${gc},0.5)`,
                color: '#e2e8f0',
                fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.8s ease, border-color 0.8s ease',
              }}
            >
              ✦ Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px 22px 22px' }}>
          <h3
            style={{
              fontSize: '1.05rem', fontWeight: 700,
              color: isActive ? '#e2e8f0' : '#94a3b8',
              marginBottom: '10px', lineHeight: 1.3,
              letterSpacing: '-0.015em', transition: 'color 0.4s ease',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {project.title}
          </h3>
          <p
            style={{
              fontSize: '0.8rem', color: '#64748b', lineHeight: 1.65,
              marginBottom: '18px',
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {project.shortDescription}
          </p>

          {/* Tags */}
          {isActive && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '3px 9px', borderRadius: '12px',
                    background: `rgba(${gc},0.12)`,
                    border: `1px solid rgba(${gc},0.28)`,
                    color: '#cbd5e1',
                    fontSize: '0.68rem', fontWeight: 500,
                    letterSpacing: '0.02em',
                    transition: 'background 0.8s ease, border-color 0.8s ease',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <GhButton href={project.github} glowColor={glowColor} active={isActive} />
            {project.liveDemo && <VisitButton href={project.liveDemo} glowColor={glowColor} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── GitHub button ──────────────────────────────────────────────────────────────
const GhButton = ({ href, glowColor, active }: { href: string; glowColor: RGB; active: boolean }) => {
  const [hov, setHov] = useState(false);
  const gc = rgbStr(glowColor);
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px', borderRadius: '50%',
        background: hov && active ? `rgba(${gc},0.18)` : 'rgba(255,255,255,0.05)',
        border: hov && active ? `1px solid rgba(${gc},0.55)` : '1px solid rgba(255,255,255,0.1)',
        color: hov && active ? '#e2e8f0' : '#64748b',
        transition: 'all 0.25s ease', textDecoration: 'none', flexShrink: 0,
      }}
    >
      <Github size={15} />
    </a>
  );
};

// ─── Visit button ───────────────────────────────────────────────────────────────
const VisitButton = ({ href, glowColor }: { href: string; glowColor: RGB }) => {
  const [hov, setHov] = useState(false);
  const { r, g, b } = glowColor;
  // Lighten slightly on hover
  const lr = Math.min(255, r + 30);
  const lg = Math.min(255, g + 30);
  const lb = Math.min(255, b + 30);
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 18px', borderRadius: '20px',
        background: hov
          ? `linear-gradient(135deg, rgb(${lr},${lg},${lb}), rgb(${Math.min(255,r+50)},${Math.min(255,g+50)},${Math.min(255,b+50)}))`
          : `linear-gradient(135deg, rgb(${r},${g},${b}), rgb(${Math.min(255,r+20)},${Math.min(255,g+20)},${Math.min(255,b+20)}))`,
        color: '#fff', fontSize: '0.76rem', fontWeight: 600,
        textDecoration: 'none', letterSpacing: '0.03em',
        transition: 'all 0.4s ease',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? `0 8px 24px rgba(${r},${g},${b},0.5)` : `0 2px 8px rgba(${r},${g},${b},0.2)`,
        flexShrink: 0,
      }}
    >
      <ExternalLink size={12} />
      Visit
    </a>
  );
};

// ─── Dot nav ────────────────────────────────────────────────────────────────────
const DotNav = ({
  total, active, glowColor, onSelect,
}: {
  total: number; active: number; glowColor: RGB; onSelect: (i: number) => void;
}) => {
  const gc = rgbStr(glowColor);
  return (
    <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to project ${i + 1}`}
          style={{
            width: i === active ? '22px' : '6px',
            height: '6px', borderRadius: '3px',
            background: i === active
              ? `rgba(${gc},1)`
              : 'rgba(148,163,184,0.25)',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: i === active ? `0 0 8px rgba(${gc},0.6)` : 'none',
          }}
        />
      ))}
    </div>
  );
};

// ─── Nav arrow button ────────────────────────────────────────────────────────────
const NavBtn = ({ dir, onClick, glowColor }: { dir: 'left' | 'right'; onClick: () => void; glowColor: RGB }) => {
  const [hov, setHov] = useState(false);
  const gc = rgbStr(glowColor);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      aria-label={dir === 'left' ? 'Previous project' : 'Next project'}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '46px', height: '46px', borderRadius: '50%',
        background: hov ? `rgba(${gc},0.15)` : 'rgba(255,255,255,0.04)',
        border: hov ? `1.5px solid rgba(${gc},0.7)` : '1.5px solid rgba(148,163,184,0.15)',
        color: hov ? '#e2e8f0' : '#64748b',
        cursor: 'pointer', transition: 'all 0.3s ease',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        transform: hov ? (dir === 'left' ? 'translateX(-2px)' : 'translateX(2px)') : 'none',
        boxShadow: hov ? `0 0 16px rgba(${gc},0.3)` : 'none',
      }}
    >
      {dir === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
};

// ─── Main export ───────────────────────────────────────────────────────────────
export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [cardW, setCardW] = useState(360);
  // Dominant color for each project (keyed by image src)
  const colorCache = useRef<Record<string, RGB>>({});
  const [glowColor, setGlowColor] = useState<RGB>({ r: 99, g: 102, b: 241 });
  const [prevGlowColor, setPrevGlowColor] = useState<RGB>({ r: 99, g: 102, b: 241 });

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, active: false });
  const paused = useRef(false);
  const total = projects.length;

  // Responsive card width
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      if (vw < 480) setCardW(Math.min(vw - 40, 300));
      else if (vw < 768) setCardW(320);
      else setCardW(360);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Preload all colors on mount
  useEffect(() => {
    projects.forEach((p) => {
      if (!colorCache.current[p.image]) {
        sampleDominantColor(p.image).then((color) => {
          colorCache.current[p.image] = color;
          // Update if this is the current active card
          setActiveIndex((cur) => {
            if (projects[cur].image === p.image) setGlowColor(color);
            return cur;
          });
        });
      }
    });
  }, []);

  // Update glow color whenever active index changes
  useEffect(() => {
    const img = projects[activeIndex].image;
    if (colorCache.current[img]) {
      setPrevGlowColor(glowColor);
      setGlowColor(colorCache.current[img]);
    } else {
      sampleDominantColor(img).then((color) => {
        colorCache.current[img] = color;
        setPrevGlowColor(glowColor);
        setGlowColor(color);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Carousel stage animation
      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            delay: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (locked) return;
      setLocked(true);
      setActiveIndex(((index % total) + total) % total);
      setTimeout(() => setLocked(false), 680);
    },
    [locked, total]
  );

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [prev, next]);

  // Drag / swipe
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, active: true };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 45) delta < 0 ? next() : prev();
  };

  const gc = rgbStr(glowColor);
  const pgc = rgbStr(prevGlowColor);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        padding: '0px 16px 64px',
        background: 'var(--background)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Dynamic ambient glow — color-matched to active card ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 75% 55% at 50% 40%, rgba(${gc},0.12) 0%, transparent 65%)`,
          transition: 'background 1s ease',
          pointerEvents: 'none',
        }}
      />
      {/* Secondary glow ring */}
      <div
        style={{
          position: 'absolute',
          width: '700px', height: '700px', borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${gc},0.07) 0%, transparent 70%)`,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          filter: 'blur(80px)',
          transition: 'background 1s ease',
          pointerEvents: 'none',
        }}
      />
      {/* Fade-out remnant of previous color (layered behind for smooth blend) */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 75% 55% at 50% 40%, rgba(${pgc},0.04) 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Heading ── */}
      <div
        ref={headingRef}
        style={{
          textAlign: 'center', marginBottom: '64px',
          opacity: 0,
        }}
      >
        <AnimatedText
          text="Projects"
          textClassName="text-white drop-shadow-md"
          underlineClassName="-bottom-4 sm:-bottom-6"
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'var(--foreground, #e6f3ff)',
            textShadow: `0 0 18px rgba(${gc}, 0.2)`,
            lineHeight: 1.1,
          }}
          underlineStyle={{ color: 'white' }}
        />



      </div>

      {/* ── 3-D stage ── */}
      <div
        ref={stageRef}
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: 'relative',
          opacity: 0,
          height: 'clamp(380px, 50vw, 490px)',
          perspective: '1100px', perspectiveOrigin: '50% 40%',
          userSelect: 'none', touchAction: 'pan-y', cursor: 'grab',
        }}
      >
        {projects.map((project, i) => {
          let offset = i - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
          return (
            <CarouselCard
              key={project.title}
              project={project}
              offset={offset}
              cardW={cardW}
              glowColor={glowColor}
              onClick={() => { if (offset !== 0) goTo(i); }}
            />
          );
        })}
      </div>

      {/* ── Navigation row ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '20px', marginTop: '16px',
        }}
      >
        <NavBtn dir="left" onClick={prev} glowColor={glowColor} />
        <DotNav total={total} active={activeIndex} glowColor={glowColor} onSelect={goTo} />
        <NavBtn dir="right" onClick={next} glowColor={glowColor} />
      </div>

      {/* ── Counter label ── */}
      <div style={{ textAlign: 'center', marginTop: '20px', height: '24px', overflow: 'hidden' }}>
        <p
          key={activeIndex}
          style={{
            fontSize: '0.86rem', fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            animation: 'fadeUp 0.4s ease forwards',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <span style={{ color: '#ffffff', transition: 'color 0.8s ease', textShadow: `0 0 12px rgba(${gc}, 0.4)` }}>
            {activeIndex + 1} / {total}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
          <span style={{ color: '#ffffff', textShadow: `0 0 12px rgba(${gc}, 0.4)`, fontWeight: 700 }}>
            {projects[activeIndex].title.split('–')[0].split('—')[0].trim()}
          </span>
        </p>
      </div>

      <p
        style={{
          color: 'var(--muted-foreground)',
          fontSize: '0.88rem', maxWidth: '440px',
          margin: '24px auto 0', lineHeight: 1.65,
          textAlign: 'center', opacity: 0.8
        }}
        className="animate-pulse duration-1000"
      >
        Drag, swipe, or use arrow keys to explore my work.
      </p>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shineSweep {
          0%   { left: -75%; opacity:1; }
          45%  { left: 125%; opacity:1; }
          100% { left: 125%; opacity:0; }
        }
      `}</style>
    </section>
  );
}
