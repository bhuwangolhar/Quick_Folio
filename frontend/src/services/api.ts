import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

export interface Profile {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  resume: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;
  github: string;
  live: string;
}

export interface Skill {
  id: number;
  name: string;
  level: string;
}

export interface Social {
  id: number;
  platform: string;
  url: string;
}

export const fetchProfile = () => api.get<Profile>("/profile").then((r) => r.data);
export const fetchProjects = () => api.get<Project[]>("/projects").then((r) => r.data);
export const fetchSkills = () => api.get<Skill[]>("/skills").then((r) => r.data);
export const fetchSocials = () => api.get<Social[]>("/socials").then((r) => r.data);