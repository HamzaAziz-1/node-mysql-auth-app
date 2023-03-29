const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

// create connection to mysql database
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

// test database connection
connection.connect(function (err) {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }

  console.log("Connected to database");
});

// routes
app.use("/auth", authRoutes);


// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
