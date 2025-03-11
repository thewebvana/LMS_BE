require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const AuthController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || "user",
        },
      });

      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = AuthController;
