// education routes

const router = require("express").Router();
const ctrl = require("../controllers/education.controller");
const { requireAdminKey } = require("../middleware/adminAuth");

router.get("/", ctrl.getEducation);
router.post("/", requireAdminKey, ctrl.createEducation);
router.post("/reset", requireAdminKey, ctrl.resetEducation);
router.put("/:id", requireAdminKey, ctrl.updateEducation);
router.delete("/:id", requireAdminKey, ctrl.deleteEducation);

module.exports = router;
