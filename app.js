const express = require("express");
const router = require("./routes/api");
const authenticateToken = require("./middlewares/authenticateToken");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateToken);
app.use(router);

app.listen(3000);
