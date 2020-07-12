const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const StockSchema = require('./stock');

const MessageSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: Number },
  retailerSub: { type: String, required: true },
  producerSub: { type: String, required: true },
  items: [StockSchema],
  status: { type: String, default: 'Pending', required: true },
  messages: [MessageSchema],
  retailerNotification: { type: Boolean, default: false },
  producerNotification: { type: Boolean, default: false },
}, { timestamps: true });

OrderSchema.plugin(AutoIncrement, { inc_field: 'orderNumber' });

const Order = mongoose.model('Order', OrderSchema, 'order');

module.exports = Order;
