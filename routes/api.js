const AuthController = require("../controllers/AuthController");

const express = require("express");

const router = express.Router();

router.get("/login", AuthController.login);

router.all("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = router;
