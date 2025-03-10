const express = require("express");
const { createPrincipal, createAdmin, createTeacher, createStudent } = require("../controllers/user")

const userRouter = express.Router();

userRouter.post("/create-principal", (req, res) => {console.log(req)});
userRouter.post("/create-admin", createAdmin);
userRouter.post("/create-teacher", createTeacher);
userRouter.post("/create-student", createStudent);

module.exports = userRouter;
