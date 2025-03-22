require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const prisma = new PrismaClient();

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailTemplate = (resetLink) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { 
            max-width: 500px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
        }
        .logo {
            width: 150px; 
            max-width: 100%; 
            display: block; 
            margin: 0 auto 20px;
        }
        .btn { 
            display: inline-block; 
            background-color: #007bff; 
            color: #ffffff !important; 
            text-decoration: none; 
            padding: 12px 20px; 
            border-radius: 5px; 
            margin-top: 20px; 
            font-size: 16px; 
            font-weight: bold; 
        }
        .footer { 
            margin-top: 20px; 
            font-size: 12px; 
            color: #777; 
        }
    </style>
</head>
<body>
    <div class="container">
        <img class="logo" src="https://github.com/thewebvana/LMS_BE/blob/master/src/images/password.gif?raw=true" alt="Reset Password">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You recently requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetLink}" class="btn">Reset Password</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p class="footer">This link expires in 15 minutes.</p>
        <p class="footer">© 2025 Your Company. All rights reserved.</p>
    </div>
</body>
</html>

`;

const AuthController = {

  register: async (req, res) => {
    try {
      const body = req.body;

      // Validate required fields with specific error messages
      if (!body.role) return res.status(400).json({ message: "Role is required" });
      if (!body.full_name) return res.status(400).json({ message: "Name is required" });
      if (!body.email) return res.status(400).json({ message: "Email is required" });
      if (!body.mobile) return res.status(400).json({ message: "Phone number is required" });
      if (!body.password) return res.status(400).json({ message: "Password is required" });


      const existingUser = await prisma.User.findUnique({ where: { email: body.email } });

      if (existingUser) {
        return res.status(409).json({
          message:
            existingUser.email === body.email
              ? "Email already in use"
              : "Phone number already in use",
        });
      }


      // Hash the password
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const role = body.role;
        
      // Create user
      const newUser = await prisma.User.create({
        data: {
          role: body.role,
          full_name: body.full_name,
          email: body.email,
          mobile: body.mobile,
          gender: body.gender,
          address: body.address,
          password: hashedPassword,

          ...(role === 'PRINCIPAL' && {
            principal: {
              create: {
                employee_id: body.employee_id,
                joining_date: body.joining_date,
                designation: body.designation,
                qualification: body.qualification,
                work_experience: body.work_experience,
              }
            },
          }),
          ...(role === 'ADMIN' && {
            admin: {
              create: {
                employee_id: body.employee_id,
                joining_date: body.joining_date,
                designation: body.designation,
                qualification: body.qualification,
                work_experience: body.work_experience,
              }
            },
          }),
          ...(role === 'TEACHER' && {
            teacher: {
              create: {
                employee_id: body.employee_id,
                joining_date: body.joining_date,
                designation: body.designation,
                qualification: body.qualification,
                work_experience: body.work_experience,
                class_assigned: body.class_assigned,
                subjects_taught: body.subjects_taught,
              }
            },
          }),
          ...(role === 'STUDENT' && {
            student: {
              create: {
                student_id: body.student_id,
                enrollment_number: body.enrollment_number,
                class_section: body.class_section,
                admission_date: body.admission_date,
                blood_group: body.blood_group,
                parents_name: body.parents_name,
                emergency_contact: body.emergency_contact,
              }
            },
          }),
        
        },
      });

      res.status(201).json({ message: `${body.full_name} registered successfully` });
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await prisma.User.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Email does not exists" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign({ user_id: user.user_id, role_id: user.role_id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      let data = {
        user_id: user.user_id,
        role_id: user.role_id,
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile,
      }

      res.cookie("token", token, { httpOnly: true, secure: false }).json({ message: "Login successful", user: data, token });
      // res.json({ token, user});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  forgotPassword: async (req, res) => {

    try {
      const { email } = req.body;
      if (!email) return res.status(404).json({ message: "Email required.." });

      const user = await prisma.User.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Generate reset token
      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

      // Send reset email
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        html: emailTemplate(resetLink),
      });

      res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
      res.status(500).json({ message: error });
      // res.status(500).json({ message: "Server error" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.email) return res.status(400).json({ message: "Invalid token" });

      // Find user
      const user = await prisma.User.findUnique({ where: { email: decoded.email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in DB
      await prisma.User.update({
        where: { email: decoded.email },
        data: { password: hashedPassword },
      });

      res.json({ message: "Password reset successfully!" });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired token" });
    }
  }

};

module.exports = AuthController;
