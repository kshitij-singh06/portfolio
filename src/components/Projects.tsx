import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projects } from '../data';

gsap.registerPlugin(ScrollTrigger);

const INITIAL_COUNT = 4;

export default function Projects() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);
  const extraWrap   = useRef<HTMLDivElement>(null);  // always in DOM, height animated
  const [showAll, setShowAll] = useState(false);

  /** Attach 3-D tilt on hover */
  const attachTilt = (card: Element) => {
    const el = card as HTMLElement;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        rotateX: (e.clientY - r.top  - r.height / 2) / 20,
        rotateY: (r.width  / 2 - (e.clientX - r.left)) / 20,
        scale: 1.02, duration: 0.3, ease: 'power2.out',
      });
    };
    const onLeave = () => gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  };

  /* ── Initial GSAP setup ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading fade-in
      gsap.fromTo(headingRef.current, { y: 100, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
      });

      // Initial cards
      const cards = cardsRef.current?.querySelectorAll('.project-card');
      cards?.forEach((card, i) => {
        gsap.fromTo(card, { y: 100, opacity: 0, rotateX: 10 }, {
          y: 0, opacity: 1, rotateX: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
        });
        attachTilt(card);
      });

      // Extra cards wrapper: start with height 0, overflow hidden
      gsap.set(extraWrap.current, { height: 0, overflow: 'hidden', opacity: 0 });

      // Tilt on extra cards (they're always in the DOM)
      const extras = extraWrap.current?.querySelectorAll('.project-card');
      extras?.forEach(attachTilt);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Expand / Collapse animation ── */
  useEffect(() => {
    const wrap = extraWrap.current;
    if (!wrap) return;

    if (showAll) {
      // Measure natural height, then animate to it
      gsap.set(wrap, { height: 'auto', opacity: 1 });
      const fullH = wrap.scrollHeight;
      gsap.fromTo(wrap,
        { height: 0, opacity: 0 },
        { height: fullH, opacity: 1, duration: 0.55, ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(wrap, { height: 'auto' }); // let it resize naturally after
            ScrollTrigger.refresh();
          },
        }
      );

      // Stagger-animate the extra cards themselves
      const cards = wrap.querySelectorAll('.project-card');
      gsap.fromTo(cards,
        { y: 60, opacity: 0, rotateX: 10 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out', delay: 0.15 }
      );
    } else {
      // Collapse: animate height back to 0
      const curH = wrap.scrollHeight;
      gsap.fromTo(wrap,
        { height: curH, opacity: 1 },
        {
          height: 0, opacity: 0, duration: 0.45, ease: 'power3.inOut',
          onComplete: () => {
            // Scroll back so the "View More" button stays in view
            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            ScrollTrigger.refresh();
          },
        }
      );
    }
  }, [showAll]);

  /* ── Card renderer ── */
  const ProjectCard = ({ project }: { project: typeof projects[0] }) => (
    <Card
      className="project-card group h-full flex flex-col bg-card border-border hover:border-primary/20 transition-all duration-500 overflow-hidden relative"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl font-bold text-foreground group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
            {project.title}
          </CardTitle>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-cyan-500 dark:group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0 ml-2" />
        </div>
        <CardDescription className="text-muted-foreground min-h-[80px] mt-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-border text-muted-foreground hover:border-cyan-500/50 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-3 mt-auto">
          <Button variant="outline" size="sm" asChild className="flex-1 bg-background border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />Code
            </a>
          </Button>
          {project.liveDemo && (
            <Button variant="outline" size="sm" asChild className="flex-1 bg-background border-border text-muted-foreground hover:bg-cyan-500 hover:text-white dark:hover:text-black transition-all">
              <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />Demo
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const hiddenCount = projects.length - INITIAL_COUNT;

  return (
    <section id="projects" ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_50%)]" />
      <div className="max-w-6xl mx-auto relative z-10">

        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 mx-auto mb-6" />
        </div>

        {/* Always-visible initial cards */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-8" style={{ perspective: '1000px' }}>
          {projects.slice(0, INITIAL_COUNT).map((p) => <ProjectCard key={p.title} project={p} />)}
        </div>

        {/* Extra cards — always in DOM, height animated by GSAP */}
        <div ref={extraWrap}>
          <div className="grid md:grid-cols-2 gap-8 mt-8" style={{ perspective: '1000px' }}>
            {projects.slice(INITIAL_COUNT).map((p) => <ProjectCard key={p.title} project={p} />)}
          </div>
        </div>

        {/* Toggle button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setShowAll(v => !v)}
            className="group relative flex items-center gap-2 px-8 py-3 rounded-full border border-border bg-background text-muted-foreground font-medium text-sm transition-all duration-300 hover:border-cyan-500/60 hover:text-cyan-500 dark:hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/0 to-violet-500/0 group-hover:from-cyan-500/5 group-hover:to-violet-500/5 transition-all duration-300" />
            {showAll ? (
              <><ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />Show Less</>
            ) : (
              <><ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />View {hiddenCount} More Projects</>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
