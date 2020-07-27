const mongoose = require('mongoose');

const FollowedProducerSchema = new mongoose.Schema({
  sub: { type: String, required: true },
}, { timestamps: true });

const RetailerUserSchema = new mongoose.Schema({
  sub: { type: String, required: true, index: { unique: true } },
  purchasingEmail: { type: String, required: true },
  purchasingContactNumber: { type: String, required: true },
  contactOptions: {},
  followedProducers: [FollowedProducerSchema],
  deliveryInstruction: { type: String },
});

const RetailerUser = mongoose.model(
  'RetailerUser',
  RetailerUserSchema,
  'retailerUser',
);

module.exports = RetailerUser;
