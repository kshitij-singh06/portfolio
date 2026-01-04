import { useInView } from '../hooks/useInView';

import { Badge } from '@/components/ui/badge';
import { skillCategories } from '../data';

export default function Skills() {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  return (
    <section
      id="skills"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className={`transition-all duration-1000 ${isInView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
            Technical Skills
          </h2>
          <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-center text-zinc-500 max-w-2xl mx-auto mb-12">
            Technologies and tools I use to bring ideas to life
          </p>

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.title}
                  className={`group bg-zinc-950 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-all duration-500 hover:-translate-y-1 ${isInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex p-3 rounded-lg bg-zinc-900 border border-zinc-800 mb-4 group-hover:bg-zinc-800 transition-colors">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
