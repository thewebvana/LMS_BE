const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/lms/auth/register", authController.register);
router.post("/lms/auth/login", authController.login);

module.exports = router;
