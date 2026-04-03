// profile routes

const router = require("express").Router();
const ctrl = require("../controllers/profile.controller");
const { requireAdminKey } = require("../middleware/adminAuth");

router.get("/", ctrl.getProfile);
router.post("/", requireAdminKey, ctrl.createOrUpdateProfile);

module.exports = router;