import { useInView } from '../hooks/useInView';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Contact() {
  const [ref, isInView] = useInView({ threshold: 0.2 });

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
          <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-white mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
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
                  className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all duration-300 group"
                >
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:bg-zinc-800 transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Email</p>
                    <p className="text-white font-medium">
                      kshitij.tech06@gmail.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
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
                    href="https://github.com/kshitij"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition-all"
                  >
                    <Github className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
                  </a>
                  <a
                    href="https://linkedin.com/in/kshitij"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition-all"
                  >
                    <Linkedin className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  Reach Out
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-zinc-400 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-zinc-400 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
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
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all resize-none"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-zinc-200 font-semibold"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center relative z-10">
        <p className="text-zinc-600">
          © 2025 Kshitij Singh. Built with React & Tailwind CSS
        </p>
      </div>
    </section>
  );
}
