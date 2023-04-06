const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
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
  if (err) throw err;
  console.log("Connected!");
  let sql = `CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mls_vendor VARCHAR(255),
    mls_number VARCHAR(255) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    property_tax_id_number VARCHAR(255) NOT NULL,
    lot VARCHAR(255) NOT NULL,
    block VARCHAR(255) NOT NULL,
    current_sales_price DECIMAL(10, 2) NOT NULL,
    closing_date DATE NOT NULL,
    earnest_money_company_name VARCHAR(255) NOT NULL,
    earnest_money_amount DECIMAL(10, 2) NOT NULL,
    deadline_after_emd_accepted DATE NOT NULL,
    transaction_listing_notes VARCHAR(1024) NOT NULL,
    buyer_agent_name VARCHAR(255) NOT NULL,
    buyer_agent_email VARCHAR(255) NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_email_address VARCHAR(255) NOT NULL,
    buyer_phone_number VARCHAR(255) NOT NULL,
    buyer_current_address VARCHAR(255) NOT NULL,
    seller_transaction_coordinator_first_name VARCHAR(255) NOT NULL,
    seller_transaction_coordinator_last_name VARCHAR(255) NOT NULL,
    seller_transaction_coordinator_email VARCHAR(255) NOT NULL,
    seller_transaction_coordinator_phone_number VARCHAR(255) NOT NULL,
    title_contact_first_name VARCHAR(255) NOT NULL,
    title_contact_last_name VARCHAR(255) NOT NULL,
    title_contact_company VARCHAR(255) NOT NULL,
    title_contact_phone_number VARCHAR(255) NOT NULL,
    lender_contact_first_name VARCHAR(255) NOT NULL,
    lender_contact_last_name VARCHAR(255) NOT NULL,
    lender_contact_email VARCHAR(255) NOT NULL,
    lender_contact_phone_number VARCHAR(255) NOT NULL
  )`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

// routes
app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);


// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
