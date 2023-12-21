import Model from '../core/Model.js';
import query from '../core/Database.js';
import bcrypt from 'bcrypt';

class Auth extends Model {
  static table = "users";

  static async login(field, email) {
    try {
      const results = await query(
        `SELECT id, username, email, password FROM ${Auth.table} WHERE ${field} = "${email}" LIMIT 1`
      );

      if (results.length === 1) {
        return results[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error while fetching user data");
    }
  }
}

export default Auth;
