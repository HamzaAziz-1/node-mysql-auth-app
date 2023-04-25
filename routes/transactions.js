const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const { checkAuth } = require("../middlewares/auth.js");
const jwt = require("jsonwebtoken");


// create connection to mysql database
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

// middleware function to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "secret-key", function (err, decoded) {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
  });
}

router.post("/inputs",verifyToken, (req, res) => {
  const user_id = req.userId;
  const {
    mls_vendor,
    mls_number,
    street_address,
    city,
    state,
    zip_code,
    property_tax_id_number,
    lot,
    block,
    current_sales_price,
    closing_date,
    earnest_money_company_name,
    earnest_money_amount,
    deadline_after_emd_accepted,
    transaction_listing_notes,
    buyer_agent_name,
    buyer_agent_email,
    buyer_name,
    buyer_email_address,
    buyer_phone_number,
    buyer_current_address,
    seller_transaction_coordinator_first_name,
    seller_transaction_coordinator_last_name,
    seller_transaction_coordinator_email,
    seller_transaction_coordinator_phone_number,
    title_contact_first_name,
    title_contact_last_name,
    title_contact_company,
    title_contact_phone_number,
    lender_contact_first_name,
    lender_contact_last_name,
    lender_contact_email,
    lender_contact_phone_number,
  } = req.body;
  // Check if all inputs are present in req.body
  if (
    !mls_vendor ||
    !mls_number ||
    !street_address ||
    !city ||
    !state ||
    !zip_code ||
    !property_tax_id_number ||
    !lot ||
    !block ||
    !current_sales_price ||
    !closing_date ||
    !earnest_money_company_name ||
    !earnest_money_amount ||
    !deadline_after_emd_accepted ||
    !transaction_listing_notes ||
    !buyer_agent_name ||
    !buyer_agent_email ||
    !buyer_name ||
    !buyer_email_address ||
    !buyer_phone_number ||
    !buyer_current_address ||
    !seller_transaction_coordinator_first_name ||
    !seller_transaction_coordinator_last_name ||
    !seller_transaction_coordinator_email ||
    !seller_transaction_coordinator_phone_number ||
    !title_contact_first_name ||
    !title_contact_last_name ||
    !title_contact_company ||
    !title_contact_phone_number ||
    !lender_contact_first_name ||
    !lender_contact_last_name ||
    !lender_contact_email ||
    !lender_contact_phone_number
  ) {
    return res.status(400).json({ error: "Missing required input." });
  }

  const sql = `INSERT INTO transaction (
    user_id,
    mls_vendor,
    mls_number,
    street_address,
    city,
    state,
    zip_code,
    property_tax_id_number,
    lot,
    block,
    current_sales_price,
    closing_date,
    earnest_money_company_name,
    earnest_money_amount,
    deadline_after_emd_accepted,
    transaction_listing_notes,
    buyer_agent_name,
    buyer_agent_email,
    buyer_name,
    buyer_email_address,
    buyer_phone_number,
    buyer_current_address,
    seller_transaction_coordinator_first_name,
    seller_transaction_coordinator_last_name,
    seller_transaction_coordinator_email,
    seller_transaction_coordinator_phone_number,
    title_contact_first_name,
    title_contact_last_name,
    title_contact_company,
    title_contact_phone_number,
    lender_contact_first_name,
    lender_contact_last_name,
    lender_contact_email,
    lender_contact_phone_number
  ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;

  const values = [
    user_id,
    mls_vendor,
    mls_number,
    street_address,
    city,
    state,
    zip_code,
    property_tax_id_number,
    lot,
    block,
    current_sales_price,
    closing_date,
    earnest_money_company_name,
    earnest_money_amount,
    deadline_after_emd_accepted,
    transaction_listing_notes,
    buyer_agent_name,
    buyer_agent_email,
    buyer_name,
    buyer_email_address,
    buyer_phone_number,
    buyer_current_address,
    seller_transaction_coordinator_first_name,
    seller_transaction_coordinator_last_name,
    seller_transaction_coordinator_email,
    seller_transaction_coordinator_phone_number,
    title_contact_first_name,
    title_contact_last_name,
    title_contact_company,
    title_contact_phone_number,
    lender_contact_first_name,
    lender_contact_last_name,
    lender_contact_email,
    lender_contact_phone_number,
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(400).json({ err });
    } else {
      
        return res.status(200).json("Transactions created successfully");
    }
  });
});
router.get("/showAll",verifyToken, (req, res) => {
  const user_id = req.userId;
  const sql = "SELECT * FROM transaction WHERE user_id = ?";
  connection.query(sql,[user_id], (err, result) => {
    if (err) {
      return res.status(400).json({ err });
    } else {
      return res.status(200).json(result);
    }
  });
});

router.get("/show/:id", verifyToken,(req, res) => {
  const transactionId = req.params.id;
  const userId = req.userId;
  const sql = "SELECT * FROM transaction WHERE id = ? AND user_id = ?";

  connection.query(sql, [transactionId, userId], (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(200).json(result[0]);
  });
});

router.put("/update/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const {
    mls_vendor,
    mls_number,
    street_address,
    city,
    state,
    zip_code,
    property_tax_id_number,
    lot,
    block,
    current_sales_price,
    closing_date,
    earnest_money_company_name,
    earnest_money_amount,
    deadline_after_emd_accepted,
    transaction_listing_notes,
    buyer_agent_name,
    buyer_agent_email,
    buyer_name,
    buyer_email_address,
    buyer_phone_number,
    buyer_current_address,
    seller_transaction_coordinator_first_name,
    seller_transaction_coordinator_last_name,
    seller_transaction_coordinator_email,
    seller_transaction_coordinator_phone_number,
    title_contact_first_name,
    title_contact_last_name,
    title_contact_company,
    title_contact_phone_number,
    lender_contact_first_name,
    lender_contact_last_name,
    lender_contact_email,
    lender_contact_phone_number,
  } = req.body;

  const sliced_closing_date = closing_date.slice(0, 10);
  const sliced_deadline_after_emd_accepted = deadline_after_emd_accepted.slice(
    0,
    10
  );
  
  const sql = `UPDATE transaction SET 
                mls_vendor = ?,
                mls_number = ?,
                street_address = ?,
                city = ?,
                state = ?,
                zip_code = ?,
                property_tax_id_number = ?,
                lot = ?,
                block = ?,
                current_sales_price = ?,
                closing_date = ?,
                earnest_money_company_name = ?,
                earnest_money_amount = ?,
                deadline_after_emd_accepted = ?,
                transaction_listing_notes = ?,
                buyer_agent_name = ?,
                buyer_agent_email = ?,
                buyer_name = ?,
                buyer_email_address = ?,
                buyer_phone_number = ?,
                buyer_current_address = ?,
                seller_transaction_coordinator_first_name = ?,
                seller_transaction_coordinator_last_name = ?,
                seller_transaction_coordinator_email = ?,
                seller_transaction_coordinator_phone_number = ?,
                title_contact_first_name = ?,
                title_contact_last_name = ?,
                title_contact_company = ?,
                title_contact_phone_number = ?,
                lender_contact_first_name = ?,
                lender_contact_last_name = ?,
                lender_contact_email = ?,
                lender_contact_phone_number = ? 
              WHERE id = ? AND user_id = ?`;

  const values = [
    mls_vendor,
    mls_number,
    street_address,
    city,
    state,
    zip_code,
    property_tax_id_number,
    lot,
    block,
    current_sales_price,
    sliced_closing_date,
    earnest_money_company_name,
    earnest_money_amount,
    sliced_deadline_after_emd_accepted,
    transaction_listing_notes,
    buyer_agent_name,
    buyer_agent_email,
    buyer_name,
    buyer_email_address,
    buyer_phone_number,
    buyer_current_address,
    seller_transaction_coordinator_first_name,
    seller_transaction_coordinator_last_name,
    seller_transaction_coordinator_email,
    seller_transaction_coordinator_phone_number,
    title_contact_first_name,
    title_contact_last_name,
    title_contact_company,
    title_contact_phone_number,
    lender_contact_first_name,
    lender_contact_last_name,
    lender_contact_email,
    lender_contact_phone_number,
    id,
    userId
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(400).json({ err });
    } else if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    } else {
      return res.status(200).json("Transaction updated successfully");
    }
  });
});


router.delete("/delete/:id",verifyToken, (req, res) => {
 const transactionId = req.params.id;
 const userId = req.userId;
 const sql = "DELETE FROM transaction WHERE id = ? AND user_id = ?";

 connection.query(sql, [transactionId, userId], (err, result) => {
   if (err) {
     return res.status(400).json({ error: err.message });
   }

   if (result.affectedRows === 0) {
     return res.status(404).json({ error: "Transaction not found" });
   }

   return res.status(200).json("Transaction deleted successfully");
 });
});



module.exports = router;