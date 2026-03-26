import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import { skillCategories } from '../data';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading slide-up animation (same as About & Projects)
      gsap.fromTo(
        headingRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation (same pattern as Projects)
      const cards = cardsRef.current?.querySelectorAll('.skill-card');
      if (cards) {
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: i * 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden"
    >
      {/* Radial gradient background — same as Projects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06),transparent_60%)]" />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section heading — same style as About & Projects */}
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Technical{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              Skills
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 mx-auto mb-6" />
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Skills grid — card style matching Projects */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="skill-card group relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 overflow-hidden transition-all duration-500 hover:border-zinc-600 hover:-translate-y-1"
              >
                {/* Top accent line on hover — same as Projects cards */}
                <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500" />

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-zinc-800/80 border border-zinc-700 mb-4 group-hover:border-cyan-500/40 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400 transition-colors duration-300" />
                </div>

                {/* Category title */}
                <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {category.title}
                </h3>

                {/* Skill badges — same as Projects badges */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-zinc-800 text-zinc-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
