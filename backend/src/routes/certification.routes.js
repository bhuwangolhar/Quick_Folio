// certification routes

const router = require("express").Router();
const ctrl = require("../controllers/certification.controller");
const { requireAdminKey } = require("../middleware/adminAuth");

router.get("/", ctrl.getCertifications);
router.post("/", requireAdminKey, ctrl.createCertification);
router.post("/reset", requireAdminKey, ctrl.resetCertifications);
router.put("/:id", requireAdminKey, ctrl.updateCertification);
router.delete("/:id", requireAdminKey, ctrl.deleteCertification);

module.exports = router;
