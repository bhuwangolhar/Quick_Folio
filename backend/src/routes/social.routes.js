// social routes

const router = require("express").Router();
const ctrl = require("../controllers/social.controller");

router.get("/", ctrl.getSocials);
router.post("/", ctrl.createSocial);
router.delete("/:id", ctrl.deleteSocial);

module.exports = router;