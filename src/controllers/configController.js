require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const prisma = new PrismaClient();


const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          user_id: true,
          role: true,
          full_name: true,
          email: true,
          mobile: true,
          gender: true,
          address: true,
          active: true,
          created_at: true,
          updated_at: true,
        },
      });

      // Define data types manually
      const columnsTypes = {
        user_id: "string",
        role: "string",
        full_name: "string",
        email: "string",
        mobile: "string",
        gender: "string",
        address: "string",
        active: "boolean",
        created_at: "Date",
        updated_at: "Date",
      };


      res.status(201).json({ data: users, columnsTypes });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;

      if (!body.role) return res.status(400).json({ message: "Role is required" });

      const role = body.role;

      const updatedClassroom = await prisma.user.update({
        where: { user_id: id },
        data: {
          role: body.role,
          full_name: body.full_name,
          email: body.email,
          mobile: body.mobile,
          gender: body.gender,
          address: body.address,

          ...(role === "Principal" && {
            principal: {
              upsert: {
                create: {
                  employee_id: body.employee_id,
                  joining_date: body.joining_date,
                  designation: body.designation,
                  qualification: body.qualification,
                  work_experience: body.work_experience,
                },
                update: {
                  employee_id: body.employee_id,
                  joining_date: body.joining_date,
                  designation: body.designation,
                  qualification: body.qualification,
                  work_experience: body.work_experience,
                },
              },
            },
          }),

          ...(role === "Admin" && {
            admin: {
              upsert: {
                create: {
                  employee_id: body.employee_id,
                  joining_date: body.joining_date,
                  designation: body.designation,
                  qualification: body.qualification,
                  work_experience: body.work_experience,
                },
                update: {
                  employee_id: body.employee_id,
                  joining_date: body.joining_date,
                  designation: body.designation,
                  qualification: body.qualification,
                  work_experience: body.work_experience,
                },
              },
            },
          }),

          ...(role === "Teacher" && {
            teacher: {
              upsert: {
                create: {
                  employee_id: body.employee_id,
                  joining_date: body.joining_date,
                  designation: body.designation,
                  qualification: body.qualification,
                  work_experience: body.work_experience,
                  class_assigned: body.class_assigned,
                  subjects_taught: body.subjects_taught,
                },
                update: {
                  employee_id: body.employee_id,
                  joining_date: body.joining_date,
                  designation: body.designation,
                  qualification: body.qualification,
                  work_experience: body.work_experience,
                  class_assigned: body.class_assigned,
                  subjects_taught: body.subjects_taught,
                },
              },
            },
          }),

          // Student Role Handling
          ...(role === "Student" && {
            student: {
              upsert: {
                create: {
                  student_id: body.student_id,
                  enrollment_number: body.enrollment_number,
                  class_section: body.class_section,
                  admission_date: body.admission_date,
                  blood_group: body.blood_group,
                  parents_name: body.parents_name,
                  emergency_contact: body.emergency_contact,
                },
                update: {
                  student_id: body.student_id,
                  enrollment_number: body.enrollment_number,
                  class_section: body.class_section,
                  admission_date: body.admission_date,
                  blood_group: body.blood_group,
                  parents_name: body.parents_name,
                  emergency_contact: body.emergency_contact,
                },
              },
            },
          }),
        },
      });
      res.status(201).json({ message: `${body.full_name} updated successfully..` });
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  },
}



const ClassroomController = {

  getClassrooms: async (req, res) => {
    try {
      const classrooms = await prisma.classroom.findMany();
      res.json({ data: classrooms });
    } catch (error) {
      res.status(500).json({ message: "Error fetching classrooms", error });
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

module.exports = { userController, ClassroomController };
