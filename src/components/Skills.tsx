import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillLogos, invertInDark } from '../data/skillsData';

gsap.registerPlugin(ScrollTrigger);

// Hero sections have labelled sub-sections
const heroSections = [
  {
    id: 'fullstack',
    title: 'Full-Stack Development',
    from: '#06b6d4', to: '#6366f1',
    colSpan: 'md:col-span-3 order-1 md:order-1',
    subSections: [
      { label: 'Languages', skills: ['Python', 'C++', 'JavaScript', 'TypeScript', 'SQL'] },
      { label: 'Frontend', skills: ['React', 'HTML', 'CSS', 'Tailwind CSS', 'Figma'] },
      { label: 'Backend', skills: ['Node.js', 'Express', 'FastAPI', 'Postman'] },
    ]
  },
  {
    id: 'aiml',
    title: 'AI ML & Data Science',
    from: '#8b5cf6', to: '#ec4899',
    colSpan: 'md:col-span-2 order-3 md:order-2',
    subSections: [
      { label: 'Machine Learning', skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost'] },
      { label: 'Analytics', skills: ['R', 'Pandas', 'NumPy', 'Airflow', 'Snowflake'] },
      { label: 'Visualization', skills: ['Matplotlib', 'Seaborn', 'Power BI', 'Tableau'] },
    ]
  }
];

const otherSections = [
  {
    id: 'databases',
    title: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'Supabase', 'MySQL', 'Prisma'],
    from: '#f43f5e', to: '#a855f7',
    glow: 'rgba(244,63,94,0.15)',
    colSpan: 'md:col-span-2 order-2 md:order-3',
    singleRow: true,
  },
  {
    id: 'tools',
    title: 'Tools & DevOps',
    skills: ['Git', 'Docker', 'Linux', 'AWS', 'Azure', 'dbt'],
    from: '#0ea5e9', to: '#10b981',
    glow: 'rgba(14,165,233,0.15)',
    colSpan: 'md:col-span-3 order-4 md:order-4',
    singleRow: true,
  },
];

