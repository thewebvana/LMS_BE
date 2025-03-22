require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const prisma = new PrismaClient();




const AuthController = {

  getClassrooms: async (req, res) => {
    try {
      const classrooms = await prisma.classroom.findMany();
      res.json({data: classrooms });
    } catch (error) {
      res.status(500).json({  message: "Error fetching classrooms", error });
    }
  },

  addClassroom: async (req, res) => {
    try {
      const body = req.body;

      // Validate required fields with specific error messages
      if (!body.name) return res.status(400).json({ message: "Name is required" });
      if (!body.section) return res.status(400).json({ message: "section is required" });
      if (!body.grade) return res.status(400).json({ message: "Grade is required" });

      const existingUser = await prisma.classroom.findFirst({
        where: {
          OR: [
            { name: body.name },
            { grade: body.grade, section: body.section }
          ]
        }
      });
      
      if (existingUser) {
        return res.status(409).json({
          message: existingUser.name === body.name 
            ? "Name already exists!" 
            : "Class already exists!"
        });
      }

      // Create user
      const newClass = await prisma.classroom.create({
        data: {
         ...body
        },
      });

      res.status(201).json({ message: `${body.name} created..` });
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
    }
  },

  deleteClassroom: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.classroom.delete({ where: { id } });
      res.json({ message: "Classroom deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting classroom", error });
    }
  },

  updateClassroom: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, section, grade, subject } = req.body;
      const updatedClassroom = await prisma.classroom.update({
        where: { id },
        data: { name, section, grade, subject, teacherId },
      });
      res.json(updatedClassroom);
    } catch (error) {
      res.status(500).json({ error: "Error updating classroom" });
    }
  },


};

module.exports = AuthController;
