const express = require("express");
const router = require("./routes/api");
const cors = require("cors");
const authenticateToken = require("./middlewares/authenticateToken");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateToken);
const apiUrl = "/api/v1";
app.use(apiUrl, router);

app.listen(3000);
