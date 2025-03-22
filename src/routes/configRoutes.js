const express = require("express");
const router = express.Router();
const {ClassroomController, userController} = require("../controllers/configController");
const authMiddleware = require("../middleware/authMiddleware");


// users
router.get("/v1/users", authMiddleware([ "PRINCIPAL", "ADMIN", "TEACHER"]), userController.getAllUsers);
router.put("/v1/user/:id", authMiddleware([ "PRINCIPAL", "ADMIN", "TEACHER"]), userController.updateUser);

// Classroom
router.get("/v1/classrooms", authMiddleware([ "PRINCIPAL", "ADMIN", "TEACHER"]), ClassroomController.getClassrooms);
router.post("/v1/classroom", authMiddleware([ "PRINCIPAL", "ADMIN", "TEACHER"]), ClassroomController.addClassroom);
router.put("/v1/classroom/:id", authMiddleware([ "PRINCIPAL", "ADMIN", "TEACHER"]), ClassroomController.updateClassroom);
router.delete("/v1/classroom/:id", authMiddleware([ "PRINCIPAL", "ADMIN", "TEACHER"]), ClassroomController.deleteClassroom);


module.exports = router