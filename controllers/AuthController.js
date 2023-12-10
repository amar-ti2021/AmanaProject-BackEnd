require("dotenv").config();
const { JWT_SECRET_KEY } = process.env;
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const Auth = require("../models/Auth");

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await Auth.login(email);

      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
      }

      if (!bcrypt.compare(password, user.pass)) {
        res.status(401).json({ error: "Invalid email or password" });
      }
      const token = jwt.sign(
        { userId: user.uid, username: user.nama },
        JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "Authentication successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

const object = new AuthController();

module.exports = object;
