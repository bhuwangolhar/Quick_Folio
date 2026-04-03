// certification controller

const { Certification } = require("../models");

exports.getCertifications = async (req, res) => {
  try {
    let certs = await Certification.findAll({ order: [["order", "ASC"]] });
    
    // Auto-create 3 default certifications if none exist
    if (certs.length === 0) {
      const defaults = [
        {
          name: "AWS Solutions Architect",
          provider: "Amazon Web Services",
          year: "2024",
          description: "Professional certification for designing distributed systems on AWS",
          tools: "AWS, EC2, S3, Lambda, CloudFormation",
          credential_url: "https://aws.amazon.com/certification",
          order: 0
        },
        {
          name: "TensorFlow Developer Certificate",
          provider: "Google",
          year: "2023",
          description: "Certification demonstrating proficiency in using TensorFlow for ML applications",
          tools: "TensorFlow, Python, Keras, Deep Learning",
          credential_url: "https://www.tensorflow.org/certificate",
          order: 1
        },
        {
          name: "Microsoft Azure Fundamentals",
          provider: "Microsoft",
          year: "2023",
          description: "Foundation-level understanding of cloud services and Azure",
          tools: "Azure, Cloud Computing, DevOps",
          credential_url: "https://learn.microsoft.com/certifications",
          order: 2
        }
      ];
      
      await Certification.bulkCreate(defaults);
      certs = await Certification.findAll({ order: [["order", "ASC"]] });
    }
    
    res.json(certs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCertification = async (req, res) => {
  try {
    const cert = await Certification.create(req.body);
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCertification = async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id);
    if (!cert) {
      return res.status(404).json({ message: "Certification not found" });
    }
    await cert.update(req.body);
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCertification = async (req, res) => {
  try {
    const deleted = await Certification.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Certification not found" });
    }
    res.json({ message: "Certification deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetCertifications = async (req, res) => {
  try {
    await Certification.destroy({ where: {}, truncate: true });
    
    const defaults = [
      {
        name: "AWS Solutions Architect",
        provider: "Amazon Web Services",
        year: "2024",
        description: "Professional certification for designing distributed systems on AWS",
        tools: "AWS, EC2, S3, Lambda, CloudFormation",
        credential_url: "https://aws.amazon.com/certification",
        order: 0
      },
      {
        name: "TensorFlow Developer Certificate",
        provider: "Google",
        year: "2023",
        description: "Certification demonstrating proficiency in using TensorFlow for ML applications",
        tools: "TensorFlow, Python, Keras, Deep Learning",
        credential_url: "https://www.tensorflow.org/certificate",
        order: 1
      },
      {
        name: "Microsoft Azure Fundamentals",
        provider: "Microsoft",
        year: "2023",
        description: "Foundation-level understanding of cloud services and Azure",
        tools: "Azure, Cloud Computing, DevOps",
        credential_url: "https://learn.microsoft.com/certifications",
        order: 2
      }
    ];
    
    const certs = await Certification.bulkCreate(defaults);
    res.json({ message: "Certifications reset to 3 defaults", certs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
