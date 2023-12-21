import db from "./Database.js";

class Model {
  static table;

  static async all() {
    try {
      const query = `SELECT * FROM ${this.table}`;
      const results = await db(query);

      return results.length > 0 ? results : null;
    } catch (error) {
      throw new Error("Error fetching all records: " + error.message);
    }
  }

  static async find(id) {
    try {
      const query = `SELECT * FROM ${this.table} WHERE id = ?`;
      const [result] = await db(query, [id]);

      return result ? result : null;
    } catch (error) {
      throw new Error("Error fetching record by ID: " + error.message);
    }
  }

  static async where(field, value) {
    try {
      const query = `SELECT * FROM ${this.table} WHERE ${field} LIKE ?`;
      const results = await db(query, [`%${value}%`]);

      return results.length > 0 ? results : null;
    } catch (error) {
      throw new Error("Error fetching records by condition: " + error.message);
    }
  }

  static async create(data) {
    try {
      const query = `INSERT INTO ${this.table} SET ?`;
      const result = await db(query, data);

      return result ? data : null;
    } catch (error) {
      throw new Error("Error creating record: " + error.message);
    }
  }

  static async edit(id, data) {
    try {
      const query = `UPDATE ${this.table} SET ? WHERE id = ?`;
      const result = await db(query, [data, id]);

      return result ? data : null;
    } catch (error) {
      throw new Error("Error editing record: " + error.message);
    }
  }

  static async delete(id) {
    try {
      const query = `DELETE FROM ${this.table} WHERE id = ?`;
      const result = await db(query, [id]);

      return result;
    } catch (error) {
      throw new Error("Error deleting record: " + error.message);
    }
  }
}

export default Model;
