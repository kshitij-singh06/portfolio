import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projects } from '../data';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { y: 100, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
      });

      const cards = cardsRef.current?.querySelectorAll('.project-card');
      if (cards) {
        cards.forEach((card, i) => {
          gsap.fromTo(card, { y: 100, opacity: 0, rotateX: 10 }, {
            y: 0, opacity: 1, rotateX: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
          });

          const el = card as HTMLElement;
          el.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const rotateX = (e.clientY - rect.top - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 20;
            gsap.to(card, { rotateX, rotateY, scale: 1.02, duration: 0.3, ease: 'power2.out' });
          });
          el.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
          });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_50%)]"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 mx-auto mb-6"></div>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-8" style={{ perspective: '1000px' }}>
          {projects.map((project, index) => (
            <Card key={index} className="project-card group h-full flex flex-col bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 transition-all duration-500 overflow-hidden relative" style={{ transformStyle: 'preserve-3d' }}>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"></div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{project.title}</CardTitle>
                  <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
                <CardDescription className="text-zinc-400 min-h-[80px] mt-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-zinc-800 text-zinc-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">{tag}</Badge>
                  ))}
                </div>
                <div className="flex gap-3 mt-auto">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-white hover:text-black transition-all">
                    <a href={project.github} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4 mr-2" />Code</a>
                  </Button>
                  {project.liveDemo && (
                    <Button variant="outline" size="sm" asChild className="flex-1 bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-cyan-500 hover:text-black transition-all">
                      <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" />Demo</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
