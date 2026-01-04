import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Mail, Zap } from 'lucide-react';
import { personalInfo, floatingIcons, socialLinks } from '../data';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 relative overflow-hidden bg-black"
    >
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Abstract Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
      />

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute hidden lg:block opacity-20"
          initial={{ y: 0 }}
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay
          }}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
          }}
        >
          <item.Icon size={item.size} className="text-white" />
        </motion.div>
      ))}

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Profile Picture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-white/10 ring-4 ring-black shadow-2xl">
              <img
                src="/profile.jpg"
                alt={personalInfo.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale hover:grayscale-0"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400';
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading text-white mb-6 tracking-tight">
            {personalInfo.name}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-sm sm:text-base font-medium backdrop-blur-sm">
            {personalInfo.title}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {personalInfo.description}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
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
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target={social.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors"
            >
              <social.Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
