const About = require("../models/about.model");

exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    // Create default data if none exists
    if (!about) {
      about = await About.create({
        section: "01 - ABOUT",
        heading: "The person behind the code",
        subtitle: "A passion for transforming ideas into elegant digital solutions that make an impact.",
        description: "I'm a Full Stack Developer with a deep fascination for building modern web applications that solve real-world problems. Currently focused on creating seamless user experiences with cutting-edge technologies.\n\nBeyond coding, I believe in continuous learning and sharing knowledge with the developer community. I'm always excited to collaborate on innovative projects that push boundaries.",
        code_filename: "developer.config.json",
        code_content: `{
  "name": "Developer",
  "role": "Full Stack",
  "focus": [
    "Frontend",
    "Backend",
    "Performance"
  ],
  "currently": "Building awesome projects"
}
// Let's build something incredible.`,
        stat1_value: "10+",
        stat1_label: "PROJECTS COMPLETED",
        stat2_value: "5+",
        stat2_label: "TECH STACKS",
        stat3_value: "3+",
        stat3_label: "YEARS EXPERIENCE",
        stat4_value: "100%",
        stat4_label: "COMMITMENT"
      });
    }
    
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch about" });
  }
};

exports.createOrUpdateAbout = async (req, res) => {
  try {
    const data = req.body;
    
    let about = await About.findOne();
    if (about) {
      await about.update(data);
    } else {
      about = await About.create(data);
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: "Failed to update about" });
  }
};
