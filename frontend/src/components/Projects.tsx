import { useRef, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchProjects, createProject, updateProject, deleteProject, resetProjects } from "../services/api";
import type { Project } from "../services/api";
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

// Technology icon mapping
const getTechIcon = (tech: string): string => {
  const techLower = tech.toLowerCase().trim();
  const iconMap: { [key: string]: string } = {
    react: "⚛️",
    typescript: "TS",
    javascript: "JS",
    node: "⬢",
    "node.js": "⬢",
    express: "🚆",
    mongodb: "🍃",
    postgresql: "🐘",
    mysql: "🗄️",
    python: "🐍",
    django: "🦸",
    flask: "🧪",
    java: "☕",
    spring: "🌱",
    vue: "💚",
    angular: "🅰️",
    nextjs: "▲",
    "next.js": "▲",
    tailwind: "🎨",
    graphql: "◆",
    webpack: "📦",
    docker: "🐳",
    kubernetes: "⸖",
    aws: "☁️",
    git: "📚",
    github: "🐙",
    html: "📄",
    css: "🎨",
    sql: "📊",
  };
  return iconMap[techLower] || "⚙️";
};

// Technology related images
const getTechImage = (index: number): string => {
  const images = [
    "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=450&fit=crop%22", // React/Frontend
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop", // Backend
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop", // Technology
  ];
  return images[index % images.length];
};

