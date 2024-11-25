const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async getAll({ page = 1, limit = 10, search, sort }) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM users';
    const params = [];

    if (search) {
      query += ` WHERE name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 2}`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += sort ? ` ORDER BY ${sort}` : ' ORDER BY id ASC';
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );
    return result.rows[0].id;
  }

  static async update(id, { name, email }) {
    await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id]
    );
  }

  static async delete(id) {
    await pool.query('UPDATE users SET deleted_at = NOW() WHERE id = $1', [id]);
  }

  static async uploadProfilePicture(id, profilePicture) {
    await pool.query(
      'UPDATE users SET profile_picture = $1 WHERE id = $2',
      [profilePicture, id]
    );
  }
}

module.exports = User;
