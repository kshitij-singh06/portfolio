import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import { Mail, MapPin, Send, Loader2, CheckCircle2, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { socialLinks, personalInfo } from '../data';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { y: 100, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
      });

      gsap.fromTo(leftRef.current, { x: -100, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: leftRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });

      gsap.fromTo(rightRef.current, { x: 100, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: rightRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });

      const contactItems = leftRef.current?.querySelectorAll('.contact-item');
      if (contactItems) {
        gsap.fromTo(contactItems, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitStatus('success');
      formRef.current.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 dark:from-cyan-400 to-violet-600 dark:to-violet-400">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 dark:from-cyan-500 to-violet-600 dark:to-violet-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div ref={leftRef}>
            {/* Availability badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-600/15 dark:bg-green-500/10 border border-green-600/40 dark:border-green-500/30 text-green-700 dark:text-green-400 text-sm font-medium mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Open to internships &amp; freelance opportunities
            </div>

            <h3 className="text-3xl font-bold text-foreground dark:text-foreground mb-6">Let's Connect</h3>
            <p className="text-lg text-foreground/70 dark:text-muted-foreground mb-8">I'm always open to new opportunities, collaborations, and interesting projects. Feel free to reach out — I respond within 24 hours.</p>

            <div className="space-y-4">
              <a href={`mailto:${personalInfo.email}`} className="contact-item flex items-center gap-4 p-4 bg-background/60 dark:bg-muted/30 border border-border/70 dark:border-border rounded-xl hover:border-cyan-600/40 dark:hover:border-cyan-500/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/5 transition-all group">
                <div className="p-3 bg-background dark:bg-muted rounded-lg group-hover:bg-cyan-600/20 dark:group-hover:bg-cyan-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-foreground/60 dark:text-muted-foreground group-hover:text-cyan-700 dark:group-hover:text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60 dark:text-muted-foreground">Email</p>
                  <p className="text-foreground group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors font-medium">{personalInfo.email}</p>
                </div>
              </a>

              <div className="contact-item flex items-center gap-4 p-4 bg-background/60 dark:bg-muted/30 border border-border/70 dark:border-border rounded-xl">
                <div className="p-3 bg-background dark:bg-muted rounded-lg"><MapPin className="w-5 h-5 text-foreground/60 dark:text-muted-foreground" /></div>
                <div>
                  <p className="text-sm text-foreground/60 dark:text-muted-foreground">Location</p>
                  <p className="text-foreground font-medium">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-foreground/70 dark:text-muted-foreground mb-4 font-medium">Find me online</p>
              <div className="flex gap-3">
                {socialLinks.map((link, i) => {
                  if (link.label === "Email") return null;
                  return (
                    <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="contact-item p-3 bg-background/60 dark:bg-muted dark:border-border border border-border/70 rounded-lg hover:bg-cyan-600/20 dark:hover:bg-cyan-500/20 hover:border-cyan-600/40 dark:hover:border-cyan-500/50 hover:scale-110 transition-all">
                      <link.Icon className="w-5 h-5 text-foreground/60 dark:text-muted-foreground hover:text-cyan-700 dark:hover:text-cyan-400" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div ref={rightRef}>
            <Card className="bg-card/80 dark:bg-card border-border/70 dark:border-border backdrop-blur-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-cyan-600 dark:from-cyan-500 to-violet-600 dark:to-violet-500"></div>
              <CardHeader><CardTitle className="text-xl font-bold text-foreground dark:text-foreground">Send a Message</CardTitle></CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="title" value="Portfolio Inquiry" />
                  <div>
                    <label htmlFor="user_name" className="block text-sm font-medium text-foreground/70 dark:text-muted-foreground mb-2">Name</label>
                    <input required type="text" id="user_name" name="name"
                      className="w-full px-4 py-3 bg-background/60 dark:bg-background border border-border/70 dark:border-border rounded-lg text-foreground placeholder-foreground/50 dark:placeholder-muted-foreground focus:outline-none focus:border-cyan-600/50 dark:focus:border-cyan-500/50 focus:bg-background dark:focus:bg-white/[0.02] transition-all"
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="user_email" className="block text-sm font-medium text-foreground/70 dark:text-muted-foreground mb-2">Email</label>
                    <input required type="email" id="user_email" name="email"
                      className="w-full px-4 py-3 bg-background/60 dark:bg-background border border-border/70 dark:border-border rounded-lg text-foreground placeholder-foreground/50 dark:placeholder-muted-foreground focus:outline-none focus:border-cyan-600/50 dark:focus:border-cyan-500/50 focus:bg-background dark:focus:bg-white/[0.02] transition-all"
                      placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground/70 dark:text-muted-foreground mb-2">Message</label>
                    <textarea required id="message" name="message" rows={4}
                      className="w-full px-4 py-3 bg-background/60 dark:bg-background border border-border/70 dark:border-border rounded-lg text-foreground placeholder-foreground/50 dark:placeholder-muted-foreground focus:outline-none focus:border-cyan-600/50 dark:focus:border-cyan-500/50 focus:bg-background dark:focus:bg-white/[0.02] transition-all resize-none"
                      placeholder="Your message..."></textarea>
                  </div>
                  <Button type="submit" disabled={isSubmitting}
                    className={`w-full font-semibold transition-all ${submitStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : submitStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> :
                      submitStatus === 'success' ? <><CheckCircle2 className="w-4 h-4 mr-2" />Sent!</> :
                        submitStatus === 'error' ? 'Try Again' : <><Send className="w-4 h-4 mr-2" />Send Message</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-600/15 dark:bg-green-500/10 border border-green-600/40 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 animate-pulse" />
            Open to Work
          </span>
        </div>
        <p className="text-foreground/60 dark:text-muted-foreground/60">© {new Date().getFullYear()} {personalInfo.name}</p>
        <button
          type="button"
          onClick={scrollToTop}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 dark:border-border bg-background/60 dark:bg-muted/30 px-4 py-2 text-sm text-foreground hover:bg-background dark:hover:bg-muted/50 hover:border-cyan-600/40 dark:hover:border-primary/30 transition-all"
        >
          <ArrowUp className="w-4 h-4" />
          Back to top
        </button>
      </div>
    </section>
  );
}
