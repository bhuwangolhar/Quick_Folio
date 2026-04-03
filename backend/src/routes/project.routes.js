// project routes

const router = require("express").Router();
const ctrl = require("../controllers/project.controller");
const { requireAdminKey } = require("../middleware/adminAuth");

router.get("/", ctrl.getProjects);
router.post("/", requireAdminKey, ctrl.createProject);
router.post("/reset", requireAdminKey, ctrl.resetProjects);
router.put("/:id", requireAdminKey, ctrl.updateProject);
router.delete("/:id", requireAdminKey, ctrl.deleteProject);

module.exports = router;