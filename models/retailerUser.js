const mongoose = require('mongoose');

// const RetailerProfileSchema = new mongoose.Schema({
//   premisesName: { type: String, required: true },
//   purchasingEmail: { type: String, required: true },
//   purchasingContactNumber: { type: String },
//   website: { type: String },
//   avatarSource: { type: String },
//   location: {},
// });

const RetailerUserSchema = new mongoose.Schema({
  // email: { type: String, required: true },
  // name: { type: String, required: true },
  // givenName: { type: String },
  // familyName: { type: String },
  // picture: { type: String },
  // locale: { type: String },
  sub: { type: String, required: true },
  premisesName: { type: String, required: true },
  retailerId: { type: String, required: true },
  purchasingEmail: { type: String, required: true },
  purchasingContactNumber: { type: String },
  website: { type: String },
  avatarSource: { type: String },
  location: {},
  contactOptions: {},
  terms: { type: Boolean, required: true },
});

const RetailerUser = mongoose.model(
  'RetailerUser',
  RetailerUserSchema,
  'retailerUser',
);

module.exports = RetailerUser;
