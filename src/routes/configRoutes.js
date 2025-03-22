const express = require("express");
const router = express.Router();
const configController = require("../controllers/configController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/v1/classrooms", authMiddleware([ "PRINCIPAL", "ADMIN", "TEACHER"]), configController.getClassrooms);
router.post("/v1/classroom", authMiddleware([ "PRINCIPAL", "ADMIN", "TEACHER"]), configController.addClassroom);
router.put("/v1/classroom/:id", authMiddleware([ "PRINCIPAL", "ADMIN", "TEACHER"]), configController.updateClassroom);
router.delete("/v1/classroom/:id", authMiddleware([ "PRINCIPAL", "ADMIN", "TEACHER"]), configController.deleteClassroom);


module.exports = router