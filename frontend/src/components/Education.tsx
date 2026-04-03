import { useRef, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchEducation, createEducation, updateEducation, deleteEducation, resetEducation } from "../services/api";
import type { Education } from "../services/api";
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

export default function EducationSection({ adminMode = false }: { adminMode?: boolean }) {
  const { data: education, loading, error } = useFetch(fetchEducation);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef as React.RefObject<Element>);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Education>>({});
  const [status, setStatus] = useState<string>("");

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setEditData(edu);
  };

  const handleSave = async (id: number) => {
    try {
      await updateEducation(id, editData);
      setStatus("Education saved!");
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
    if (!window.confirm("Delete this education entry?")) return;
    try {
      await deleteEducation(id);
      setStatus("Education deleted!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Delete failed: ${e.message || "Unknown error"}`);
    }
  };

  const handleAddNew = async () => {
    try {
      const newEdu: Omit<Education, "id"> = {
        degree: "New Degree",
        institution: "University Name",
        location: "City, Country",
        duration: "2020 - 2024",
        description: "Description of your education...",
        skills: "Skill 1, Skill 2, Skill 3"
      };
      await createEducation(newEdu);
      setStatus("Education added!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Failed to add: ${e.message}`);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset to 2 default education entries?")) return;
    try {
      await resetEducation();
      setStatus("Education reset!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Reset failed: ${e.message}`);
    }
  };

  return (
    <section id="education" className="relative py-32 bg-[#060a10] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-rose-500/4 blur-[100px]" />
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
        <div className={`mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-rose-400" />
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-rose-400">Academic Background</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white">Education</h2>
          <p className="mt-4 text-gray-500 font-light max-w-md">
            My academic journey and qualifications.
          </p>
        </div>

        {/* Admin controls */}
        {adminMode && (
          <div className="mb-8 flex gap-3">
            <button onClick={handleAddNew} className="px-6 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all font-medium">
              + Add Education
            </button>
            <button onClick={handleReset} className="px-6 py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 hover:bg-orange-500/20 transition-all font-medium">
              Reset to 2 Defaults
            </button>
            {status && <div className="flex items-center px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">{status}</div>}
          </div>
        )}

        {/* Education timeline */}
        {loading ? (
          <SkeletonEducation />
        ) : error ? (
          <ErrorBlock message={error} />
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-rose-400/50 via-rose-400/20 to-transparent" />

            <div className="space-y-8">
              {(education ?? []).map((edu, i) => (
                <EducationCard
                  key={edu.id}
                  edu={edu}
                  index={i}
                  inView={inView}
                  adminMode={adminMode}
                  isEditing={editingId === edu.id}
                  editData={editData}
                  onEdit={() => handleEdit(edu)}
                  onSave={() => handleSave(edu.id)}
                  onCancel={handleCancel}
                  onDelete={() => handleDelete(edu.id)}
                  setEditData={setEditData}
                  isLast={i === (education?.length ?? 0) - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EducationCard({
  edu, index, inView, adminMode, isEditing, editData, onEdit, onSave, onCancel, onDelete, setEditData, isLast
}: {
  edu: Education;
  index: number;
  inView: boolean;
  adminMode: boolean;
  isEditing: boolean;
  editData: Partial<Education>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  setEditData: (data: Partial<Education>) => void;
  isLast: boolean;
}) {
  const current = isEditing ? { ...edu, ...editData } : edu;
  const skills = current.skills?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  return (
    <div
      className={`relative pl-16 md:pl-20 transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Timeline dot */}
      <div className="absolute left-4 md:left-6 top-6 w-4 h-4 rounded-full bg-rose-400 border-4 border-[#060a10] shadow-lg shadow-rose-400/30 z-10" />
      
      {/* Arrow connector */}
      {!isLast && (
        <div className="absolute left-[22px] md:left-[30px] top-10 text-rose-400/50">
          <svg width="12" height="40" viewBox="0 0 12 40" fill="none" className="hidden md:block">
            <path d="M6 0V35M6 35L1 30M6 35L11 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Card */}
      <div className={`group bg-white/[0.03] border border-white/8 rounded-xl p-6 hover:border-rose-400/25 hover:bg-white/[0.06] transition-all duration-500`}>
        <div className="absolute top-0 left-16 md:left-20 right-0 h-px bg-gradient-to-r from-rose-400/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {isEditing ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Degree</label>
              <input className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-rose-400/50 focus:outline-none" value={current.degree || ""} onChange={(e) => setEditData({ ...editData, degree: e.target.value })} placeholder="Degree Name" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Institution</label>
              <input className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-rose-400/50 focus:outline-none" value={current.institution || ""} onChange={(e) => setEditData({ ...editData, institution: e.target.value })} placeholder="University Name" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Location</label>
              <input className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-rose-400/50 focus:outline-none" value={current.location || ""} onChange={(e) => setEditData({ ...editData, location: e.target.value })} placeholder="City, Country" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Duration</label>
              <input className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-rose-400/50 focus:outline-none" value={current.duration || ""} onChange={(e) => setEditData({ ...editData, duration: e.target.value })} placeholder="2020 - 2024" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Description</label>
              <textarea className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-rose-400/50 focus:outline-none resize-none" value={current.description || ""} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Description..." rows={2} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Skills (comma-separated)</label>
              <input className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-rose-400/50 focus:outline-none" value={current.skills || ""} onChange={(e) => setEditData({ ...editData, skills: e.target.value })} placeholder="Python, ML, Research" />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button onClick={onSave} className="flex-1 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 font-semibold text-sm">Save</button>
              <button onClick={onCancel} className="flex-1 py-2 rounded-lg bg-gray-500/10 border border-gray-500/30 text-gray-300 hover:bg-gray-500/20 font-semibold text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">{current.degree}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-rose-400 font-medium">{current.institution}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {current.location}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full border border-rose-400/20 whitespace-nowrap">
                  {current.duration}
                </span>
                {adminMode && (
                  <div className="flex gap-1.5">
                    <button onClick={onEdit} className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-medium">Edit</button>
                    <button onClick={onDelete} className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-medium">Del</button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4">{current.description}</p>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-[10px] font-mono bg-rose-400/10 border border-rose-400/20 text-rose-300 rounded-full group-hover:border-rose-400/40 transition-all">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonEducation() {
  return (
    <div className="relative">
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-white/10" />
      <div className="space-y-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="relative pl-16 md:pl-20">
            <div className="absolute left-4 md:left-6 top-6 w-4 h-4 rounded-full bg-white/10" />
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-white/10 rounded w-1/2 mb-2" />
              <div className="h-4 bg-white/5 rounded w-1/3 mb-4" />
              <div className="h-4 bg-white/5 rounded w-3/4 mb-3" />
              <div className="flex gap-2">
                <div className="h-6 bg-white/5 rounded w-16" />
                <div className="h-6 bg-white/5 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
