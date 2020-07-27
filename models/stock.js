const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  category: { type: String },
  sku: { type: String },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  packSize: { type: String, required: true },
  abv: { type: Number },
  style: { type: String },
  availability: { type: String },
  display: { type: String },
  firstDisplayed: { type: Date },
  orderQuant: { type: Number },
  orderChange: { type: String },
  imageSource: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = StockSchema;
