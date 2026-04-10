import { useRef, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchSkills, createSkill, updateSkill, deleteSkill, resetSkills } from "../services/api";
import type { Skill } from "../services/api";
import { SkeletonSkills, ErrorBlock } from "./Loader";

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

export default function Skills({ adminMode = false }: { adminMode?: boolean }) {
  const { data: skills, loading, error } = useFetch(fetchSkills);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef as React.RefObject<Element>);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Skill>>({});
  const [status, setStatus] = useState<string>("");

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setEditData(skill);
  };

  const handleSave = async (id: number) => {
    try {
      await updateSkill(id, editData);
      setStatus("Skill saved!");
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
    if (!window.confirm("Delete this skill?")) return;
    try {
      await deleteSkill(id);
      setStatus("Skill deleted!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Delete failed: ${e.message || "Unknown error"}`);
    }
  };

  const handleAddNew = async () => {
    try {
      const newSkill: Omit<Skill, "id"> = {
        name: "New Skill",
        description: "Skill description here...",
        icon: "💡",
        tools: "Tool 1, Tool 2, Tool 3"
      };
      await createSkill(newSkill);
      setStatus("Skill added!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Failed to add skill: ${e.message}`);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset to 6 default skills? This will delete all existing skills!")) return;
    try {
      await resetSkills();
      setStatus("Skills reset!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Reset failed: ${e.message}`);
    }
  };

  return (
    <section id="skills" className="relative py-32 bg-[#0a0e17] overflow-hidden">
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

      <div className="max-w-[1600px] mx-auto px-8" ref={sectionRef}>
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-violet-400" />
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-violet-400">Expertise</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Skills of the trade
          </h2>
        </div>

        {/* Admin controls */}
        {adminMode && (
          <div className="mb-8 flex gap-3">
            <button
              onClick={handleAddNew}
              className="px-6 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 font-medium"
            >
              + Add New Skill
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 hover:bg-orange-500/20 transition-all duration-300 font-medium"
            >
              Reset to 6 Defaults
            </button>
            {status && (
              <div className="flex items-center px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm">
                {status}
              </div>
            )}
          </div>
        )}

        {/* Skills grid */}
        {loading ? (
          <SkeletonSkills />
        ) : error ? (
          <ErrorBlock message={error} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(skills ?? []).map((skill, i) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                index={i}
                inView={inView}
                adminMode={adminMode}
                isEditing={editingId === skill.id}
                editData={editData}
                onEdit={() => handleEdit(skill)}
                onSave={() => handleSave(skill.id)}
                onCancel={handleCancel}
                onDelete={() => handleDelete(skill.id)}
                setEditData={setEditData}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// SkillCard component
function SkillCard({
  skill,
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
  skill: Skill;
  index: number;
  inView: boolean;
  adminMode: boolean;
  isEditing: boolean;
  editData: Partial<Skill>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  setEditData: (data: Partial<Skill>) => void;
}) {
  const current = isEditing ? { ...skill, ...editData } : skill;
  const tools = current.tools?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  const handleToolChange = (idx: number, value: string) => {
    const editTools = current.tools?.split(",").map((t) => t.trim()) ?? [];
    const updatedTools = [...editTools];
    updatedTools[idx] = value;
    setEditData({ ...editData, tools: updatedTools.filter(Boolean).join(", ") });
  };

  const handleAddTool = () => {
    const editTools = current.tools?.split(",").map((t) => t.trim()) ?? [];
    if (editTools.length < 10) {
      const updatedTools = [...editTools, ''];
      setEditData({ ...editData, tools: updatedTools.join(', ') });
    }
  };

  const handleRemoveTool = (idx: number) => {
    const editTools = current.tools?.split(",").map((t) => t.trim()) ?? [];
    const updatedTools = editTools.filter((_, i) => i !== idx);
    setEditData({ ...editData, tools: updatedTools.join(", ") });
  };

  return (
    <div
      className={`relative group flex flex-col bg-slate-900/60 border border-cyan-500/20 rounded-xl overflow-hidden p-6
        hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Icon (emoji)</label>
            <input
              className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white text-2xl focus:border-violet-400/50 focus:outline-none"
              value={current.icon || ""}
              onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
              placeholder="🧠"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Skill Name</label>
            <input
              className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white font-semibold focus:border-violet-400/50 focus:outline-none"
              value={current.name || ""}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Skill Name"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white text-sm focus:border-violet-400/50 focus:outline-none resize-none"
              value={current.description || ""}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Skill description..."
              rows={2}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">Tools/Stack (Max 10)</label>
            <div className="space-y-2">
              {(() => {
                const editTools = current.tools?.split(",").map((t) => t.trim()) ?? [];
                return editTools.map((tool, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className="flex-1 p-2 rounded-lg border border-white/20 bg-slate-900 text-white text-sm focus:border-violet-400/50 focus:outline-none"
                      value={tool}
                      onChange={(e) => handleToolChange(idx, e.target.value)}
                      placeholder={`Tool ${idx + 1}`}
                    />
                    {editTools.length > 1 && (
                      <button type="button" onClick={() => handleRemoveTool(idx)} className="px-2.5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm">
                        ✕
                      </button>
                    )}
                  </div>
                ));
              })()}
              {(() => {
                const editTools = current.tools?.split(",").map((t) => t.trim()) ?? [];
                return editTools.length < 10 && (
                  <button type="button" onClick={handleAddTool} className="w-full py-2 rounded-lg border border-dashed border-violet-500/30 text-violet-400 hover:bg-violet-500/5 text-xs font-medium">
                    + Add Tool ({editTools.length}/10)
                  </button>
                );
              })()}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={onSave} className="flex-1 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 font-semibold text-sm">
              Save
            </button>
            <button onClick={onCancel} className="flex-1 py-2 rounded-lg bg-gray-500/10 border border-gray-500/30 text-gray-300 hover:bg-gray-500/20 font-semibold text-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">{current.icon || "💡"}</div>
            {adminMode && (
              <div className="flex gap-1.5">
                <button onClick={onEdit} className="px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 text-xs font-medium">
                  Edit
                </button>
                <button onClick={onDelete} className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-medium">
                  Del
                </button>
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors duration-300 mb-2">
            {current.name}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed font-light mb-4">
            {current.description}
          </p>
          {tools.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, idx) => (
                <span key={idx} className="px-2.5 py-1 text-[10px] font-mono tracking-wider bg-violet-400/10 border border-violet-400/20 text-violet-300 rounded group-hover:border-violet-400/40 transition-all">
                  {tool}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SkeletonSkills() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl p-6 animate-pulse">
          <div className="w-12 h-12 bg-white/10 rounded-lg mb-4" />
          <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-4 bg-white/5 rounded w-full mb-4" />
          <div className="flex gap-2">
            <div className="h-6 bg-white/5 rounded w-16" />
            <div className="h-6 bg-white/5 rounded w-20" />
            <div className="h-6 bg-white/5 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}