const router = require("express").Router();
const ctrl = require("../controllers/experience.controller");
const { requireAdminKey } = require("../middleware/adminAuth");

router.get("/", ctrl.getAllExperiences);
router.post("/", requireAdminKey, ctrl.createExperience);
router.post("/reset", requireAdminKey, ctrl.resetExperiences);
router.put("/:id", requireAdminKey, ctrl.updateExperience);
router.delete("/:id", requireAdminKey, ctrl.deleteExperience);

module.exports = router;
