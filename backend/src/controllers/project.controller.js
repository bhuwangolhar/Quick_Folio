// project controller

const { Project } = require("../models");

exports.getProjects = async (req, res) => {
  try {
    let projects = await Project.findAll({ order: [["order", "ASC"]] });
    
    // Auto-create 3 default projects if none exist
    if (projects.length === 0) {
      const defaults = [
        {
          year: "2024",
          title: "E-Commerce Platform",
          description: "A full-stack e-commerce platform with real-time inventory management, payment integration, and admin dashboard. Built with modern technologies for optimal performance.",
          techStack: "React, Node.js, PostgreSQL, Stripe, Redis",
          media_type: "image",
          media_url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
          github: "https://github.com/yourusername/ecommerce",
          live: "https://ecommerce-demo.vercel.app",
          order: 0
        },
        {
          year: "2023",
          title: "Task Management App",
          description: "Collaborative task management application with real-time updates, team workspaces, and productivity analytics. Features drag-and-drop interface and automated workflows.",
          techStack: "Vue.js, Express, MongoDB, Socket.io",
          media_type: "image",
          media_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
          github: "https://github.com/yourusername/taskapp",
          live: "https://taskapp-demo.vercel.app",
          order: 1
        },
        {
          year: "2023",
          title: "AI Content Generator",
          description: "AI-powered content generation tool using OpenAI's GPT models. Supports multiple content types including blog posts, social media, and marketing copy with customizable tone and style.",
          techStack: "Next.js, TypeScript, OpenAI, TailwindCSS",
          media_type: "image",
          media_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
          github: "https://github.com/yourusername/ai-content",
          live: "https://ai-content-demo.vercel.app",
          order: 2
        }
      ];
      
      await Project.bulkCreate(defaults);
      projects = await Project.findAll({ order: [["order", "ASC"]] });
    }
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.update(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};

exports.resetProjects = async (req, res) => {
  try {
    // Delete all existing projects
    await Project.destroy({ where: {}, truncate: true });
    
    // Create 3 default projects
    const defaults = [
      {
        year: "2024",
        title: "E-Commerce Platform",
        description: "A full-stack e-commerce platform with real-time inventory management, payment integration, and admin dashboard. Built with modern technologies for optimal performance.",
        techStack: "React, Node.js, PostgreSQL, Stripe, Redis",
        media_type: "image",
        media_url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
        github: "https://github.com/yourusername/ecommerce",
        live: "https://ecommerce-demo.vercel.app",
        order: 0
      },
      {
        year: "2023",
        title: "Task Management App",
        description: "Collaborative task management application with real-time updates, team workspaces, and productivity analytics. Features drag-and-drop interface and automated workflows.",
        techStack: "Vue.js, Express, MongoDB, Socket.io",
        media_type: "image",
        media_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
        github: "https://github.com/yourusername/taskapp",
        live: "https://taskapp-demo.vercel.app",
        order: 1
      },
      {
        year: "2023",
        title: "AI Content Generator",
        description: "AI-powered content generation tool using OpenAI's GPT models. Supports multiple content types including blog posts, social media, and marketing copy with customizable tone and style.",
        techStack: "Next.js, TypeScript, OpenAI, TailwindCSS",
        media_type: "image",
        media_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        github: "https://github.com/yourusername/ai-content",
        live: "https://ai-content-demo.vercel.app",
        order: 2
      }
    ];
    
    const projects = await Project.bulkCreate(defaults);
    res.json({ message: "Projects reset to 3 defaults", projects });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset projects" });
  }
};