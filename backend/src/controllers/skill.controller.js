// skill controller

const { Skill } = require("../models");

exports.getSkills = async (req, res) => {
  try {
    let skills = await Skill.findAll({ order: [["order", "ASC"]] });
    
    // Auto-create 6 default skills if none exist
    if (skills.length === 0) {
      const defaults = [
        {
          name: "Machine Learning & AI",
          description: "Building intelligent systems with deep learning and neural networks",
          icon: "🧠",
          tools: "TensorFlow, PyTorch, Scikit-Learn, Deep Learning, Computer Vision, NLP",
          order: 0
        },
        {
          name: "Data Analytics & BI",
          description: "Transforming data into actionable insights with visualization",
          icon: "📊",
          tools: "Power BI, Tableau, SQL, Statistics, Excel, Data Visualization",
          order: 1
        },
        {
          name: "Backend & APIs",
          description: "Scalable server-side applications and RESTful services",
          icon: "⚡",
          tools: "Python, Flask, Streamlit, REST APIs, Node.js, Express",
          order: 2
        },
        {
          name: "Databases",
          description: "Designing and managing relational and NoSQL databases",
          icon: "💾",
          tools: "MySQL, PostgreSQL, MongoDB, SQL, NoSQL",
          order: 3
        },
        {
          name: "DevOps & Cloud",
          description: "Deploying and scaling applications on cloud platforms",
          icon: "🚀",
          tools: "Docker, Oracle Cloud, Git, CI/CD, AWS, Azure",
          order: 4
        },
        {
          name: "AI Tools & Models",
          description: "Working with cutting-edge AI models and frameworks",
          icon: "🤖",
          tools: "GPT-4, Claude, LangChain, Chatbots, LLVM, OpenAI",
          order: 5
        }
      ];
      
      await Skill.bulkCreate(defaults);
      skills = await Skill.findAll({ order: [["order", "ASC"]] });
    }
    
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const deleted = await Skill.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    await skill.update(req.body);
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetSkills = async (req, res) => {
  try {
    // Delete all existing skills
    await Skill.destroy({ where: {}, truncate: true });
    
    // Create 6 default skills
    const defaults = [
      {
        name: "Machine Learning & AI",
        description: "Building intelligent systems with deep learning and neural networks",
        icon: "🧠",
        tools: "TensorFlow, PyTorch, Scikit-Learn, Deep Learning, Computer Vision, NLP",
        order: 0
      },
      {
        name: "Data Analytics & BI",
        description: "Transforming data into actionable insights with visualization",
        icon: "📊",
        tools: "Power BI, Tableau, SQL, Statistics, Excel, Data Visualization",
        order: 1
      },
      {
        name: "Backend & APIs",
        description: "Scalable server-side applications and RESTful services",
        icon: "⚡",
        tools: "Python, Flask, Streamlit, REST APIs, Node.js, Express",
        order: 2
      },
      {
        name: "Databases",
        description: "Designing and managing relational and NoSQL databases",
        icon: "💾",
        tools: "MySQL, PostgreSQL, MongoDB, SQL, NoSQL",
        order: 3
      },
      {
        name: "DevOps & Cloud",
        description: "Deploying and scaling applications on cloud platforms",
        icon: "🚀",
        tools: "Docker, Oracle Cloud, Git, CI/CD, AWS, Azure",
        order: 4
      },
      {
        name: "AI Tools & Models",
        description: "Working with cutting-edge AI models and frameworks",
        icon: "🤖",
        tools: "GPT-4, Claude, LangChain, Chatbots, LLVM, OpenAI",
        order: 5
      }
    ];
    
    const skills = await Skill.bulkCreate(defaults);
    res.json({ message: "Skills reset to 6 defaults", skills });
  } catch (error) {
    console.error("Reset skills error:", error);
    res.status(500).json({ error: error.message });
  }
};