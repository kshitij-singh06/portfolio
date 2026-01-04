import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projects } from '../data';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          <motion.h2
            variants={item}
            className="text-4xl sm:text-5xl font-bold font-heading text-white text-center mb-4"
          >
            Featured Projects
          </motion.h2>
          <motion.div variants={item} className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 mx-auto mb-12"></motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div key={index} variants={item}>
                <Card
                  className="group h-full bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all duration-500 overflow-hidden backdrop-blur-sm"
                >
                  {/* Accent bar */}
                  <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"></div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-heading">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-zinc-400 leading-relaxed min-h-[80px]">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-black/20 border-zinc-800 text-zinc-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-all font-medium"
                      >
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          View Code
                        </a>
                      </Button>

                      {project.liveDemo && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1 bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all font-medium"
                        >
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
