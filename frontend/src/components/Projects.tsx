import { useRef, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchProjects } from "../services/api";
import { SkeletonCard, ErrorBlock } from "./Loader";

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

export default function Projects() {
  const { data: projects, loading, error } = useFetch(fetchProjects);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef as React.RefObject<Element>);

  return (
    <section id="projects" className="relative py-32 bg-[#080c14] overflow-hidden">
      {/* BG accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-amber-500/4 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6" ref={sectionRef}>
        {/* Header */}
        <div
          className={`mb-20 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-amber-400" />
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400">Selected Work</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Projects
          </h2>
          <p className="mt-4 text-gray-500 font-light max-w-md">
            A curated selection of work that reflects my approach to building software.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorBlock message={error} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(projects ?? []).map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} inView={inView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: { id: number; title: string; description: string; techStack: string; github: string; live: string };
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const techs = project.techStack?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  return (
    <div
      className={`group relative flex flex-col bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden
        hover:border-amber-400/25 hover:bg-white/[0.06] transition-all duration-500
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${index * 80}ms`, transitionProperty: "opacity, transform, background-color, border-color" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top amber bar */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`} />

      {/* Number badge */}
      <div className="absolute top-5 right-5 text-[10px] font-mono text-white/10 group-hover:text-amber-400/30 transition-colors duration-500">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="p-6 flex flex-col h-full gap-4">
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-amber-300 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed font-light line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tech stack */}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techs.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase bg-white/5 border border-white/8 text-gray-400 rounded group-hover:border-amber-400/15 group-hover:text-amber-400/70 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2 border-t border-white/5">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono tracking-widest uppercase text-gray-400 hover:text-white border border-white/8 hover:border-white/20 rounded transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Source
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono tracking-widest uppercase text-amber-400 hover:text-amber-300 border border-amber-400/20 hover:border-amber-400/50 hover:bg-amber-400/5 rounded transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
}