const express = require("express");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/v1/users", UserController.getAllUsers);
router.get("/v1/user:id", authMiddleware, UserController.getUserById);

module.exports = router;
