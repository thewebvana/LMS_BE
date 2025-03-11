const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = UserController;
