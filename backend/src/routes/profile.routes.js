// profile routes

const router = require("express").Router();
const ctrl = require("../controllers/profile.controller");

router.get("/", ctrl.getProfile);
router.post("/", ctrl.createOrUpdateProfile);

module.exports = router;