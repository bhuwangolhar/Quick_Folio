// profile controller

const { Profile } = require("../models");

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    if (profile) {
      await profile.update(req.body);
      return res.json(profile);
    }

    profile = await Profile.create(req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};