export default function Projects({ adminMode = false }: { adminMode?: boolean }) {
  const { data: projects, loading, error } = useFetch(fetchProjects);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef as React.RefObject<Element>);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const [status, setStatus] = useState<string>("");

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setEditData(project);
  };

  const handleSave = async (id: number) => {
    try {
      await updateProject(id, editData);
      setStatus("Project saved!");
      setEditingId(null);
      window.location.reload();
    } catch (e: any) {
      setStatus(`Save failed: ${e.message || "Unknown error"}`);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    setStatus("");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      setStatus("Project deleted!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Delete failed: ${e.message || "Unknown error"}`);
    }
  };

  const handleAddNew = async () => {
    try {
      const newProject: Omit<Project, "id"> = {
        year: new Date().getFullYear().toString(),
        title: "New Project",
        description: "Project description here...",
        techStack: "React, Node.js, TypeScript",
        media_type: "image",
        media_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        github: "https://github.com/yourusername/project",
        live: "https://project-demo.vercel.app"
      };
      await createProject(newProject);
      setStatus("Project added!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Failed to add project: ${e.message}`);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset to 3 default projects? This will delete all existing projects!")) return;
    try {
      await resetProjects();
      setStatus("Projects reset!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Reset failed: ${e.message}`);
    }
  };

  return (
    <section id="projects" className="relative py-32 bg-[#0a0e17] overflow-hidden">
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

      <div className="max-w-[1600px] mx-auto px-8" ref={sectionRef}>
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-amber-400" />
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-amber-400">Projects</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            What I've built so far
          </h2>
        </div>

        {/* Admin controls */}
        {adminMode && (
          <div className="mb-8 flex gap-3">
            <button
              onClick={handleAddNew}
              className="px-6 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 font-medium"
            >
              + Add New Project
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 hover:bg-orange-500/20 transition-all duration-300 font-medium"
            >
              Reset to 3 Defaults
            </button>
            {status && (
              <div className="flex items-center px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
                {status}
              </div>
            )}
          </div>
        )}

        {/* Projects grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorBlock message={error} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(projects ?? []).map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                inView={inView}
                adminMode={adminMode}
                isEditing={editingId === project.id}
                editData={editData}
                onEdit={() => handleEdit(project)}
                onSave={() => handleSave(project.id)}
                onCancel={handleCancel}
                onDelete={() => handleDelete(project.id)}
                setEditData={setEditData}
              />
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
  adminMode,
  isEditing,
  editData,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  setEditData,
}: {
  project: Project;
  index: number;
  inView: boolean;
  adminMode: boolean;
  isEditing: boolean;
  editData: Partial<Project>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  setEditData: (data: Partial<Project>) => void;
}) {
  const current = isEditing ? { ...project, ...editData } : project;
  const techs = current.techStack?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  // Multi-tech stack editor handler
  const handleTechChange = (idx: number, value: string) => {
    const updatedTechs = [...techs];
    updatedTechs[idx] = value;
    setEditData({ ...editData, techStack: updatedTechs.filter(Boolean).join(", ") });
  };

  const handleAddTech = () => {
    if (techs.length < 5) {
      const currentTechs = editData.techStack || '';
      const newTechs = currentTechs ? currentTechs + ', ' : '';
      setEditData({ ...editData, techStack: newTechs });
    }
  };

  const handleRemoveTech = (idx: number) => {
    const updatedTechs = techs.filter((_, i) => i !== idx);
    setEditData({ ...editData, techStack: updatedTechs.join(", ") });
  };

  return (
    <div
      className={`relative group flex flex-col bg-slate-900/60 border border-cyan-500/20 rounded-xl overflow-hidden
        hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Media Section */}
      <div className="w-full">
          {!isEditing && (
            <div className="aspect-video overflow-hidden bg-white/5 border-b border-white/10 group-hover:border-amber-400/20 transition-colors duration-500">
              {current.media_type === "video" ? (
                <iframe
                  src={current.media_url}
                  className="w-full h-full"
                  allowFullScreen
                  title={current.title}
                />
              ) : (
                <img
                  src={current.media_url || getTechImage(index)}
                  alt={current.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getTechImage(index);
                  }}
                />
              )}
            </div>
          )}
        </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
          {isEditing ? (
            <div className="space-y-3">
              {/* Year */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Year</label>
                <input
                  className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors"
                  value={current.year || ""}
                  onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                  placeholder="2024"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Project Name</label>
                <input
                  className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white font-semibold focus:border-amber-400/50 focus:outline-none transition-colors"
                  value={current.title || ""}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  placeholder="Project Title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors resize-none"
                  value={current.description || ""}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Project description..."
                  rows={3}
                />
              </div>

              {/* Media Type & URL */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Media Type</label>
                <select
                  className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors mb-2"
                  value={current.media_type || "image"}
                  onChange={(e) => setEditData({ ...editData, media_type: e.target.value })}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <input
                  className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors"
                  value={current.media_url || ""}
                  onChange={(e) => setEditData({ ...editData, media_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {current.media_url && current.media_type === "image" && (
                  <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-amber-400/20">
                    <img
                      src={current.media_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getTechImage(index);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Tech Stack - Multi-input */}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Tech Stack (Max 5)</label>
                <div className="space-y-2">
                  {(() => {
                    const editTechs = current.techStack?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
                    return editTechs.map((tech, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          className="flex-1 p-2 rounded-lg border border-white/20 bg-slate-900 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors"
                          value={tech}
                          onChange={(e) => handleTechChange(idx, e.target.value)}
                          placeholder={`Tech ${idx + 1}`}
                        />
                        {editTechs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(idx)}
                            className="px-2.5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ));
                  })()}
                  {techs.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="w-full py-2 rounded-lg border border-dashed border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/5 transition-colors text-xs font-medium"
                    >
                      + Add Tech ({techs.length}/5)
                    </button>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Live Demo</label>
                  <input
                    className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors"
                    value={current.live || ""}
                    onChange={(e) => setEditData({ ...editData, live: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">GitHub</label>
                  <input
                    className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white text-sm focus:border-amber-400/50 focus:outline-none transition-colors"
                    value={current.github || ""}
                    onChange={(e) => setEditData({ ...editData, github: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={onSave}
                  className="flex-1 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all font-semibold text-sm"
                >
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 py-2 rounded-lg bg-gray-500/10 border border-gray-500/30 text-gray-300 hover:bg-gray-500/20 transition-all font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* View mode */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors duration-300">
                  {current.title}
                </h3>
                <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 flex-shrink-0">
                  {current.year || "2024"}
                </span>
              </div>

              {adminMode && (
                <div className="flex gap-1.5 mb-2">
                  <button
                    onClick={onEdit}
                    className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={onDelete}
                    className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium"
                  >
                    Del
                  </button>
                </div>
              )}

              <p className="text-sm text-gray-400 leading-relaxed font-light mb-3 flex-1 line-clamp-10">
                {current.description}
              </p>

              {/* Tech stack icons */}
              {techs.length > 0 && (
                <div className="flex gap-3 mb-4 py-3 border-t border-b border-cyan-500/10">
                  {techs.slice(0, 3).map((tech, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center w-12 h-12 bg-cyan-500/5 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300"
                      title={tech}
                    >
                      <span className="text-lg">{getTechIcon(tech)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech stack pills */}
              {techs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {techs.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10px] font-mono tracking-wider bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 rounded-full group-hover:border-cyan-400/40 transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex gap-2 pt-2 border-t border-white/5 mt-auto">
                {current.github && (
                  <a
                    href={current.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-mono tracking-widest uppercase text-gray-400 hover:text-white border border-white/8 hover:border-white/20 rounded-lg transition-all duration-300"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Code
                  </a>
                )}
                {current.live && (
                  <a
                    href={current.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-mono tracking-widest uppercase text-amber-400 hover:text-amber-300 border border-amber-400/20 hover:border-amber-400/50 hover:bg-amber-400/5 rounded-lg transition-all duration-300"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live
                  </a>
                )}
              </div>
            </>
          )}
        </div>
    </div>
  );
}