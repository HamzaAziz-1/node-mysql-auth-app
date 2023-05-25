const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  template_name: { type: String, required: true },
  pdf_file: { type: String, required: true },
  s3_path: { type: String, required: true },
  is_default: { type: Boolean, default:false },
});

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
