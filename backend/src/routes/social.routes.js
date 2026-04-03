// social routes

const router = require("express").Router();
const ctrl = require("../controllers/social.controller");
const { requireAdminKey } = require("../middleware/adminAuth");

router.get("/", ctrl.getSocials);
router.post("/", requireAdminKey, ctrl.createSocial);
router.put("/:id", requireAdminKey, ctrl.updateSocial);
router.delete("/:id", requireAdminKey, ctrl.deleteSocial);

module.exports = router;