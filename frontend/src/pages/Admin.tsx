import { useEffect, useState } from "react";
import {
  createProject,
  createSkill,
  createSocial,
  deleteProject,
  deleteSkill,
  deleteSocial,
  fetchProfile,
  fetchProjects,
  fetchSkills,
  fetchSocials,
  updateProfile,
} from "../services/api";
import type { Project, Profile, Skill, Social } from "../services/api";
import { useFetch } from "../hooks/useFetch";

const ADMIN_KEY = "quickfolio-admin-secret";
const QUERY_KEY = new URLSearchParams(window.location.search).get("admin_key");

export default function Admin() {
  const { data: profile, loading: profileLoading, error: profileError } = useFetch(fetchProfile);
  const { data: projects } = useFetch(fetchProjects);
  const { data: skills } = useFetch(fetchSkills);
  const { data: socials } = useFetch(fetchSocials);

  const [profileForm, setProfileForm] = useState<Partial<Profile>>({});
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({ title: "", description: "", techStack: "", github: "", live: "" });
  const [newSkill, setNewSkill] = useState<Omit<Skill, "id">>({ name: "", level: "" });
  const [newSocial, setNewSocial] = useState<Omit<Social, "id">>({ platform: "", url: "" });
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name,
        role: profile.role,
        bio: profile.bio,
        avatar: profile.avatar,
        resume: profile.resume,
      });
    }
  }, [profile]);

  if (QUERY_KEY !== ADMIN_KEY) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
        <p>Please open using the secret link: <code>/?admin_key={ADMIN_KEY}</code></p>
      </div>
    );
  }

  const handleProfileSave = async () => {
    try {
      console.log("Saving profile:", profileForm);
      await updateProfile(profileForm);
      setStatus("Profile saved successfully.");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.response?.data?.message || error?.message || "Unknown error";
      const details = error?.response?.data?.details || "";
      setStatus(`Profile save failed: ${errorMsg}${details ? " - " + details : ""}`);
      console.error("Profile save error:", error);
      console.error("Error response:", error?.response);
    }
  };

  const handleCreateProject = async () => {
    try {
      await createProject(newProject);
      setStatus("Project added.");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || "Unknown error";
      setStatus(`Failed to add project: ${errorMsg}`);
      console.error("Create project error:", error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject(id);
      setStatus("Project deleted.");
      window.location.reload();
    } catch (error) {
      setStatus("Failed to delete project.");
    }
  };

  const handleCreateSkill = async () => {
    try {
      await createSkill(newSkill);
      setStatus("Skill added.");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || "Unknown error";
      setStatus(`Failed to add skill: ${errorMsg}`);
      console.error("Create skill error:", error);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    try {
      await deleteSkill(id);
      setStatus("Skill deleted.");
      window.location.reload();
    } catch (error) {
      setStatus("Failed to delete skill.");
    }
  };

  const handleCreateSocial = async () => {
    try {
      await createSocial(newSocial);
      setStatus("Social added.");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || "Unknown error";
      setStatus(`Failed to add social: ${errorMsg}`);
      console.error("Create social error:", error);
    }
  };

  const handleDeleteSocial = async (id: number) => {
    try {
      await deleteSocial(id);
      setStatus("Social deleted.");
      window.location.reload();
    } catch (error) {
      setStatus("Failed to delete social.");
    }
  };

  return (
    <div className="bg-[#0b1220] text-white min-h-screen p-6 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Admin edit</h1>
        <a href="/" className="text-sm text-cyan-300">Go to public view</a>
      </div>

      <p className="text-xs text-cyan-200">Secret edit URL: <code>{window.location.origin}/?admin_key={ADMIN_KEY}</code></p>

      <div className="space-y-6">
        <section className="border border-slate-700 p-4 rounded">
          <h2 className="font-semibold text-xl mb-3">Profile</h2>
          {profileLoading ? <p>loading...</p> : profileError ? <p>{profileError}</p> : null}
          <input value={profileForm.name ?? ""} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Name" />
          <input value={profileForm.role ?? ""} onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Role" />
          <textarea value={profileForm.bio ?? ""} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Bio" rows={3} />
          <input value={profileForm.avatar ?? ""} onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Avatar URL" />
          <input value={profileForm.resume ?? ""} onChange={(e) => setProfileForm({ ...profileForm, resume: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Resume URL" />
          <button onClick={handleProfileSave} className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400">Save profile</button>
        </section>

        <section className="border border-slate-700 p-4 rounded">
          <h2 className="font-semibold text-xl mb-3">Create project</h2>
          <input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Project title" />
          <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Description" rows={2} />
          <input value={newProject.techStack} onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Tech stack (comma separated)" />
          <input value={newProject.github} onChange={(e) => setNewProject({ ...newProject, github: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="GitHub URL" />
          <input value={newProject.live} onChange={(e) => setNewProject({ ...newProject, live: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Live URL" />
          <button onClick={handleCreateProject} className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400">Add project</button>
          <div className="mt-4">
            {(projects || []).map((project) => (
              <div key={project.id} className="flex justify-between items-center p-2 bg-slate-900 mb-2 rounded">
                <span className="text-sm">{project.title}</span>
                <button onClick={() => handleDeleteProject(project.id)} className="text-red-300 hover:text-red-400 text-xs">Delete</button>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-slate-700 p-4 rounded">
          <h2 className="font-semibold text-xl mb-3">Skills</h2>
          <input value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Skill name" />
          <input value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Level" />
          <button onClick={handleCreateSkill} className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400">Add skill</button>
          <div className="mt-4">{(skills || []).map((skill) => (
            <div key={skill.id} className="flex justify-between items-center p-2 bg-slate-900 mb-2 rounded">
              <span className="text-sm">{skill.name} - {skill.level}</span>
              <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-300 hover:text-red-400 text-xs">Delete</button>
            </div>
          ))}
          </div>
        </section>

        <section className="border border-slate-700 p-4 rounded">
          <h2 className="font-semibold text-xl mb-3">Socials</h2>
          <input value={newSocial.platform} onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="Platform" />
          <input value={newSocial.url} onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })} className="w-full mb-2 p-2 rounded bg-slate-800" placeholder="URL" />
          <button onClick={handleCreateSocial} className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400">Add social</button>
          <div className="mt-4">{(socials || []).map((social) => (
            <div key={social.id} className="flex justify-between items-center p-2 bg-slate-900 mb-2 rounded">
              <span className="text-sm">{social.platform}: {social.url}</span>
              <button onClick={() => handleDeleteSocial(social.id)} className="text-red-300 hover:text-red-400 text-xs">Delete</button>
            </div>
          ))}</div>
        </section>
      </div>

      <p className="text-sm text-red-400 mt-2">{status}</p>
    </div>
  );
}
