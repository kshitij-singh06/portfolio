import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
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
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animated underline — triggers off the heading so it always appears after the heading has started animating in (0.5s delay).
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          delay: 0.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Paragraphs stagger animation
      const paragraphs = paragraphsRef.current?.querySelectorAll('p');
      if (paragraphs) {
        gsap.fromTo(
          paragraphs,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: paragraphsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Infinite marquee scroll
      if (marqueeRef.current) {
        const marquee = marqueeRef.current;
        gsap.to(marquee, {
          x: `-50%`,
          duration: 20,
          ease: 'none',
          repeat: -1,
        });
      }


    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const marqueeText = "Full Stack Developer • Data Science • Cybersecurity • Machine Learning • Problem Solver";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
    >
      {/* Marquee Background — z-0, behind everything */}
      <div className="absolute top-10 left-0 right-0 overflow-hidden opacity-[0.12] dark:opacity-[0.1] z-0 pointer-events-none select-none">
        <div ref={marqueeRef} className="flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-500 to-violet-600 mx-2">
                {marqueeText}
              </span>
              <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 mx-4 shrink-0 opacity-80" />
            </span>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading + bar */}
        <div className="relative z-10 text-center mb-16 mt-10">
          <h2
            ref={headingRef}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-4"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Me</span>
          </h2>
          <div
            ref={lineRef}
            className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 mx-auto origin-left"
          />
        </div>

        <div ref={paragraphsRef} className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-left md:text-center">
            I'm a <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Computer Science & Engineering</span> student
            at Dayananda Sagar College of Engineering, Bengaluru, specializing in <span className="text-violet-600 dark:text-violet-400 font-semibold">Data Science</span>.
            Currently on my undergraduate journey (2023–2027), I'm passionate about building things
            at the intersection of full-stack development, machine learning, and cybersecurity.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-left md:text-center">
            I enjoy turning complex problems into clean, scalable solutions, whether that's
            architecting <span className="text-cyan-600 dark:text-cyan-400 font-semibold">backend systems and APIs</span>, crafting
            polished frontends, or training and deploying <span className="text-violet-600 dark:text-violet-400 font-semibold">machine learning models</span>.
            I'm comfortable across the full stack and always looking to push the boundaries of what I can build.
          </p>
          
        </div>

      </div>
    </section>
  );
}
