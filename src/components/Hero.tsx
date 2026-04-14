import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Download, FolderOpen } from 'lucide-react';
import { personalInfo, socialLinks } from '../data';
import SmokeBackground from './SmokeBackground';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  // Typewriter effect state
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, buttonsRef.current, socialsRef.current], {
        opacity: 0,
        y: 100,
      });
      gsap.set(profileRef.current, { opacity: 0, scale: 0.5 });

      // Master timeline for hero entrance
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Profile picture entrance (no rotation)
      tl.to(profileRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      })
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, '-=0.4')
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, '-=0.6')
        .to(descriptionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, '-=0.4')
        .to(buttonsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, '-=0.3')
        .to(socialsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
        }, '-=0.2');


    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Typewriter effect
  useEffect(() => {
    const title = personalInfo.title;
    let currentIndex = 0;

    // Start typing after a delay (after other animations)
    const startDelay = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (currentIndex <= title.length) {
          setDisplayedTitle(title.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 80); // Speed of typing

      return () => clearInterval(typingInterval);
    }, 1500); // Delay before starting

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearTimeout(startDelay);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-6 sm:px-10 lg:px-16 pt-16 pb-8 relative overflow-hidden bg-background"
    >
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-55">
        <SmokeBackground smokeColor="#3b82f6" className="w-full h-full block" />
      </div>

      {/* Dark mode: Reverted to original background layout */}
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-background/80 via-background/65 to-background/75 pointer-events-none" />
      
      {/* Light mode: Clean background with subtle blue gradient */}
      <div className="absolute inset-0 dark:hidden bg-background/70 pointer-events-none" />
      <div className="absolute inset-0 dark:hidden bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/40 pointer-events-none mix-blend-overlay" />

      <div className="max-w-[1100px] mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 dark:from-cyan-400 dark:to-violet-500 mb-6 drop-shadow-sm leading-tight transition-all duration-700 ease-out"
          >
            {personalInfo.name}
          </h1>

          <span
            ref={subtitleRef}
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-border bg-muted/30 text-muted-foreground text-sm font-medium backdrop-blur-sm mb-4 justify-center lg:justify-start"
          >
            {displayedTitle}
            <span
              className={`ml-0.5 w-0.5 h-4 bg-cyan-400 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
            />
          </span>

          <p
            ref={descriptionRef}
            className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            {personalInfo.description}
          </p>

          {/* Buttons + Socials — single row */}
          <div
            ref={buttonsRef}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
          >
            {/* PRIMARY */}
            <Button
              onClick={() => scrollToSection('projects')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-7 py-5 text-sm font-semibold rounded-full transition-all hover:scale-105 shadow-lg shadow-primary/20"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              View Work
            </Button>

            {/* SECONDARY */}
            <Button
              variant="outline"
              asChild
              className="border-cyan-500/50 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-500/80 px-7 py-5 text-sm font-semibold rounded-full transition-all hover:scale-105 backdrop-blur-sm"
            >
              <a href={personalInfo.resume} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Resume
              </a>
            </Button>

            {/* Divider */}
            <span className="hidden lg:block w-px h-8 bg-border mx-1" />

            {/* Social Icons — inline with buttons */}
            <div ref={socialsRef} className="flex items-center gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target={social.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="p-2.5 bg-muted/30 border border-border rounded-xl hover:bg-muted/50 hover:border-primary/20 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                >
                  <social.Icon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Profile & Floats */}
        <div className="flex flex-col items-center justify-center relative order-1 lg:order-2">
          <div ref={profileRef} className="relative">
            {/* Profile Picture */}
            <div className="relative group cursor-pointer z-10">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-300"></div>
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-border ring-[6px] ring-background shadow-2xl">
                <img
                  src="/profile.webp"
                  alt={personalInfo.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400';
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
