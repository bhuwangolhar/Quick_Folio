const router = require("express").Router();
const ctrl = require("../controllers/about.controller");
const { requireAdminKey } = require("../middleware/adminAuth");

router.get("/", ctrl.getAbout);
router.post("/", requireAdminKey, ctrl.createOrUpdateAbout);

module.exports = router;
