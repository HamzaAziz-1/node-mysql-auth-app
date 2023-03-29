const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

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

// login route
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // check if email exists in database
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {
        const user = results[0];

        // compare password hash
        bcrypt.compare(password, user.password, function (err, match) {
          if (err) throw err;

          if (match) {
            // login successful, create a JWT token and set it as a cookie
            const token = jwt.sign({ userId: user.id }, "secret-key", {
              expiresIn: "1h",
            });

            res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // set cookie with 1 hour expiration
            res.status(200).json({
              message: "Login successful",
            });
          } else {
            // password incorrect
            res.status(401).json({
              message: "Invalid email or password",
            });
          }
        });
      } else {
        // email not found
        res.status(401).json({
          message: "Invalid email or password",
        });
      }
    }
  );
});


// signup route
app.post("/signup", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const state = req.body.state;

  // hash password
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) throw err;

    // save user to database
    connection.query(
      "INSERT INTO users (name, email, password, state) VALUES (?, ?, ?, ?)",
      [name, email, hash, state],
      function (error, results, fields) {
        if (error) throw error;

        res.status(201).json({
          message: "User created successfully",
        });
      }
    );
  });
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
