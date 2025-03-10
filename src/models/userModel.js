const pool = require("../config/db"); // PostgreSQL database connection

const UserModel = {
  getAllUsers: async () => {
    const result = await pool.query("SELECT id, name, email, role, created_at FROM users");
    return result.rows;
  },

  getUserById: async (id) => {
    const result = await pool.query("SELECT id, name, email, role, created_at FROM users WHERE id = $1", [id]);
    return result.rows[0];
  }
};

module.exports = UserModel;
