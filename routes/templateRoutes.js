const express = require("express");
const jwt = require("jsonwebtoken");
const Template = require("../models/Templates");

const router = express.Router();

// Middleware function to verify the bearer token
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

// GET route to retrieve the user's own documents
router.get("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const templates = await Template.find({ user_id: userId });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST route to create a new template
router.post("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { template_name, pdf_file, s3_path, is_default } = req.body;

  try {
    const template = new Template({
      user_id: userId,
      template_name,
      pdf_file,
      s3_path,
      is_default,
    });
    await template.save();
    res.status(201).json({ message: "Template created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT route to update a template
router.put("/:id", verifyToken, async (req, res) => {
  const userId = req.userId;
  const templateId = req.params.id;
  const { template_name, pdf_file, s3_path, is_default } = req.body;

  try {
    const template = await Template.findOneAndUpdate(
      { _id: templateId, user_id: userId },
      { template_name, pdf_file, s3_path, is_default },
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH route to update specific fields of a template
router.patch("/:id", verifyToken, async (req, res) => {
  const userId = req.userId;
  const templateId = req.params.id;
  const updates = req.body;

  try {
    const template = await Template.findOneAndUpdate(
      { _id: templateId, user_id: userId },
      updates,
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE route to delete a template
router.delete("/:id", verifyToken, async (req, res) => {
  const userId = req.userId;
  const templateId = req.params.id;

  try {
    const template = await Template.findOneAndDelete({
      _id: templateId,
      user_id: userId,
    });
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
