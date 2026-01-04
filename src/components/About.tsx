import { useInView } from '../hooks/useInView';

export default function About() {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`transition-all duration-1000 ${isInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
            }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-white mx-auto mb-12"></div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-zinc-400 mb-6 leading-relaxed">
              I'm a Computer Science and Engineering student at Dayananda Sagar College of Engineering,
              Bengaluru, specializing in Data Science. Currently in my undergraduate journey (2023-2027),
              I'm passionate about building full-stack web applications and exploring machine learning.
            </p>
            <p className="text-lg text-zinc-400 mb-6 leading-relaxed">
              My work spans from developing secure enterprise solutions like data wiping systems with
              DoD-compliant algorithms, to creating interactive ML applications with TensorFlow and Streamlit.
              I enjoy working with modern tech stacks including React, Node.js, PostgreSQL, and Python.
            </p>
            <p className="text-lg text-zinc-400 leading-relaxed">
              When I'm not coding, you'll find me diving into new technologies, working on personal projects,
              or exploring the intersection of data science and web development. I'm always excited to
              collaborate on challenging projects that make a real impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
