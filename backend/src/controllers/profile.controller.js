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
    console.log("Updating profile with:", req.body);
    let profile = await Profile.findOne();

    if (profile) {
      await profile.update(req.body);
      console.log("Profile updated successfully");
      return res.json(profile);
    }

    profile = await Profile.create(req.body);
    console.log("Profile created successfully");
    res.json(profile);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: error.message, details: error.toString() });
  }
};