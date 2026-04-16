import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
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

      // Paragraphs stagger animation
      const paragraphs = paragraphsRef.current?.querySelectorAll('p');
      if (paragraphs) {
        gsap.fromTo(
          paragraphs,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: paragraphsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Visual side panel animation
      if (visualRef.current) {
        gsap.fromTo(
          visualRef.current,
          { x: 40, opacity: 0, scale: 0.95 },
          {
            x: 0, opacity: 1, scale: 1, duration: 1, delay: 0.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: visualRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-background relative"
    >
      <div className="w-[90%] max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div ref={headingRef} className="mb-12 lg:mb-16 flex flex-col items-center text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0C6B84] to-sky-400 dark:from-cyan-400 dark:to-blue-400">
              Me
            </span>
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#0C6B84] to-sky-500 dark:from-cyan-500 dark:to-blue-500" />
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 md:gap-16 items-center">
          
          {/* Left Column: Clean Text Content */}
          <div className="md:pr-4">
            <div ref={paragraphsRef} className="space-y-6 md:space-y-7">
              <p className="text-base sm:text-lg md:text-[1.1rem] text-foreground/90 tracking-[0.01em] leading-[1.8] font-light">
                I'm a <strong className="font-semibold text-foreground">Computer Science & Engineering</strong> student at Dayananda Sagar College of Engineering, Bengaluru, currently pursuing my undergraduate degree (2023–2027) with a specialization in <strong className="font-semibold text-cyan-400">Data Science</strong>. I'm passionate about building things that bring together full-stack development, machine learning, and cybersecurity.
              </p>
              <p className="text-base sm:text-lg md:text-[1.1rem] text-foreground/80 tracking-[0.01em] leading-[1.8] font-light">
                I like turning problems into clean, scalable solutions—whether that means architecting <strong className="font-semibold text-cyan-400">backend systemsand APIs </strong> , building polished and intuitive frontend interfaces, or working on <strong className="font-semibold text-cyan-400">machine learning models. </strong>I’m comfortable across the full stack and always eager to learn, build, and push my skills further.
              </p>
            </div>
          </div>

        {/* Right Column: Visual Element */}
        <div ref={visualRef} className="relative w-full flex items-center justify-center">
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-sky-500/20 rounded-full blur-[80px]" />
          
          {/* Code/Terminal Abstract Window */}
          <div className="relative w-full max-w-[500px] bg-card/40 dark:bg-white/[0.02] border border-border/50 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col text-sm md:text-[0.95rem] leading-relaxed">
            <div className="flex items-center px-4 py-3 border-b border-border/50 bg-black/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>
            
            <div className="p-6 md:p-8 font-mono text-muted-foreground flex-1 flex items-center">
               <div className="w-full space-y-2.5">
                 <div className="flex">
                   <span><span className="text-cyan-400">const</span> <span className="text-foreground">developer</span> = {'{'}</span>
                 </div>
                 <div className="flex">
                   <span className="ml-4">name: <span className="text-green-400">'Kshitij Singh'</span>,</span>
                 </div>
                 <div className="flex">
                   <span className="ml-4">role: <span className="text-green-400">'Full Stack Developer'</span>,</span>
                 </div>
                 <div className="flex">
                   <span className="ml-4">focus: <span className="text-green-400">'["ML", "Cybersecurity", "Data Science"]'</span>,</span>
                 </div>
                 <div className="flex">
                   <span className="ml-4">location: <span className="text-green-400">'Bengaluru, India'</span>,</span>
                 </div>
                 <div className="flex">
                   <span className="ml-4">mindset: <span className="text-green-400">'Break. Learn. Build.'</span></span>
                 </div>
                 <div className="flex">
                   <span>{'}'};</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        </div> {/* Close grid container */}
      </div>   {/* Close w-[90%] wrapper */}
    </section>
  );
}
