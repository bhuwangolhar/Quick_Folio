// Hero.tsx

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: profile, loading, error } = useFetch(fetchProfile);

  useEffect(() => {
    if (profile) setEditData({ ...profile });
  }, [profile]);

  // Animated grid / nexus canvas effect - DISABLED for cleaner look
  useEffect(() => {
    return () => {};
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setStatus("Profile saved.");
      window.location.reload();
    } catch {
      setStatus("Save failed.");
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Main content */}
      <div
        className="relative flex flex-col items-center text-center px-6 w-full max-w-5xl mx-auto py-40"
        style={{ zIndex: 2 }}
      >
        {loading ? (
          <SkeletonHero />
        ) : error ? (
          <ErrorBlock message={error} />
        ) : profile ? (
          <>
            {adminMode ? (
              <div
                className="space-y-4 text-left w-full max-w-lg mx-auto p-6 rounded-lg"
                style={{
                  border: "1px dashed rgba(0,220,255,0.4)",
                  background: "rgba(0,220,255,0.04)",
                }}
              >
                <div
                  className="text-xs font-mono tracking-widest uppercase mb-2"
                  style={{ color: "#00dcff" }}
                >
                  Edit Profile
                </div>
                {[
                  { key: "role", placeholder: "Role" },
                  { key: "name", placeholder: "Name" },
                  { key: "resume", placeholder: "Resume URL" },
                ].map(({ key, placeholder }) => (
                  <input
                    key={key}
                    value={(editData as Record<string, string>)[key] ?? ""}
                    placeholder={placeholder}
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, [key]: e.target.value }))
                    }
                    className="w-full p-2 rounded text-white outline-none text-sm"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
                <textarea
                  value={editData.bio ?? ""}
                  placeholder="Bio"
                  rows={3}
                  onChange={(e) => setEditData((d) => ({ ...d, bio: e.target.value }))}
                  className="w-full p-2 rounded text-white outline-none text-sm resize-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded text-sm font-semibold transition-all"
                  style={{
                    background: "#00dcff",
                    color: "#070b18",
                  }}
                >
                  Save Profile
                </button>
                {status && (
                  <div className="text-xs font-mono" style={{ color: "#00dcff" }}>
                    {status}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="flex flex-col items-center gap-8"
                style={{ animation: "heroFadeUp 1s ease forwards" }}
              >
                {/* Role label */}
                <div className="flex items-center gap-5 mb-4">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#00e5a0",
                      boxShadow: "0 0 8px #00e5a0",
                    }}
                  />
                  <span
                    className="text-xs font-mono tracking-[0.3em] uppercase"
                    style={{ color: "#00dcff" }}
                  >
                    {profile.role}
                  </span>
                </div>

                {/* Giant name */}
                <h1
                  className="font-bold leading-none tracking-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(56px, 10vw, 96px)",
                  }}
                >
                  {profile.name.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className="block"
                      style={
                        i === 0
                          ? { color: "#ffffff" }
                          : {
                              backgroundImage:
                                "linear-gradient(90deg, #00dcff 0%, #7b8fff 50%, #ff69b4 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }
                      }
                    >
                      {word}
                    </span>
                  ))}
                </h1>

                {/* Decorative divider */}
                <div className="flex items-center gap-4 w-full max-w-xs justify-center py-4">
                  <div className="flex-1 h-px" style={{ background: "rgba(0,220,255,0.3)" }} />
                  <svg width="16" height="16" viewBox="0 0 16 16" style={{ color: "#00dcff" }}>
                    <path fill="currentColor" d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z" />
                  </svg>
                  <div className="flex-1 h-px" style={{ background: "rgba(0,220,255,0.3)" }} />
                </div>

                {/* Bio */}
                <p
                  className="text-base md:text-lg leading-relaxed max-w-2xl font-light"
                  style={{ color: "rgba(200,200,200,0.8)" }}
                >
                  {profile.bio}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 justify-center pt-2">
                  {profile.resume && (
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-3 px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300"
                      style={{
                        background: "#00dcff",
                        color: "#000000",
                        borderRadius: "25px",
                        border: "none",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                      }}
                    >
                      <span>↓ Download Resume</span>
                    </a>
                  )}
                  <button
                    onClick={() =>
                      document
                        .querySelector("#socials")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center gap-3 px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300"
                    style={{
                      background: "transparent",
                      border: "1px solid #ffffff",
                      color: "#ffffff",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#00dcff";
                      (e.currentTarget as HTMLButtonElement).style.color = "#00dcff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#ffffff";
                      (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                    }}
                  >
                    Let's Connect →
                  </button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 2, opacity: 0.4 }}
      >
        <div
          className="w-px h-10"
          style={{
            background: "linear-gradient(to bottom, #00dcff, transparent)",
          }}
        />
        <span
          className="text-[10px] font-mono tracking-[0.3em] uppercase"
          style={{ color: "#00dcff" }}
        >
          Swipe down
        </span>
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes nameShimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </section>
  );
}