const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/v1/register", AuthController.register);
router.post("/v1/login", AuthController.login);
router.post("/v1/forgot-password", AuthController.forgotPassword);
router.post("/v1/reset-password", AuthController.resetPassword);

module.exports = router