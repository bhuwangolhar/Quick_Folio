// education controller

const { Education } = require("../models");

exports.getEducation = async (req, res) => {
  try {
    let education = await Education.findAll({ order: [["order", "ASC"]] });
    
    // Auto-create 2 default education entries if none exist
    if (education.length === 0) {
      const defaults = [
        {
          degree: "Master of Science in Computer Science",
          institution: "Stanford University",
          location: "Stanford, CA",
          duration: "2022 - 2024",
          description: "Specialized in Machine Learning and Artificial Intelligence. Thesis on deep learning optimization techniques.",
          skills: "Machine Learning, Deep Learning, Python, Research",
          order: 0
        },
        {
          degree: "Bachelor of Technology in Computer Science",
          institution: "Indian Institute of Technology",
          location: "Mumbai, India",
          duration: "2018 - 2022",
          description: "Graduated with honors. Focus on software engineering and data structures. Active member of coding club.",
          skills: "Data Structures, Algorithms, Java, Web Development",
          order: 1
        }
      ];
      
      await Education.bulkCreate(defaults);
      education = await Education.findAll({ order: [["order", "ASC"]] });
    }
    
    res.json(education);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEducation = async (req, res) => {
  try {
    const edu = await Education.create(req.body);
    res.json(edu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const edu = await Education.findByPk(req.params.id);
    if (!edu) {
      return res.status(404).json({ message: "Education not found" });
    }
    await edu.update(req.body);
    res.json(edu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const deleted = await Education.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Education not found" });
    }
    res.json({ message: "Education deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetEducation = async (req, res) => {
  try {
    await Education.destroy({ where: {}, truncate: true });
    
    const defaults = [
      {
        degree: "Master of Science in Computer Science",
        institution: "Stanford University",
        location: "Stanford, CA",
        duration: "2022 - 2024",
        description: "Specialized in Machine Learning and Artificial Intelligence. Thesis on deep learning optimization techniques.",
        skills: "Machine Learning, Deep Learning, Python, Research",
        order: 0
      },
      {
        degree: "Bachelor of Technology in Computer Science",
        institution: "Indian Institute of Technology",
        location: "Mumbai, India",
        duration: "2018 - 2022",
        description: "Graduated with honors. Focus on software engineering and data structures. Active member of coding club.",
        skills: "Data Structures, Algorithms, Java, Web Development",
        order: 1
      }
    ];
    
    const education = await Education.bulkCreate(defaults);
    res.json({ message: "Education reset to 2 defaults", education });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
