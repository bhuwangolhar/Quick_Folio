import axios, { AxiosError } from "axios";

// Use environment variable for API URL (dev fallback to localhost only)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Track retry attempts per request
const retryConfig = new WeakMap<any, number>();

// Add admin key to requests when present in URL (key is passed through, not hardcoded)
api.interceptors.request.use((config) => {
  const queryKey = new URLSearchParams(window.location.search).get("admin_key");
  if (queryKey) {
    config.params = { ...config.params, admin_key: queryKey };
  }
  return config;
});

// Auto-retry failed requests (for backend warmup)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    // Get current retry count
    const retryCount = retryConfig.get(config) || 0;
    const maxRetries = 10;
    const retryDelay = 3000;

    // Retry on network errors or 5xx server errors
    const shouldRetry =
      (error.code === "ECONNABORTED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ECONNREFUSED" ||
        error.response?.status === 503 ||
        error.response?.status === 502 ||
        error.response?.status === 500) &&
      retryCount < maxRetries;

    if (shouldRetry) {
      retryConfig.set(config, retryCount + 1);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return api(config);
    }

    // Only log errors in development
    if (import.meta.env.DEV) {
      console.error("API Error:", error.response?.status, error.message);
    }

    return Promise.reject(error);
  }
);

export interface Profile {
  id: number;
  name: string;
  role: string;
  bio: string;
  contact_bio: string;
  avatar: string;
  resume: string;
}

export interface Project {
  id: number;
  year: string;
  title: string;
  description: string;
  techStack: string; // comma-separated
  media_type: string; // "image" or "video"
  media_url: string;
  github: string;
  live: string;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
  icon: string; // emoji or image URL
  tools: string; // comma-separated
}

export interface Social {
  id: number;
  platform: string;
  url: string;
}

export interface About {
  id: number;
  section: string;
  heading: string;
  subtitle: string;
  description: string;
  code_filename: string;
  code_content: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
  stat4_value: string;
  stat4_label: string;
}

export const fetchProfile = () => api.get<Profile>("/profile").then((r) => r.data);
export const updateProfile = (profile: Partial<Profile>) => api.post<Profile>("/profile", profile).then((r) => r.data);

export const fetchProjects = () => api.get<Project[]>("/projects").then((r) => r.data);
export const createProject = (project: Omit<Project, "id">) => api.post<Project>("/projects", project).then((r) => r.data);
export const updateProject = (id: number, project: Partial<Project>) => api.put<Project>(`/projects/${id}`, project).then((r) => r.data);
export const deleteProject = (id: number) => api.delete(`/projects/${id}`).then((r) => r.data);
export const resetProjects = () => api.post("/projects/reset").then((r) => r.data);

export const fetchSkills = () => api.get<Skill[]>("/skills").then((r) => r.data);
export const createSkill = (skill: Omit<Skill, "id">) => api.post<Skill>("/skills", skill).then((r) => r.data);
export const updateSkill = (id: number, skill: Partial<Skill>) => api.put<Skill>(`/skills/${id}`, skill).then((r) => r.data);
export const deleteSkill = (id: number) => api.delete(`/skills/${id}`).then((r) => r.data);
export const resetSkills = () => api.post("/skills/reset").then((r) => r.data);

export const fetchSocials = () => api.get<Social[]>("/socials").then((r) => r.data);
export const createSocial = (social: Omit<Social, "id">) => api.post<Social>("/socials", social).then((r) => r.data);
export const updateSocial = (id: number, social: Partial<Social>) => api.put<Social>(`/socials/${id}`, social).then((r) => r.data);
export const deleteSocial = (id: number) => api.delete(`/socials/${id}`).then((r) => r.data);

export const fetchAbout = () => api.get<About>("/about").then((r) => r.data);
export const updateAbout = (about: Partial<About>) => api.post<About>("/about", about).then((r) => r.data);

export interface Experience {
  id: number;
  date_range: string;
  role: string;
  company: string;
  location: string;
  tech_stack: string;
  description: string;
  order: number;
}

export const fetchExperiences = () => api.get<Experience[]>("/experiences").then((r) => r.data);
export const createExperience = (exp: Omit<Experience, "id">) => api.post<Experience>("/experiences", exp).then((r) => r.data);
export const updateExperience = (id: number, exp: Partial<Experience>) => api.put<Experience>(`/experiences/${id}`, exp).then((r) => r.data);
export const deleteExperience = (id: number) => api.delete(`/experiences/${id}`).then((r) => r.data);
export const resetExperiences = () => api.post("/experiences/reset").then((r) => r.data);

// Certifications
export interface Certification {
  id: number;
  name: string;
  provider: string;
  year: string;
  description: string;
  tools: string; // comma-separated
  credential_url: string;
  order: number;
}

export const fetchCertifications = () => api.get<Certification[]>("/certifications").then((r) => r.data);
export const createCertification = (cert: Omit<Certification, "id">) => api.post<Certification>("/certifications", cert).then((r) => r.data);
export const updateCertification = (id: number, cert: Partial<Certification>) => api.put<Certification>(`/certifications/${id}`, cert).then((r) => r.data);
export const deleteCertification = (id: number) => api.delete(`/certifications/${id}`).then((r) => r.data);
export const resetCertifications = () => api.post("/certifications/reset").then((r) => r.data);

// Education
export interface Education {
  id: number;
  degree: string;
  institution: string;
  grade: string;
  location: string;
  duration: string;
  description: string;
  skills: string; // comma-separated
  order: number;
}

export const fetchEducation = () => api.get<Education[]>("/education").then((r) => r.data);
export const createEducation = (edu: Omit<Education, "id">) => api.post<Education>("/education", edu).then((r) => r.data);
export const updateEducation = (id: number, edu: Partial<Education>) => api.put<Education>(`/education/${id}`, edu).then((r) => r.data);
export const deleteEducation = (id: number) => api.delete(`/education/${id}`).then((r) => r.data);
export const resetEducation = () => api.post("/education/reset").then((r) => r.data);