import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useInView } from '../hooks/useInView';
import { Mail, MapPin, Github, Linkedin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Contact() {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
    <section
      id="contact"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative"
    >
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className={`transition-all duration-1000 ${isInView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4 font-heading">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 font-heading">
                Let's Connect
              </h3>
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                I'm always open to new opportunities, collaborations, and
                interesting projects. Feel free to reach out if you'd like to
                work together or just want to say hi!
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:kshitij.tech06@gmail.com"
                  className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-cyan-500/50 transition-all duration-300 group backdrop-blur-sm"
                >
                  <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-colors">
                    <Mail className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Email</p>
                    <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                      kshitij.tech06@gmail.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm">
                  <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                    <MapPin className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Location</p>
                    <p className="text-white font-medium">
                      Bengaluru, Karnataka
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-zinc-400 mb-4 font-medium">
                  Find me online
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/kshitij-singh06"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 group transition-all"
                  >
                    <Github className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/kshitij-singh06"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 group transition-all"
                  >
                    <Linkedin className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white font-heading">
                  Reach Out
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="title" value="Portfolio Inquiry" />
                  <div>
                    <label
                      htmlFor="user_name"
                      className="block text-sm font-medium text-zinc-400 mb-2"
                    >
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      id="user_name"
                      name="name"
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="user_email"
                      className="block text-sm font-medium text-zinc-400 mb-2"
                    >
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      id="user_email"
                      name="email"
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-zinc-400 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      required
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                      placeholder="Your message..."
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-semibold transition-all duration-300 ${submitStatus === 'success'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : submitStatus === 'error'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-white text-black hover:bg-cyan-400 hover:text-black'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Message Sent!
                      </>
                    ) : submitStatus === 'error' ? (
                      'Try Again'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  {submitStatus === 'success' && (
                    <p className="text-green-500 text-sm text-center animate-in fade-in slide-in-from-top-1">
                      Thanks! I'll get back to you soon.
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm text-center animate-in fade-in slide-in-from-top-1">
                      Oops! Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center relative z-10">
        <p className="text-zinc-600">
          © {new Date().getFullYear()} Kshitij Singh. Built with React & Tailwind CSS
        </p>
      </div>
    </section>
  );
}

