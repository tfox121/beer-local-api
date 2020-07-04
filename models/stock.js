const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sku: { type: String },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  packSize: { type: String, required: true },
  abv: { type: Number, required: true },
  style: { type: String },
  availability: { type: String },
  display: { type: String },
  orderQuant: { type: Number },
});

module.exports = StockSchema