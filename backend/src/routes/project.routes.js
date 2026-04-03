// project routes

const router = require("express").Router();
const ctrl = require("../controllers/project.controller");

router.get("/", ctrl.getProjects);
router.post("/", ctrl.createProject);
router.put("/:id", ctrl.updateProject);
router.delete("/:id", ctrl.deleteProject);

module.exports = router;