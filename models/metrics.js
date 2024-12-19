const pool = require('../config/db');

class Metrics {
  static async create({ userId, metricName, metricValue }) {
    const result = await pool.query(
      'INSERT INTO metrics (user_id, metric_name, metric_value) VALUES ($1, $2, $3) RETURNING *',
      [userId, metricName, metricValue]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query('SELECT * FROM metrics WHERE user_id = $1', [userId]);
    return result.rows;
  }

  static async update(id, { metricName, metricValue }) {
    const result = await pool.query(
      'UPDATE metrics SET metric_name = $1, metric_value = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [metricName, metricValue, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM metrics WHERE id = $1', [id]);
  }
  
  static async saveMetricsToDatabase(userId, metrics) {
    for (const metric of metrics) {
      const { metricName, metricValue } = metric;
  
      // Use your database library to insert data, e.g., with PostgreSQL:
      await pool.query(
        "INSERT INTO metrics (user_id, metric_name, metric_value) VALUES ($1, $2, $3)",
        [userId, metricName, metricValue]
      );
    }
  }
}

module.exports = Metrics;
