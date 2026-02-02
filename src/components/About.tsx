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

      // Animated underline
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: lineRef.current,
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

      // Parallax text movement on scroll
      gsap.to(headingRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: -50,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const marqueeText = "Creative Developer • Full Stack Engineer • Problem Solver • UI/UX Enthusiast • ";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative overflow-hidden"
    >
      {/* Marquee Background */}
      <div className="absolute top-10 left-0 right-0 overflow-hidden opacity-5">
        <div ref={marqueeRef} className="flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-8xl font-bold text-white mx-4">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            ref={headingRef}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Me</span>
          </h2>
          <div
            ref={lineRef}
            className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 mx-auto origin-left"
          ></div>
        </div>

        <div ref={paragraphsRef} className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xl text-zinc-300 leading-relaxed">
            I'm a <span className="text-cyan-400 font-semibold">Computer Science and Engineering</span> student at Dayananda Sagar College of Engineering,
            Bengaluru, specializing in Data Science. Currently in my undergraduate journey (2023-2027),
            I'm passionate about building <span className="text-violet-400 font-semibold">full-stack web applications</span> and exploring machine learning.
          </p>
          <p className="text-xl text-zinc-300 leading-relaxed">
            My work spans from developing secure enterprise solutions like data wiping systems with
            <span className="text-cyan-400 font-semibold"> DoD-compliant algorithms</span>, to creating interactive ML applications with TensorFlow and Streamlit.
            I enjoy working with modern tech stacks including <span className="text-violet-400 font-semibold">React, Node.js, PostgreSQL, and Python</span>.
          </p>
          <p className="text-xl text-zinc-300 leading-relaxed">
            When I'm not coding, you'll find me diving into new technologies, working on personal projects,
            or exploring the intersection of <span className="text-cyan-400 font-semibold">data science and web development</span>. I'm always excited to
            collaborate on challenging projects that make a real impact.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { number: '10+', label: 'Projects Completed' },
            { number: '5+', label: 'Technologies Mastered' },
            { number: '2+', label: 'Years Experience' },
            { number: '∞', label: 'Lines of Code' },
          ].map((stat, index) => (
            <div
              key={index}
              className="group relative p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center hover:border-zinc-700 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-zinc-400 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
