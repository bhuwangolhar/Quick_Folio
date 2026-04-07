import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  resetExperiences,
} from "../services/api";
import type { Experience } from "../services/api";

interface ExperienceProps {
  adminMode?: boolean;
}

const circleGlowStyles = `
  @keyframes circlePulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4), inset 0 0 0 1px rgba(34, 211, 238, 0.5);
    }
    50% {
      box-shadow: 0 0 20px 8px rgba(34, 211, 238, 0.6), inset 0 0 0 1px rgba(34, 211, 238, 0.5);
    }
  }
  .circle-glow {
    animation: circlePulse 3s ease-in-out infinite;
  }
`;

export default function ExperienceSection({ adminMode = false }: ExperienceProps) {
  const { data: experiences, loading, error } = useFetch(fetchExperiences);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Experience>>({});
  const [status, setStatus] = useState<string>("");

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setEditData({ ...exp });
  };

  const handleSave = async (id: number) => {
    try {
      await updateExperience(id, editData);
      setStatus("Saved!");
      setEditingId(null);
      refetch();
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      setStatus("Save failed.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await deleteExperience(id);
      setStatus("Deleted!");
      refetch();
      setTimeout(() => setStatus(""), 2000);
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || e.message || "Delete failed.";
      setStatus(`Delete failed: ${errorMsg}`);
      setTimeout(() => setStatus(""), 4000);
    }
  };

  const handleAdd = async () => {
    try {
      await createExperience({
        date_range: "2024 - Present",
        role: "New Role",
        company: "Company Name",
        location: "Location",
        tech_stack: "Tech1, Tech2, Tech3",
        description: "▸ Responsibility 1\n▸ Responsibility 2\n▸ Responsibility 3",
        order: experiences?.length || 0,
      });
      setStatus("Added!");
      refetch();
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      setStatus("Add failed.");
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset to 3 default experience cards? This will delete ALL current experiences!")) return;
    try {
      await resetExperiences();
      setStatus("Reset to defaults!");
      refetch();
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      setStatus("Reset failed.");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-white">Loading experiences...</div>;
  if (error) return <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-red-400">{error}</div>;

  return (
    <section
      id="experience"
      className="relative min-h-screen overflow-hidden bg-[#0a0e17] py-32"
    >
      <style>{circleGlowStyles}</style>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-16 h-px bg-orange-500" />
          <span className="text-xs font-mono tracking-[0.25em] uppercase text-cyan-400">
            EXPERIENCE
          </span>
        </div>

        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Where I've made
            <br />
            an impact
          </h2>
        </div>

        {/* Admin Add Button */}
        {adminMode && (
          <div className="mb-8 flex gap-4 items-center">
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-cyan-500 text-black font-semibold rounded hover:bg-cyan-400 transition-colors"
            >
              + Add Experience
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-orange-500 text-black font-semibold rounded hover:bg-orange-400 transition-colors"
            >
              Reset to 3 Defaults
            </button>
            {status && <span className="ml-4 text-cyan-300 text-sm">{status}</span>}
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line for timeline */}
          <div className="absolute left-[20px] top-0 bottom-0 w-px bg-cyan-500/20 hidden md:block" />

          {/* Experience Cards */}
          <div className="space-y-12">
            {experiences?.map((exp) => (
              <div key={exp.id} className="relative">
                {/* Arrow/Dot indicator */}
                <div className="circle-glow absolute left-[20px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-cyan-500/90 border border-cyan-500/50 z-20 hidden md:block" />

                {/* Card */}
                <div className="md:ml-32 group">
                  {editingId === exp.id && adminMode ? (
                    // Edit Mode
                    <div className="bg-slate-900/50 border-2 border-dashed border-cyan-400 rounded-lg p-6 space-y-4">
                      <input
                        value={editData.date_range ?? ""}
                        placeholder="Date Range (e.g., MAY 2025 - PRESENT)"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, date_range: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-cyan-400 text-sm font-mono outline-none focus:border-cyan-400"
                      />
                      <input
                        value={editData.role ?? ""}
                        placeholder="Role Title"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, role: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white text-xl font-bold outline-none focus:border-cyan-400"
                      />
                      <input
                        value={editData.company ?? ""}
                        placeholder="Company Name"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, company: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-gray-400 outline-none focus:border-cyan-400"
                      />
                      <input
                        value={editData.location ?? ""}
                        placeholder="Location"
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, location: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-gray-500 text-sm outline-none focus:border-cyan-400"
                      />
                      
                      {/* Tech Stack - Multiple inputs (max 5) */}
                      <div className="space-y-2">
                        <label className="text-cyan-400 text-sm font-semibold">Tech Stack (Max 5)</label>
                        {(() => {
                          const techs = editData.tech_stack ? editData.tech_stack.split(',').map(t => t.trim()) : [''];
                          const displayTechs = techs.length > 0 ? techs : [''];
                          
                          return displayTechs.map((tech, i) => (
                            <div key={i} className="flex gap-2">
                              <input
                                value={tech}
                                placeholder={`Technology ${i + 1}`}
                                onChange={(e) => {
                                  const newTechs = [...displayTechs];
                                  newTechs[i] = e.target.value;
                                  setEditData((d) => ({ 
                                    ...d, 
                                    tech_stack: newTechs.filter(t => t.trim()).join(', ')
                                  }));
                                }}
                                className="flex-1 p-2 rounded border border-white/20 bg-slate-900 text-cyan-300 text-sm outline-none focus:border-cyan-400"
                              />
                              {displayTechs.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newTechs = displayTechs.filter((_, idx) => idx !== i);
                                    setEditData((d) => ({ 
                                      ...d, 
                                      tech_stack: newTechs.filter(t => t.trim()).join(', ')
                                    }));
                                  }}
                                  className="px-3 py-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 text-sm"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ));
                        })()}
                        
                        {/* Add Tech Button */}
                        {(() => {
                          const techCount = editData.tech_stack ? editData.tech_stack.split(',').filter(t => t.trim()).length : 0;
                          return techCount < 5 && (
                            <button
                              type="button"
                              onClick={() => {
                                const current = editData.tech_stack || '';
                                const techs = current ? current.split(',').map(t => t.trim()) : [];
                                techs.push('');
                                setEditData((d) => ({ ...d, tech_stack: techs.join(', ') }));
                              }}
                              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 text-sm rounded hover:bg-cyan-500/30 border border-cyan-400/30"
                            >
                              + Add Tech ({techCount}/5)
                            </button>
                          );
                        })()}
                      </div>
                      
                      <textarea
                        value={editData.description ?? ""}
                        placeholder="Description (use ▸ for bullet points)"
                        rows={6}
                        onChange={(e) =>
                          setEditData((d) => ({ ...d, description: e.target.value }))
                        }
                        className="w-full p-2 rounded border border-white/20 bg-slate-900 text-white outline-none focus:border-cyan-400"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSave(exp.id)}
                          className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded hover:bg-cyan-400"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="bg-slate-900/60 border border-cyan-500/20 rounded-lg p-8 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
                      {/* Date Badge */}
                      <div className="text-xs font-mono tracking-[0.2em] uppercase text-cyan-400 mb-4">
                        {exp.date_range}
                      </div>

                      {/* Role & Company */}
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {exp.role}
                      </h3>
                      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <p className="text-gray-300 font-medium">{exp.company}</p>
                          {exp.location && (
                            <>
                              <span className="text-gray-600">•</span>
                              <p className="text-gray-500 text-sm">{exp.location}</p>
                            </>
                          )}
                        </div>
                        
                        {/* Tech Stack */}
                        {exp.tech_stack && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {exp.tech_stack.split(',').map((tech, i) => (
                              <span key={i} className="flex items-center gap-2">
                                <span className="text-cyan-400 text-sm font-medium px-3 py-1 bg-cyan-400/10 rounded-full border border-cyan-400/20">
                                  {tech.trim()}
                                </span>
                                {i < exp.tech_stack.split(',').length - 1 && (
                                  <span className="text-cyan-400/50">•</span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Description (bullet points) */}
                      <div className="space-y-3">
                        {exp.description?.split('\n').map((line, i) => (
                          <div key={i} className="flex items-start gap-3 text-gray-400 leading-relaxed">
                            {line.trim().startsWith('▸') ? (
                              <>
                                <span className="text-cyan-400 mt-1">▸</span>
                                <span>{line.replace('▸', '').trim()}</span>
                              </>
                            ) : (
                              <span className="pl-6">{line}</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Admin Edit and Delete Buttons */}
                      {adminMode && (
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => handleEdit(exp)}
                            className="px-4 py-2 border border-cyan-400/50 text-cyan-400 text-sm rounded hover:bg-cyan-400/10 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="px-4 py-2 border border-red-400/50 text-red-400 text-sm rounded hover:bg-red-400/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {(!experiences || experiences.length === 0) && !adminMode && (
          <div className="text-center py-20 text-gray-500">
            No experience entries yet.
          </div>
        )}
      </div>
    </section>
  );
}
