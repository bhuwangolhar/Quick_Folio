import { useEffect, useRef, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchProfile, updateProfile } from "../services/api";
import type { Profile } from "../services/api";
import { SkeletonHero, ErrorBlock } from "./Loader";

interface HeroProps {
  adminMode?: boolean;
}

export default function Hero({ adminMode = false }: HeroProps) {
  const [editData, setEditData] = useState<Partial<Profile>>({});
  const [status, setStatus] = useState<string>("");

  const { data: profile, loading, error } = useFetch(fetchProfile);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      setEditData({ ...profile });
    }
  }, [profile]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, [loading]);

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setStatus("Profile saved.");
      window.location.reload();
    } catch (e) {
      setStatus("Save failed.");
    }
  };


  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#080c14]"
    >
      {/* Background geometry */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
        {/* Decorative lines */}
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 right-2/3 w-px h-full bg-gradient-to-b from-transparent via-white/3 to-transparent" />
      </div>

      {/* Floating badge top-right */}
      <div className="absolute top-32 right-8 md:right-24 hidden md:flex flex-col items-end gap-2 opacity-40">
        <div className="w-16 h-px bg-amber-400" />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400">
          Available for work
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 items-center py-32">
        {/* Text */}
        <div ref={containerRef}>
          {loading ? (
            <SkeletonHero />
          ) : error ? (
            <ErrorBlock message={error} />
          ) : profile ? (
            <div className="space-y-8">
              {adminMode ? (
                <div className="space-y-4 border border-dashed border-amber-400/60 p-4 rounded">
                  <div className="text-xs font-light tracking-widest uppercase text-amber-300">Edit profile</div>
                  <input
                    value={editData.role ?? ""}
                    placeholder="Role"
                    onChange={(e) => setEditData((d) => ({ ...d, role: e.target.value }))}
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-amber-400"
                  />
                  <input
                    value={editData.name ?? ""}
                    placeholder="Name"
                    onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-amber-400"
                  />
                  <textarea
                    value={editData.bio ?? ""}
                    placeholder="Bio"
                    rows={3}
                    onChange={(e) => setEditData((d) => ({ ...d, bio: e.target.value }))}
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-amber-400"
                  />
                  <input
                    value={editData.avatar ?? ""}
                    placeholder="Avatar URL"
                    onChange={(e) => setEditData((d) => ({ ...d, avatar: e.target.value }))}
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-amber-400"
                  />
                  <input
                    value={editData.resume ?? ""}
                    placeholder="Resume URL"
                    onChange={(e) => setEditData((d) => ({ ...d, resume: e.target.value }))}
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-amber-400"
                  />
                  <button onClick={handleSave} className="px-4 py-2 rounded bg-amber-400 text-black font-semibold hover:bg-amber-300">Save profile</button>
                  <div className="text-xs text-cyan-300">{status}</div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-amber-400" />
                    <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400">
                      {profile.role}
                    </span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                    <span className="block text-white">{profile.name.split(" ")[0]}</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                      {profile.name.split(" ").slice(1).join(" ")}
                    </span>
                  </h1>

                  <p className="text-gray-400 text-lg leading-relaxed max-w-lg font-light">
                    {profile.bio}
                  </p>
                </>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                {profile.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-amber-400 text-black text-sm font-semibold tracking-wider uppercase rounded-none hover:bg-amber-300 transition-colors duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">Download Resume</span>
                    <svg className="w-4 h-4 relative z-10 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                )}
                <button
                  onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
                  className="group inline-flex items-center gap-3 px-8 py-4 border border-white/15 text-white text-sm font-light tracking-wider uppercase hover:border-amber-400/50 hover:text-amber-400 transition-all duration-300"
                >
                  View Work
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Avatar */}
        <div className="hidden md:flex justify-end">
          {!loading && profile?.avatar && (
            <div className="relative">
              {/* Frame decoration */}
              <div className="absolute -inset-4 border border-amber-400/10 rounded-2xl" />
              <div className="absolute -inset-8 border border-white/5 rounded-3xl" />
              <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-amber-400/30 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-amber-400/30 rounded-bl-2xl" />
              <img
                src={profile.avatar}
                alt={profile.name}
                className="relative w-80 h-80 object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              {/* Overlay shimmer */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-amber-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-amber-400 animate-pulse" />
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-amber-400 rotate-90 translate-y-4">
          Scroll
        </span>
      </div>
    </section>
  );
}