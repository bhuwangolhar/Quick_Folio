// social controller

const { Social } = require("../models");

exports.getSocials = async (req, res) => {
  try {
    const socials = await Social.findAll();
    res.json(socials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSocial = async (req, res) => {
  try {
    const social = await Social.create(req.body);
    res.json(social);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSocial = async (req, res) => {
  try {
    const deleted = await Social.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Social not found" });
    }

    res.json({ message: "Social deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};