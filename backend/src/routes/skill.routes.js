// skill routes

const router = require("express").Router();
const ctrl = require("../controllers/skill.controller");

router.get("/", ctrl.getSkills);
router.post("/", ctrl.createSkill);
router.delete("/:id", ctrl.deleteSkill);

module.exports = router;