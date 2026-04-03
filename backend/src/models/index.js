// models/index.js

const Profile = require("./profile.model");
const Project = require("./project.model");
const Skill = require("./skill.model");
const Social = require("./social.model");
const About = require("./about.model");
const Experience = require("./experience.model");
const Certification = require("./certification.model");
const Education = require("./education.model");

module.exports = {
  Profile,
  Project,
  Skill,
  Social,
  About,
  Experience,
  Certification,
  Education,
};