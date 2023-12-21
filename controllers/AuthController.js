// AuthController.mjs (assuming .mjs for ECMAScript modules)
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET_KEY } = process.env;
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Validator from "../core/Validator.js";
import Auth from "../models/Auth.js";

class AuthController {
  checkLogin(req, res) {
    return res.status(200).json({ user: req.user, message: "authenticated" });
  }

  async login(req, res) {
    const { credential, password } = req.body;

    try {
      const isEmail = Validator.isValidEmail(credential);
      const user = await Auth.login(isEmail ? "email" : "username", credential);

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const result = await bcrypt.compare(password, user.password);

      if (!result) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      res.status(200).json({ message: "Authentication successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async register(req, res) {
    const validator = new Validator();
    const data = await validator.validate(
      {
        id: nanoid(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        re_password: req.body.re_password,
      },
      {
        id: ["unique"],
        username: ["required", ["unique", "username"]],
        email: ["required", "email", ["unique", "email"]],
        password: ["required", "strong_password"],
        re_password: ["required", ["match", "password"]],
      },
      "users"
    );

    if (data.errors) {
      const response = {
        messages: "Validation Error",
        errors: data.errors,
      };
      return res.status(400).json(response);
    }
    data["password"] = bcrypt.hashSync(data["password"], 12);
    const user = await Auth.create({
      id: data["id"],
      username: data["username"],
      email: data["email"],
      password: data["password"],
    });
    if (user) {
      const response = {
        message: `Data of ${data.username} stored successfully`,
        data: user,
      };
      return res.status(201).json(response);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

const object = new AuthController();

export default object;
