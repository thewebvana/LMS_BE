const express = require("express");
const router = express.Router();
const { ClassroomController, userController } = require("../controllers/configController");
const authMiddleware = require("../middleware/authMiddleware");


// users
router.get("/v1/users", authMiddleware(["Principal", "Admin", "Teacher"]), userController.getAllUsers);
router.put("/v1/user/:id", authMiddleware(["Principal", "Admin", "Teacher"]), userController.updateUser);

// Classroom
router.get("/v1/classrooms", authMiddleware(["Principal", "Admin", "Teacher"]), ClassroomController.getClassrooms);
router.post("/v1/classroom", authMiddleware(["Principal", "Admin", "Teacher"]), ClassroomController.addClassroom);
router.put("/v1/classroom/:id", authMiddleware(["Principal", "Admin", "Teacher"]), ClassroomController.updateClassroom);
router.delete("/v1/classroom/:id", authMiddleware(["Principal", "Admin", "Teacher"]), ClassroomController.deleteClassroom);


module.exports = router