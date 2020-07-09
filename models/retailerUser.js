const mongoose = require('mongoose');

const FollowedProducers = new mongoose.Schema({
  sub: { type: String, required: true, unique: true },
}, { timestamps: true });

const RetailerUserSchema = new mongoose.Schema({
  sub: { type: String, required: true, index: { unique: true } },
  businessId: { type: String, required: true },
  purchasingEmail: { type: String, required: true },
  purchasingContactNumber: { type: String, required: true },
  contactOptions: {},
  followedProducers: [FollowedProducers],
});

const RetailerUser = mongoose.model(
  'RetailerUser',
  RetailerUserSchema,
  'retailerUser',
);

module.exports = RetailerUser;
