const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/v1/register", authController.register);
router.post("/v1/login", authController.login);

module.exports = router;
