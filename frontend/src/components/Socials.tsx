import { useRef, useEffect, useState } from "react";
import type { RefObject, ReactNode } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchSocials, fetchProfile, createSocial, updateSocial, deleteSocial, updateProfile } from "../services/api";
import type { Social } from "../services/api";
import { ErrorBlock } from "./Loader";

function useInView(ref: RefObject<Element>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

const PLATFORM_META: Record<string, { icon: ReactNode; color: string }> = {
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
  phone: {
    color: "hover:border-green-500/50 hover:text-green-400",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
      </svg>
    ),
  },
  email: {
    color: "hover:border-blue-500/50 hover:text-blue-400",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
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

function formatSocialUrl(platform: string, url: string): string {
  const key = platform.toLowerCase().trim();
  
  // For WhatsApp/Phone: convert to wa.me link
  if (key === 'phone' || key === 'whatsapp') {
    // Remove all non-digit characters and leading +
    const phoneNumber = url.replace(/\D/g, '');
    return `https://wa.me/${phoneNumber}`;
  }
  
  // For Email: convert to mailto link
  if (key === 'email') {
    return `mailto:${url}`;
  }
  
  // For other platforms, return the URL as-is
  return url;
}
const pulseAnimation = `
  @keyframes textPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
`;
export default function Socials({ adminMode = false }: { adminMode?: boolean }) {
  const { data: socials, loading, error } = useFetch(fetchSocials);
  const { data: profile } = useFetch(fetchProfile);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef as React.RefObject<Element>);

  const [newSocial, setNewSocial] = useState<Omit<Social, "id">>({ platform: "", url: "" });
  const [status, setStatus] = useState<string>("");
  const [editSocials, setEditSocials] = useState<Record<number, Partial<Social>>>({});
  const [editBio, setEditBio] = useState<string>("");

  const handleCreate = async () => {
    try {
      await createSocial(newSocial);
      setStatus("Social created.");
      window.location.reload();
    } catch (e) {
      setStatus("Failed to create social.");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateSocial(id, editSocials[id]);
      setStatus("Social updated.");
      window.location.reload();
    } catch (e) {
      setStatus("Failed to update social.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSocial(id);
      setStatus("Social deleted.");
      window.location.reload();
    } catch (e) {
      setStatus("Failed to delete social.");
    }
  };

  useEffect(() => {
    if (profile?.contact_bio) {
      setEditBio(profile.contact_bio);
    }
  }, [profile]);

  const handleBioUpdate = async () => {
    try {
      await updateProfile({ contact_bio: editBio });
      setStatus("Bio updated.");
      window.location.reload();
    } catch (e) {
      setStatus("Failed to update bio.");
    }
  };

  return (
    <section id="socials" className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center pb-4" style={{ background: "#000000" }}>
      <style>{pulseAnimation}</style>

      <div className="max-w-7xl mx-auto px-6 w-full" ref={sectionRef}>
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
            {profile?.contact_bio && (
              <p className="text-gray-500 font-light leading-relaxed max-w-2xl">
                {profile.contact_bio.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < profile.contact_bio.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            )}
          </div>

          {adminMode && (
            <div className="mb-6 p-4 border border-dashed border-amber-300/60 rounded">
              <div className="mb-2 text-sm text-amber-300">Admin: edit bio</div>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Contact section bio text"
                rows={3}
                className="w-full px-2 py-1 mb-2 rounded border border-white/20 bg-slate-900 text-white"
              />
              <button onClick={handleBioUpdate} className="px-4 py-2 rounded bg-amber-400 text-black mb-4">
                Update Bio
              </button>
              <div className="text-xs text-cyan-300 mb-4">{status}</div>

              <div className="text-sm text-amber-300 mb-2">Add social</div>
              <div className="text-xs text-gray-400 mb-3 bg-slate-900/50 p-2 rounded">
                Platform examples: github, linkedin, twitter, instagram, email, phone, whatsapp<br/>
                For phone/whatsapp: use phone number (e.g., "1234567890" or "+1-234-567-8910")<br/>
                For email: use email address (e.g., "user@example.com")
              </div>
              <input value={newSocial.platform} onChange={(e) => setNewSocial((s) => ({ ...s, platform: e.target.value }))} placeholder="Platform" className="w-full px-2 py-1 mb-2 rounded border border-white/20 bg-slate-900 text-white" />
              <input value={newSocial.url} onChange={(e) => setNewSocial((s) => ({ ...s, url: e.target.value }))} placeholder="URL / Phone / Email" className="w-full px-2 py-1 mb-2 rounded border border-white/20 bg-slate-900 text-white" />
              <button onClick={handleCreate} className="px-4 py-2 rounded bg-amber-400 text-black">Add social</button>
            </div>
          )}

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
                return adminMode ? (
                  <div
                    key={social.id}
                    className={`group flex flex-col items-start gap-2.5 p-4 border border-dashed border-amber-400/40 rounded-xl text-white transition-all duration-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <input
                      className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white"
                      value={editSocials[social.id]?.platform ?? social.platform}
                      onChange={(e) => setEditSocials((p) => ({ ...p, [social.id]: { ...p[social.id], platform: e.target.value } }))}
                    />
                    <input
                      className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white"
                      value={editSocials[social.id]?.url ?? social.url}
                      onChange={(e) => setEditSocials((p) => ({ ...p, [social.id]: { ...p[social.id], url: e.target.value } }))}
                    />
                    <div className="flex gap-2 w-full">
                      <button onClick={() => handleUpdate(social.id)} className="flex-1 py-2 rounded bg-amber-400 text-black">Save</button>
                      <button onClick={() => handleDelete(social.id)} className="flex-1 py-2 rounded bg-red-500 text-white">Delete</button>
                    </div>
                  </div>
                ) : (
                  <a
                    key={social.id}
                    href={formatSocialUrl(social.platform, social.url)}
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
        <div className="mt-16 pt-8 flex flex-col items-center justify-center gap-6">
          {/* Copyright text - highlighted in white */}
          <span className="text-sm font-mono tracking-wider text-white text-center drop-shadow-lg">
            © {new Date().getFullYear()} {profile?.name ?? "Portfolio"}. All rights reserved.
          </span>
          
          {/* Built with text - dim and pulsing at bottom */}
          <div className="mt-4">
            <span 
              className="text-xs font-mono tracking-wider text-amber-400 text-center"
              style={{ animation: "textPulse 2.5s ease-in-out infinite" }}
            >
              Built with React + TypeScript
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}