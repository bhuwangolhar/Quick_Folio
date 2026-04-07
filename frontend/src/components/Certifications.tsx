import { useRef, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { fetchCertifications, createCertification, updateCertification, deleteCertification, resetCertifications } from "../services/api";
import type { Certification } from "../services/api";
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

function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  
  // Randomly shuffle items with same order
  const grouped = new Map<number, T[]>();
  sorted.forEach(item => {
    const order = item.order ?? 0;
    if (!grouped.has(order)) grouped.set(order, []);
    grouped.get(order)!.push(item);
  });
  
  const result: T[] = [];
  grouped.forEach(group => {
    result.push(...group.sort(() => Math.random() - 0.5));
  });
  return result;
}

export default function Certifications({ adminMode = false }: { adminMode?: boolean }) {
  const { data: certs, loading, error } = useFetch(fetchCertifications);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef as React.RefObject<Element>);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Certification>>({});
  const [status, setStatus] = useState<string>("");

  const handleEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setEditData(cert);
  };

  const handleSave = async (id: number) => {
    try {
      await updateCertification(id, editData);
      setStatus("Certification saved!");
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
    if (!window.confirm("Delete this certification?")) return;
    try {
      await deleteCertification(id);
      setStatus("Certification deleted!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Delete failed: ${e.message || "Unknown error"}`);
    }
  };

  const handleAddNew = async () => {
    try {
      const newCert: Omit<Certification, "id"> = {
        name: "New Certification",
        provider: "Provider Name",
        year: new Date().getFullYear().toString(),
        description: "Certification description...",
        tools: "Tool 1, Tool 2",
        credential_url: "https://example.com/credential",
        order: 1
      };
      await createCertification(newCert);
      setStatus("Certification added!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Failed to add: ${e.message}`);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset to 3 default certifications?")) return;
    try {
      await resetCertifications();
      setStatus("Certifications reset!");
      window.location.reload();
    } catch (e: any) {
      setStatus(`Reset failed: ${e.message}`);
    }
  };

  return (
    <section id="certifications" className="relative py-32 bg-[#0a0e17] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/4 blur-[100px]" />
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
            <div className="w-8 h-px bg-emerald-400" />
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-emerald-400">Credentials</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white">Certifications</h2>
        </div>

        {/* Admin controls */}
        {adminMode && (
          <div className="mb-8 flex gap-3">
            <button onClick={handleAddNew} className="px-6 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all font-medium">
              + Add Certification
            </button>
            <button onClick={handleReset} className="px-6 py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 hover:bg-orange-500/20 transition-all font-medium">
              Reset to 3 Defaults
            </button>
            {status && <div className="flex items-center px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">{status}</div>}
          </div>
        )}

        {/* Certifications list */}
        {loading ? (
          <SkeletonCerts />
        ) : error ? (
          <ErrorBlock message={error} />
        ) : (
          <div className="space-y-4">
            {sortByOrder(certs ?? []).map((cert, i) => (
              <CertCard
                key={cert.id}
                cert={cert}
                index={i}
                inView={inView}
                adminMode={adminMode}
                isEditing={editingId === cert.id}
                editData={editData}
                onEdit={() => handleEdit(cert)}
                onSave={() => handleSave(cert.id)}
                onCancel={handleCancel}
                onDelete={() => handleDelete(cert.id)}
                setEditData={setEditData}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CertCard({
  cert, index, inView, adminMode, isEditing, editData, onEdit, onSave, onCancel, onDelete, setEditData
}: {
  cert: Certification;
  index: number;
  inView: boolean;
  adminMode: boolean;
  isEditing: boolean;
  editData: Partial<Certification>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  setEditData: (data: Partial<Certification>) => void;
}) {
  const current = isEditing ? { ...cert, ...editData } : cert;
  const tools = current.tools?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  return (
    <div
      className={`group relative bg-slate-900/60 border border-cyan-500/20 rounded-xl p-6
        hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {isEditing ? (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Certificate Name</label>
            <input className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-emerald-400/50 focus:outline-none" value={current.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder="Certificate Name" />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Provider</label>
            <input className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-emerald-400/50 focus:outline-none" value={current.provider || ""} onChange={(e) => setEditData({ ...editData, provider: e.target.value })} placeholder="Provider Name" />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Year</label>
            <input className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-emerald-400/50 focus:outline-none" value={current.year || ""} onChange={(e) => setEditData({ ...editData, year: e.target.value })} placeholder="2024" />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Credential URL</label>
            <input className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-emerald-400/50 focus:outline-none" value={current.credential_url || ""} onChange={(e) => setEditData({ ...editData, credential_url: e.target.value })} placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Description</label>
            <textarea className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-emerald-400/50 focus:outline-none resize-none" value={current.description || ""} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Description..." rows={2} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Tools (comma-separated)</label>
            <input className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-emerald-400/50 focus:outline-none" value={current.tools || ""} onChange={(e) => setEditData({ ...editData, tools: e.target.value })} placeholder="AWS, Python, ML" />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Display Order</label>
            <select className="w-full p-2 rounded-lg border border-white/20 bg-slate-900 text-white focus:border-emerald-400/50 focus:outline-none cursor-pointer" value={current.order || 1} onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) })}>
              {[...Array(9)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button onClick={onSave} className="flex-1 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 font-semibold text-sm">Save</button>
            <button onClick={onCancel} className="flex-1 py-2 rounded-lg bg-gray-500/10 border border-gray-500/30 text-gray-300 hover:bg-gray-500/20 font-semibold text-sm">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {/* Left: Icon */}
          <div className="w-12 h-12 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-2xl flex-shrink-0">
            🏆
          </div>
          
          {/* Middle: Content */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">{current.name}</h3>
            <div className="flex items-center gap-3 mb-2">
              <p className="text-sm text-gray-400">{current.provider}</p>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{current.year}</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">{current.description}</p>
            {tools.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tools.map((tool, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[10px] font-mono bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 rounded">
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-start gap-2 flex-shrink-0">
            {current.credential_url && (
              <a href={current.credential_url} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 hover:bg-emerald-400/20 text-xs font-mono transition-all">
                View Credential →
              </a>
            )}
            {adminMode && (
              <>
                <button onClick={onEdit} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-medium">Edit</button>
                <button onClick={onDelete} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-medium">Del</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonCerts() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl p-6 animate-pulse">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg" />
            <div className="flex-1">
              <div className="h-5 bg-white/10 rounded w-1/3 mb-2" />
              <div className="h-4 bg-white/5 rounded w-1/4 mb-2" />
              <div className="h-4 bg-white/5 rounded w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
