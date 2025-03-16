require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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


     const existingUser = await prisma.Principle.findUnique({ where: { email: body.email } });

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