// ─── Skill Chip ───────────────────────────────────────────────────────────────
const SkillChip = ({ skill, accentColor }: { skill: string; accentColor?: string }) => {
  const logo = skillLogos[skill];
  const needsInvert = invertInDark.has(skill);
  return (
    <div
      className="flex shrink-0 items-center gap-2 px-3.5 py-2 rounded-xl mx-1.5
        bg-background/70 dark:bg-white/[0.05] border border-border/50
        hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none"
      style={{ ['--accent' as string]: accentColor ?? '#06b6d4' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${accentColor ?? '#06b6d4'}60`;
        (e.currentTarget as HTMLElement).style.background = `${accentColor ?? '#06b6d4'}12`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '';
        (e.currentTarget as HTMLElement).style.background = '';
      }}
    >
      {logo ? (
        <img src={logo} alt={skill} loading="lazy"
          className={`w-5 h-5 object-contain shrink-0 ${needsInvert ? 'dark:invert dark:brightness-75' : ''}`}
        />
      ) : (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-cyan-500/20 text-cyan-400 text-[10px] font-bold shrink-0">
          {skill.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">{skill}</span>
    </div>
  );
};

// ─── Single marquee row ───────────────────────────────────────────────────────
const MarqueeRow = ({
  skills,
  duration,
  reverse = false,
  accentColor,
}: {
  skills: string[];
  duration: number;
  reverse?: boolean;
  accentColor?: string;
}) => (
  <div
    className="overflow-hidden w-full"
    style={{
      maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
    }}
  >
    <div
      className="marquee-row flex w-max"
      style={{ animation: `bm-scroll ${duration}s linear infinite ${reverse ? 'reverse' : 'normal'}` }}
    >
      {[...skills, ...skills, ...skills].map((skill, i) => (
        <SkillChip key={`${skill}-${i}`} skill={skill} accentColor={accentColor} />
      ))}
    </div>
  </div>
);

// ─── Hero Card (for multi-section categories) ──────────────────────────────────
const HeroCard = ({ section }: { section: typeof heroSections[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const pauseMarquees = (paused: boolean) => {
    cardRef.current?.querySelectorAll<HTMLElement>('.marquee-row').forEach(el => {
      el.style.animationPlayState = paused ? 'paused' : 'running';
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => pauseMarquees(true)}
      onMouseLeave={() => pauseMarquees(false)}
      onMouseMove={() => {
        if (cardRef.current)
          cardRef.current.style.boxShadow = `0 8px 48px ${section.from}28, 0 0 0 1px ${section.from}38`;
      }}
      onMouseOut={() => { if (cardRef.current) cardRef.current.style.boxShadow = 'none'; }}
      className={`bento-card group relative flex flex-col gap-6 overflow-hidden rounded-3xl p-6 sm:p-8
        bg-card/60 dark:bg-white/[0.025] border border-border/60 backdrop-blur-xl
        hover:border-white/20 transition-all duration-500 ${section.colSpan}`}
      style={{ transition: 'box-shadow 0.5s ease, border-color 0.4s ease' }}
    >
      {/* Glows */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${section.from}, transparent 70%)` }} />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${section.to}, transparent 70%)` }} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold leading-tight text-cyan-600 dark:text-cyan-400">
            {section.title}
          </h3>
        </div>
      </div>

      {/* Sub-sections with labelled marquees */}
      <div className="flex flex-col gap-5 relative z-10">
        {section.subSections.map((sub, i) => (
          <div key={sub.label} className="flex flex-col gap-2">
            {/* Sub-label */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">{sub.label}</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
            {/* Single marquee row per sub-section */}
            <div className="-mx-2">
              <MarqueeRow
                skills={sub.skills}
                duration={16 + sub.skills.length * 2}
                reverse={i % 2 !== 0}
                accentColor={section.from}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Generic Bento Card ───────────────────────────────────────────────────────
const BentoCard = ({ section }: { section: typeof otherSections[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const row1 = section.singleRow ? section.skills : section.skills.filter((_, i) => i % 2 === 0);
  const row2 = section.singleRow ? [] : section.skills.filter((_, i) => i % 2 === 1);
  const baseDuration = 18 + section.skills.length * 2;

  const pauseMarquees = (paused: boolean) => {
    cardRef.current?.querySelectorAll<HTMLElement>('.marquee-row').forEach(el => {
      el.style.animationPlayState = paused ? 'paused' : 'running';
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => pauseMarquees(true)}
      onMouseLeave={() => pauseMarquees(false)}
      onMouseMove={() => {
        if (cardRef.current)
          cardRef.current.style.boxShadow = `0 8px 48px ${section.glow}, 0 0 0 1px ${section.from}28`;
      }}
      onMouseOut={() => { if (cardRef.current) cardRef.current.style.boxShadow = 'none'; }}
      className={`bento-card group relative flex flex-col gap-5 overflow-hidden rounded-3xl p-6 sm:p-7
        bg-card/60 dark:bg-white/[0.025] border border-border/60 backdrop-blur-xl
        hover:border-white/20 transition-all duration-500 ${section.colSpan}`}
      style={{ transition: 'box-shadow 0.5s ease, border-color 0.4s ease' }}
    >
      {/* Gradient orb */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-[0.18] blur-3xl pointer-events-none group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${section.from}, transparent 70%)` }} />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${section.to}, transparent 70%)` }} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold leading-tight text-cyan-600 dark:text-cyan-400">
            {section.title}
          </h3>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="flex flex-col gap-3 relative z-10 -mx-2">
        <MarqueeRow skills={row1} duration={baseDuration} accentColor={section.from} />
        {!section.singleRow && row2.length > 0 && (
          <MarqueeRow skills={row2} duration={baseDuration + 4} reverse accentColor={section.to} />
        )}
      </div>
    </div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-in animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 95%', toggleActions: 'play none none reverse' },
        }
      );

      // Bento cards stagger
      gsap.fromTo(
        '.bento-card',
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.65, delay: 0.15, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden [overflow-x:hidden]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06),transparent_60%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <style>{`
          @keyframes bm-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-33.333% - 6px)); }
          }
        `}</style>

        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0C6B84] to-violet-400 dark:from-cyan-400 dark:to-violet-400">
              Skills
            </span>
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#0C6B84] to-violet-500 dark:from-cyan-500 dark:to-violet-500 mx-auto mb-4 sm:mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg mb-8">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* 
          5-column grid layout for perfectly symmetrical 60/40 widths:
          Row 1 → Full-Stack (60%)  |  AI/ML (40%)
          Row 2 → Databases (40%)   |  Tools & DevOps (60%)
        */}
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 sm:gap-6">
          {heroSections.map(section => (
            <HeroCard key={section.id} section={section} />
          ))}
          {otherSections.map(section => (
            <BentoCard key={section.id} section={section} />
          ))}
        </div>

      </div>
    </section>
  );
}
