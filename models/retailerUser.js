const mongoose = require('mongoose');

const RetailerUserSchema = new mongoose.Schema({
  sub: { type: String, required: true },
  retailerId: { type: String, required: true },
  purchasingEmail: { type: String, required: true },
  purchasingContactNumber: { type: String, required: true },
  contactOptions: {},
});

const RetailerUser = mongoose.model(
  'RetailerUser',
  RetailerUserSchema,
  'retailerUser',
);

module.exports = RetailerUser;
