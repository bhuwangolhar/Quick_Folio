import { useEffect, useRef, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchAbout, updateAbout } from "../services/api";
import type { About as AboutType } from "../services/api";
import { SkeletonHero, ErrorBlock } from "./Loader";

interface AboutProps {
  adminMode?: boolean;
}

export default function About({ adminMode = false }: AboutProps) {
  const [editData, setEditData] = useState<Partial<AboutType>>({});
  const [status, setStatus] = useState<string>("");

  const { data: about, loading, error } = useFetch(fetchAbout);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (about) {
      setEditData({ ...about });
    }
  }, [about]);

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
      await updateAbout(editData);
      setStatus("About section saved.");
      window.location.reload();
    } catch (e) {
      setStatus("Save failed.");
    }
  };

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0e17]"
    >
      {/* Background geometry */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Ambient glow */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
        {/* Decorative lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full py-32">
        <div ref={containerRef}>
          {loading ? (
            <SkeletonHero />
          ) : error ? (
            <ErrorBlock message={error} />
          ) : about ? (
            <div className="space-y-16">
              {adminMode ? (
                <div className="space-y-4 border border-dashed border-cyan-400/60 p-6 rounded">
                  <div className="text-xs font-light tracking-widest uppercase text-cyan-300">
                    Edit About Section
                  </div>
                  <input
                    value={editData.section ?? ""}
                    placeholder="Section label (e.g., 01 - ABOUT)"
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, section: e.target.value }))
                    }
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400"
                  />
                  <input
                    value={editData.heading ?? ""}
                    placeholder="Heading"
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, heading: e.target.value }))
                    }
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400"
                  />
                  <textarea
                    value={editData.subtitle ?? ""}
                    placeholder="Subtitle"
                    rows={2}
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, subtitle: e.target.value }))
                    }
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400"
                  />
                  <textarea
                    value={editData.description ?? ""}
                    placeholder="Description"
                    rows={6}
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, description: e.target.value }))
                    }
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400"
                  />

                  <div className="text-xs font-semibold text-cyan-300 mt-6">
                    Code Block
                  </div>
                  <input
                    value={editData.code_filename ?? ""}
                    placeholder="Filename (e.g., app.js, config.json)"
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, code_filename: e.target.value }))
                    }
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                  <textarea
                    value={editData.code_content ?? ""}
                    placeholder="Code content for the terminal window (supports JSON, comments, etc.)"
                    rows={12}
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, code_content: e.target.value }))
                    }
                    className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 font-mono text-xs mt-2"
                  />

                  <div className="text-xs font-semibold text-cyan-300 mt-6">
                    Stat Cards
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        value={editData.stat1_value ?? ""}
                        placeholder="Stat 1 Value (e.g., 10+)"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, stat1_value: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400"
                      />
                      <input
                        value={editData.stat1_label ?? ""}
                        placeholder="Stat 1 Label"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, stat1_label: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 mt-2"
                      />
                    </div>

                    <div>
                      <input
                        value={editData.stat2_value ?? ""}
                        placeholder="Stat 2 Value"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, stat2_value: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400"
                      />
                      <input
                        value={editData.stat2_label ?? ""}
                        placeholder="Stat 2 Label"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, stat2_label: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 mt-2"
                      />
                    </div>

                    <div>
                      <input
                        value={editData.stat3_value ?? ""}
                        placeholder="Stat 3 Value"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, stat3_value: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400"
                      />
                      <input
                        value={editData.stat3_label ?? ""}
                        placeholder="Stat 3 Label"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, stat3_label: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 mt-2"
                      />
                    </div>

                    <div>
                      <input
                        value={editData.stat4_value ?? ""}
                        placeholder="Stat 4 Value"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, stat4_value: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400"
                      />
                      <input
                        value={editData.stat4_label ?? ""}
                        placeholder="Stat 4 Label"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, stat4_label: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400 mt-2"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded bg-cyan-400 text-black font-semibold hover:bg-cyan-300"
                  >
                    Save About Section
                  </button>
                  <div className="text-xs text-cyan-300">{status}</div>
                </div>
              ) : (
                <>
                  {/* Section label */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-px bg-orange-500" />
                    <span className="text-sm font-mono tracking-[0.25em] uppercase text-cyan-400">
                      ME
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-16">
                    {/* Left: Text content */}
                    <div className="space-y-8">
                      <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white">
                        {about.heading}
                      </h2>

                      <p className="text-cyan-400/80 text-lg leading-relaxed font-light">
                        {about.subtitle}
                      </p>

                      <p className="text-gray-400 text-base leading-relaxed whitespace-pre-line">
                        {about.description}
                      </p>
                    </div>

                    {/* Right: Code preview mockup */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="relative w-full max-w-md group">
                        {/* Terminal window */}
                        <div className="bg-slate-900/90 rounded-lg border border-cyan-500/40 overflow-hidden shadow-2xl hover:border-cyan-500/60 hover:shadow-cyan-500/30 transition-all duration-300">
                          {/* Terminal header */}
                          <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500/70" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                            <div className="w-3 h-3 rounded-full bg-green-500/70" />
                            <span className="ml-2 text-[10px] font-mono text-gray-500">
                              {about.code_filename || "config.json"}
                            </span>
                          </div>

                          {/* Code content */}
                          <div className="p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                            {about.code_content?.split('\n').map((line, idx) => {
                              // Simple syntax highlighting
                              if (line.trim().startsWith('//')) {
                                // Comments
                                return <div key={idx} className="text-gray-600 italic">{line}</div>;
                              } else if (line.includes('"') && line.includes(':')) {
                                // JSON key-value pairs
                                const parts = line.split(':');
                                return (
                                  <div key={idx}>
                                    <span className="text-cyan-400">{parts[0]}</span>
                                    <span className="text-gray-500">:</span>
                                    <span className="text-green-400">{parts.slice(1).join(':')}</span>
                                  </div>
                                );
                              } else if (line.includes('"')) {
                                // String values
                                return <div key={idx} className="text-green-400">{line}</div>;
                              } else {
                                // Default (brackets, commas, etc.)
                                return <div key={idx} className="text-gray-500">{line}</div>;
                              }
                            })}
                          </div>
                        </div>

                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-b from-cyan-500/20 to-cyan-500/5 blur-2xl opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                    {about.stat1_value && (
                      <div className="group relative bg-slate-900/60 border border-cyan-500/40 rounded-lg p-6 hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
                        <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                          {about.stat1_value}
                        </div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-light">
                          {about.stat1_label}
                        </div>
                        <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
                        <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-lg blur -z-10 transition-opacity duration-300" />
                      </div>
                    )}

                    {about.stat2_value && (
                      <div className="group relative bg-slate-900/60 border border-cyan-500/40 rounded-lg p-6 hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
                        <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                          {about.stat2_value}
                        </div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-light">
                          {about.stat2_label}
                        </div>
                        <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
                        <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-lg blur -z-10 transition-opacity duration-300" />
                      </div>
                    )}

                    {about.stat3_value && (
                      <div className="group relative bg-slate-900/60 border border-cyan-500/40 rounded-lg p-6 hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
                        <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                          {about.stat3_value}
                        </div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-light">
                          {about.stat3_label}
                        </div>
                        <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
                        <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-lg blur -z-10 transition-opacity duration-300" />
                      </div>
                    )}

                    {about.stat4_value && (
                      <div className="group relative bg-slate-900/60 border border-cyan-500/40 rounded-lg p-6 hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300">
                        <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                          {about.stat4_value}
                        </div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-light">
                          {about.stat4_label}
                        </div>
                        <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
                        <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-lg blur -z-10 transition-opacity duration-300" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
