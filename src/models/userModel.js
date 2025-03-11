const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const UserModel = {
  getUserByEmail: async (email) => {
    return await prisma.user.findUnique({ where: { email } });
  },

  createUser: async (name, email, password, role) => {
    return await prisma.user.create({
      data: { name, email, password, role },
    });
  },

  getAllUsers: async () => {
    return await prisma.user.findMany();
  },

  getUserById: async (id) => {
    return await prisma.user.findUnique({ where: { id: parseInt(id) } });
  }
};

module.exports = UserModel;
