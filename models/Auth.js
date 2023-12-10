const query = require("../config/database");
const bcrypt = require("bcrypt");

class Auth {
  static async login(email) {
    try {
      const results = await query(
        "SELECT uid, nama, email, pass FROM user WHERE email = ? LIMIT 1",
        [email]
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

module.exports = Auth;
