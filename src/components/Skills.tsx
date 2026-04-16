import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillLogos, invertInDark } from '../data/skillsData';

gsap.registerPlugin(ScrollTrigger);

type SkillSubSection = {
  label: string;
  skills: string[];
};

type SkillSection = {
  id: string;
  title: string;
  from: string;
  to: string;
  colSpan: string;
  singleRow?: boolean;
  subSections?: SkillSubSection[];
  skills?: string[];
};

const sections: SkillSection[] = [
  {
    id: 'fullstack',
    title: 'Full-Stack Development',
    from: '#06b6d4',
    to: '#3b82f6',
    colSpan: 'md:col-span-3 order-1 md:order-1',
    subSections: [
      { label: 'Languages', skills: ['Python', 'C++', 'JavaScript', 'TypeScript', 'SQL'] },
      { label: 'Frontend', skills: ['React', 'HTML', 'CSS', 'Tailwind CSS', 'Figma'] },
      { label: 'Backend', skills: ['Node.js', 'Express', 'FastAPI', 'Postman'] },
    ],
  },
  {
    id: 'aiml',
    title: 'AI ML & Data Science',
    from: '#0ea5e9',
    to: '#14b8a6',
    colSpan: 'md:col-span-2 order-3 md:order-2',
    subSections: [
      { label: 'Machine Learning', skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost'] },
      { label: 'Analytics', skills: ['R', 'Pandas', 'NumPy', 'Airflow', 'Snowflake'] },
      { label: 'Visualization', skills: ['Matplotlib', 'Seaborn', 'Power BI', 'Tableau'] },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'Supabase', 'MySQL', 'Prisma'],
    from: '#0ea5e9',
    to: '#14b8a6',
    colSpan: 'md:col-span-2 order-2 md:order-3',
    singleRow: true,
  },
  {
    id: 'tools',
    title: 'Tools & DevOps',
    skills: ['Git', 'Docker', 'Linux', 'AWS', 'Azure', 'dbt'],
    from: '#0ea5e9',
    to: '#10b981',
    colSpan: 'md:col-span-3 order-4 md:order-4',
    singleRow: true,
  },
];

const SkillChip = ({ skill, accentColor }: { skill: string; accentColor?: string }) => {
  const logo = skillLogos[skill];
  const needsInvert = invertInDark.has(skill);
  return (
    <div
      className="flex shrink-0 items-center gap-2 px-3.5 py-2 rounded-xl mx-1.5
        bg-background/70 dark:bg-white/[0.05] border border-border/50
        hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none"
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
        <img
          src={logo}
          alt={skill}
          loading="lazy"
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
  <div className="overflow-hidden w-full">
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

const SkillsCard = ({ section }: { section: SkillSection }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const pauseMarquees = (paused: boolean) => {
    cardRef.current?.querySelectorAll<HTMLElement>('.marquee-row').forEach(el => {
      el.style.animationPlayState = paused ? 'paused' : 'running';
    });
  };

  const row1 = section.singleRow
    ? section.skills ?? []
    : (section.skills ?? []).filter((_, i) => i % 2 === 0);

  const row2 = section.singleRow
    ? []
    : (section.skills ?? []).filter((_, i) => i % 2 === 1);

  const baseDuration = 18 + (section.skills?.length ?? 0) * 2;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => pauseMarquees(true)}
      onMouseLeave={() => pauseMarquees(false)}
      onMouseMove={() => {
        if (cardRef.current) {
          cardRef.current.style.boxShadow = `0 8px 48px ${section.from}22, 0 0 0 1px ${section.from}30`;
        }
      }}
      onMouseOut={() => {
        if (cardRef.current) cardRef.current.style.boxShadow = 'none';
      }}
      className={`bento-card relative flex flex-col gap-5 overflow-hidden rounded-3xl p-6 sm:p-7
        bg-card/60 dark:bg-white/[0.025] border border-border/60 backdrop-blur-xl
        hover:border-white/20 transition-all duration-500 ${section.colSpan}`}
      style={{ transition: 'box-shadow 0.5s ease, border-color 0.4s ease' }}
    >
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold leading-tight text-cyan-600 dark:text-cyan-400">
            {section.title}
          </h3>
        </div>
      </div>

      {section.subSections ? (
        <div className="flex flex-col gap-5 relative z-10">
          {section.subSections.map((sub, i) => (
            <div key={sub.label} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {sub.label}
                </span>
                <div className="flex-1 h-px bg-border/30" />
              </div>
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
      ) : (
        <div className="flex flex-col gap-3 relative z-10 -mx-2">
          <MarqueeRow skills={row1} duration={baseDuration} accentColor={section.from} />
          {!section.singleRow && row2.length > 0 && (
            <MarqueeRow skills={row2} duration={baseDuration + 4} reverse accentColor={section.to} />
          )}
        </div>
      )}
    </div>
  );
};

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 95%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(
        '.bento-card',
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          delay: 0.15,
          stagger: 0.1,
          ease: 'power3.out',
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
      <div className="max-w-6xl mx-auto relative z-10">
        <style>{`
          @keyframes bm-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-33.333% - 6px)); }
          }
        `}</style>

        <div ref={headingRef} className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6">
            Technical <span className="text-cyan-500 dark:text-cyan-400">Skills</span>
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-cyan-500 mx-auto mb-4 sm:mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg mb-8">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 sm:gap-6">
          {sections.map(section => (
            <SkillsCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </section>
  );
}
