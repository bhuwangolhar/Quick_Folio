import { useRef, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchSkills } from "../services/api";
import { ErrorBlock } from "./Loader";

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

const LEVEL_CONFIG: Record<string, { pct: number; label: string; color: string }> = {
  beginner:     { pct: 30,  label: "Beginner",     color: "from-sky-500 to-sky-400" },
  intermediate: { pct: 60,  label: "Intermediate",  color: "from-violet-500 to-violet-400" },
  advanced:     { pct: 85,  label: "Advanced",      color: "from-amber-500 to-amber-400" },
  expert:       { pct: 100, label: "Expert",        color: "from-amber-400 to-yellow-300" },
};

function getLevel(level: string) {
  const key = level?.toLowerCase().trim() as keyof typeof LEVEL_CONFIG;
  return LEVEL_CONFIG[key] ?? { pct: 50, label: level, color: "from-gray-500 to-gray-400" };
}

export default function Skills() {
  const { data: skills, loading, error } = useFetch(fetchSkills);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef as React.RefObject<Element>);

  return (
    <section id="skills" className="relative py-32 bg-[#060a10] overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-violet-500/4 blur-[100px]" />
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
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400">Expertise</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white">Skills</h2>
          <p className="mt-4 text-gray-500 font-light max-w-md">
            Tools and technologies I use to bring ideas to life.
          </p>
        </div>

        {loading ? (
          <SkeletonSkills />
        ) : error ? (
          <ErrorBlock message={error} />
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {(skills ?? []).map((skill, i) => {
              const lvl = getLevel(skill.level);
              return (
                <div
                  key={skill.id}
                  className={`group transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm font-medium text-white tracking-wide">{skill.name}</span>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">{lvl.label}</span>
                  </div>
                  {/* Bar */}
                  <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${lvl.color} transition-all duration-1000 ease-out`}
                      style={{ width: inView ? `${lvl.pct}%` : "0%", transitionDelay: `${i * 60 + 200}ms` }}
                    />
                    {/* Shimmer */}
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000 ease-out opacity-0 group-hover:opacity-100`}
                      style={{ width: `${lvl.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Badge cloud for visual variety */}
        {!loading && !error && skills && skills.length > 0 && (
          <div
            className={`mt-20 transition-all duration-700 delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p className="text-xs font-mono tracking-[0.25em] uppercase text-gray-600 mb-6">Also familiar with</p>
            <div className="flex flex-wrap gap-3">
              {skills.slice(0, 12).map((skill) => (
                <span
                  key={`badge-${skill.id}`}
                  className="px-4 py-2 text-xs font-mono tracking-wider text-gray-400 border border-white/8 rounded-full hover:border-amber-400/30 hover:text-amber-400/80 transition-all duration-300 cursor-default"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SkeletonSkills() {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-2.5">
          <div className="flex justify-between">
            <div className="h-3 bg-white/10 rounded w-24" />
            <div className="h-3 bg-white/10 rounded w-16" />
          </div>
          <div className="h-1.5 bg-white/5 rounded-full">
            <div className="h-1.5 bg-white/10 rounded-full" style={{ width: `${30 + i * 8}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}