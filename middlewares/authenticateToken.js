import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET_KEY } = process.env;
import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  const protectedRoutes = "/protected";
  if (!req.path.includes(protectedRoutes)) {
    return next();
  }

  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user.userId;
    next();
  });
}

export default authenticateToken;
