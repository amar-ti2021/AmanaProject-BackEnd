const AuthController = require("../controllers/AuthController");

const express = require("express");

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/protected/check-login", AuthController.checkLogin);
router.all("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = router;
