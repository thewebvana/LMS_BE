const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/v1/register", AuthController.register);
router.post("/v1/login", AuthController.login);

module.exports = router;
