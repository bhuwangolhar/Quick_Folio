import { useRef, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchSocials, fetchProfile } from "../services/api";
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

const PLATFORM_META: Record<string, { icon: JSX.Element; color: string }> = {
  github: {
    color: "hover:border-white/40 hover:text-white",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  linkedin: {
    color: "hover:border-sky-500/50 hover:text-sky-400",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  twitter: {
    color: "hover:border-sky-400/50 hover:text-sky-400",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  instagram: {
    color: "hover:border-pink-500/50 hover:text-pink-400",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
};

function getPlatformMeta(platform: string) {
  const key = platform.toLowerCase().trim();
  return PLATFORM_META[key] ?? {
    color: "hover:border-amber-400/50 hover:text-amber-400",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  };
}

export default function Socials() {
  const { data: socials, loading, error } = useFetch(fetchSocials);
  const { data: profile } = useFetch(fetchProfile);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef as React.RefObject<Element>);

  return (
    <section id="socials" className="relative py-32 bg-[#080c14] overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-[600px] h-[300px] -translate-x-1/2 rounded-full bg-amber-500/4 blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6" ref={sectionRef}>
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div
            className={`mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-px bg-amber-400" />
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400">Connect</span>
              <div className="w-8 h-px bg-amber-400" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
              Let's Talk
            </h2>
            {profile?.bio && (
              <p className="text-gray-500 font-light leading-relaxed">
                I'm always open to new opportunities, collaborations, or just a good conversation about tech.
              </p>
            )}
          </div>

          {/* Social links */}
          {loading ? (
            <div className="flex justify-center gap-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-14 h-14 rounded-xl bg-white/5" />
              ))}
            </div>
          ) : error ? (
            <ErrorBlock message={error} />
          ) : (
            <div
              className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {(socials ?? []).map((social, i) => {
                const meta = getPlatformMeta(social.platform);
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex flex-col items-center gap-2.5 p-5 w-24 border border-white/8 rounded-xl text-gray-500 transition-all duration-300 ${meta.color} hover:bg-white/4 hover:scale-105`}
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    {meta.icon}
                    <span className="text-[9px] font-mono tracking-widest uppercase">{social.platform}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-700 delay-300 ${inView ? "opacity-100" : "opacity-0"}`}
        >
          <span className="text-xs font-mono tracking-wider text-gray-600">
            © {new Date().getFullYear()} {profile?.name ?? "Portfolio"}. All rights reserved.
          </span>
          <span className="text-xs font-mono tracking-wider text-gray-700">
            Built with React + TypeScript
          </span>
        </div>
      </div>
    </section>
  );
}