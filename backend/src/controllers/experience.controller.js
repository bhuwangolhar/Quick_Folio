const Experience = require("../models/experience.model");

exports.getAllExperiences = async (req, res) => {
  try {
    let experiences = await Experience.findAll({ order: [["order", "ASC"]] });
    
    // Auto-create 3 default experiences if none exist
    if (experiences.length === 0) {
      const defaults = [
        {
          date_range: "JAN 2025 - PRESENT",
          role: "Senior Full Stack Developer",
          company: "Tech Company Inc.",
          location: "San Francisco, CA",
          tech_stack: "Node.js, React, TypeScript, PostgreSQL, AWS",
          description: "▸ Led development of scalable microservices architecture\n▸ Mentored junior developers and conducted code reviews\n▸ Improved application performance by 40%",
          order: 0,
        },
        {
          date_range: "MAR 2023 - DEC 2024",
          role: "Full Stack Developer",
          company: "Startup Solutions",
          location: "Remote",
          tech_stack: "Express, MongoDB, React, Docker",
          description: "▸ Built RESTful APIs using Node.js and Express\n▸ Developed responsive frontends with React and TypeScript\n▸ Implemented CI/CD pipelines with GitHub Actions",
          order: 1,
        },
        {
          date_range: "JUN 2022 - FEB 2023",
          role: "Software Engineer Intern",
          company: "Innovation Labs",
          location: "New York, NY",
          tech_stack: "Python, Django, JavaScript, MySQL",
          description: "▸ Collaborated with cross-functional teams on product features\n▸ Wrote unit tests achieving 85% code coverage\n▸ Participated in agile development sprints",
          order: 2,
        },
      ];
      
      await Experience.bulkCreate(defaults);
      experiences = await Experience.findAll({ order: [["order", "ASC"]] });
    }
    
    res.json(experiences);
  } catch (err) {
    console.error("Get experiences error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.json(experience);
  } catch (err) {
    console.error("Create experience error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findByPk(id);
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }
    await experience.update(req.body);
    res.json(experience);
  } catch (err) {
    console.error("Update experience error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Delete request for experience ID:", id);
    console.log("Admin key from query:", req.query.admin_key);
    console.log("Admin key from header:", req.headers["x-admin-key"]);
    
    const experience = await Experience.findByPk(id);
    if (!experience) {
      console.log("Experience not found:", id);
      return res.status(404).json({ error: "Experience not found" });
    }
    
    await experience.destroy();
    console.log("Experience deleted successfully:", id);
    res.json({ message: "Experience deleted" });
  } catch (err) {
    console.error("Delete experience error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.resetExperiences = async (req, res) => {
  try {
    // Delete all existing experiences
    await Experience.destroy({ where: {} });
    
    // Create 3 default experiences
    const defaults = [
      {
        date_range: "JAN 2025 - PRESENT",
        role: "Senior Full Stack Developer",
        company: "Tech Company Inc.",
        location: "San Francisco, CA",
        tech_stack: "Node.js, React, TypeScript, PostgreSQL, AWS",
        description: "▸ Led development of scalable microservices architecture\n▸ Mentored junior developers and conducted code reviews\n▸ Improved application performance by 40%",
        order: 0,
      },
      {
        date_range: "MAR 2023 - DEC 2024",
        role: "Full Stack Developer",
        company: "Startup Solutions",
        location: "Remote",
        tech_stack: "Express, MongoDB, React, Docker",
        description: "▸ Built RESTful APIs using Node.js and Express\n▸ Developed responsive frontends with React and TypeScript\n▸ Implemented CI/CD pipelines with GitHub Actions",
        order: 1,
      },
      {
        date_range: "JUN 2022 - FEB 2023",
        role: "Software Engineer Intern",
        company: "Innovation Labs",
        location: "New York, NY",
        tech_stack: "Python, Django, JavaScript, MySQL",
        description: "▸ Collaborated with cross-functional teams on product features\n▸ Wrote unit tests achieving 85% code coverage\n▸ Participated in agile development sprints",
        order: 2,
      },
    ];
    
    const experiences = await Experience.bulkCreate(defaults);
    res.json({ message: "Experiences reset to defaults", experiences });
  } catch (err) {
    console.error("Reset experiences error:", err);
    res.status(500).json({ error: err.message });
  }
};
