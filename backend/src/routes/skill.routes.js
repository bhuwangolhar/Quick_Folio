// skill routes

const router = require("express").Router();
const ctrl = require("../controllers/skill.controller");
const { requireAdminKey } = require("../middleware/adminAuth");

router.get("/", ctrl.getSkills);
router.post("/", requireAdminKey, ctrl.createSkill);
router.post("/reset", requireAdminKey, ctrl.resetSkills);
router.put("/:id", requireAdminKey, ctrl.updateSkill);
router.delete("/:id", requireAdminKey, ctrl.deleteSkill);

module.exports = router;