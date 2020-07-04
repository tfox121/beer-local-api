const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const StockSchema = require('./stock')

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: Number },
  retailerSub: { type: String, required: true },
  producerSub: { type: String, required: true },
  received: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now },
  items: [StockSchema],
  status: { type: String, default: 'Pending', required: true },
});

OrderSchema.plugin(AutoIncrement, { inc_field: 'orderNumber' });


const Order = mongoose.model('Order', OrderSchema, 'order');

module.exports = Order;
