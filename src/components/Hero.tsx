import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Download, Mail, Zap } from 'lucide-react';
import { personalInfo, floatingIcons, socialLinks } from '../data';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const floatingIconsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([headingRef.current, subtitleRef.current, descriptionRef.current, buttonsRef.current, socialsRef.current], {
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
        .to(headingRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
        }, '-=0.4')
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, '-=0.4')
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

      // Floating icons animation
      if (floatingIconsRef.current) {
        const icons = floatingIconsRef.current.querySelectorAll('.floating-icon');
        icons.forEach((icon, i) => {
          gsap.to(icon, {
            y: 'random(-30, 30)',
            x: 'random(-20, 20)',
            rotation: 'random(-15, 15)',
            duration: 'random(3, 5)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2,
          });
        });
      }

      // Parallax effect on scroll
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 200,
        opacity: 0.3,
      });

      // Text character animation for heading
      if (headingRef.current) {
        const chars = headingRef.current.textContent?.split('') || [];
        headingRef.current.innerHTML = chars
          .map((char, i) =>
            `<span class="char" style="display: inline-block; animation-delay: ${i * 0.03}s">${char === ' ' ? '&nbsp;' : char}</span>`
          )
          .join('');

        const charElements = headingRef.current.querySelectorAll('.char');
        gsap.fromTo(charElements,
          { y: 100, opacity: 0, rotateX: -90 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: 'back.out(1.7)',
            delay: 0.5,
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 relative overflow-hidden bg-black"
    >
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Animated Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating Icons */}
      <div ref={floatingIconsRef} className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            className="floating-icon absolute hidden lg:block opacity-20"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
            }}
          >
            <item.Icon size={item.size} className="text-white" />
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Profile Picture - Always colorful, no rotation */}
        <div
          ref={profileRef}
          className="mb-8 flex justify-center"
        >
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-white/10 ring-4 ring-black shadow-2xl">
              <img
                src="/profile.jpg"
                alt={personalInfo.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400';
                }}
              />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1
          ref={headingRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading text-white mb-6 tracking-tight"
        >
          {personalInfo.name}
        </h1>

        <span
          ref={subtitleRef}
          className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-sm sm:text-base font-medium backdrop-blur-sm mb-8"
        >
          {personalInfo.title}
        </span>

        <p
          ref={descriptionRef}
          className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {personalInfo.description}
        </p>

        {/* Buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Button
            onClick={() => scrollToSection('projects')}
            className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-base font-semibold rounded-full transition-all hover:scale-105"
          >
            <Zap className="w-5 h-5 mr-2" />
            View Work
          </Button>

          <Button
            variant="outline"
            asChild
            className="bg-black/50 border-zinc-800 text-white hover:bg-zinc-900 hover:text-white px-8 py-6 text-base font-semibold rounded-full transition-all hover:scale-105 backdrop-blur-sm"
          >
            <a href={personalInfo.resume} download>
              <Download className="w-5 h-5 mr-2" />
              Resume
            </a>
          </Button>

          <Button
            variant="outline"
            onClick={() => scrollToSection('contact')}
            className="bg-black/50 border-zinc-800 text-white hover:bg-zinc-900 hover:text-white px-8 py-6 text-base font-semibold rounded-full transition-all hover:scale-105 backdrop-blur-sm"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact
          </Button>
        </div>

        {/* Social Links */}
        <div
          ref={socialsRef}
          className="flex items-center justify-center gap-4"
        >
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target={social.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
            >
              <social.Icon className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
