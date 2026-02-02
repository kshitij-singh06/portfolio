import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import { Mail, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
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

  return (
    <section id="contact" ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headingRef} className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div ref={leftRef}>
            <h3 className="text-3xl font-bold text-white mb-6">Let's Connect</h3>
            <p className="text-lg text-zinc-400 mb-8">I'm always open to new opportunities, collaborations, and interesting projects.</p>

            <div className="space-y-4">
              <a href={`mailto:${personalInfo.email}`} className="contact-item flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-cyan-500/50 transition-all group">
                <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Email</p>
                  <p className="text-white group-hover:text-cyan-400 transition-colors">{personalInfo.email}</p>
                </div>
              </a>

              <div className="contact-item flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="p-3 bg-zinc-800 rounded-lg"><MapPin className="w-5 h-5 text-zinc-400" /></div>
                <div>
                  <p className="text-sm text-zinc-500">Location</p>
                  <p className="text-white">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-zinc-400 mb-4">Find me online</p>
              <div className="flex gap-3">
                {socialLinks.map((link, i) => {
                  if (link.label === "Email") return null;
                  return (
                    <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="contact-item p-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:scale-110 transition-all">
                      <link.Icon className="w-5 h-5 text-zinc-400 hover:text-cyan-400" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div ref={rightRef}>
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-violet-500"></div>
              <CardHeader><CardTitle className="text-xl font-bold text-white">Send a Message</CardTitle></CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="title" value="Portfolio Inquiry" />
                  <div>
                    <label htmlFor="user_name" className="block text-sm font-medium text-zinc-400 mb-2">Name</label>
                    <input required type="text" id="user_name" name="name"
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="user_email" className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                    <input required type="email" id="user_email" name="email"
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
                    <textarea required id="message" name="message" rows={4}
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                      placeholder="Your message..."></textarea>
                  </div>
                  <Button type="submit" disabled={isSubmitting}
                    className={`w-full font-semibold transition-all ${submitStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : submitStatus === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-black hover:bg-cyan-400'}`}>
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
        <p className="text-zinc-600">© {new Date().getFullYear()} {personalInfo.name}. Built with React & GSAP</p>
      </div>
    </section>
  );
}
