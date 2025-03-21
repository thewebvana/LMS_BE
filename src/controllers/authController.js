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


const AuthController = {
  register: async (req, res) => {
    try {
      const body = req.body;


      // Validate required fields with specific error messages
      if (!body.role_id) return res.status(400).json({ message: "Role is required" });
      if (!body.full_name) return res.status(400).json({ message: "Name is required" });
      if (!body.email) return res.status(400).json({ message: "Email is required" });
      if (!body.mobile) return res.status(400).json({ message: "Phone number is required" });
      if (!body.password) return res.status(400).json({ message: "Password is required" });


      const existingUser = await prisma.principle.findUnique({ where: { email: body.email } });

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

      // Create user
      const newUser = await prisma.Principle.create({
        data: {
          ...body,
          password: hashedPassword,
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
      const user = await prisma.Principle.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Invalid email" });
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

      const user = await prisma.Principle.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Generate reset token
      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

      // Send reset email
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
      });

      res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
      res.status(500).json({ message: error });
      // res.status(500).json({ message: "Server error" });
    }
  },

  resetPassword: async (req, res) => {
    
    try {
      const { token, newPassword  } = req.body;
      if (!token) return res.status(404).json({ message: "token missing.." });
      if (!newPassword) return res.status(404).json({ message: "new password required.." });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user
      const user = await prisma.Principle.findUnique({ where: { email: decoded.email } });

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password & delete reset token
      await prisma.Principle.update({
        where: { user_id: user.user_id },
        data: { password: hashedPassword },
      });

      // await prisma.decoded.delete({ where: { token } });

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired token" });
    }
  }

};

module.exports = AuthController;
