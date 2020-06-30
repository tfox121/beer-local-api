const mongoose = require('mongoose');

// const ProducerProfileSchema = new mongoose.Schema({
//   businessName: { type: String, required: true },
//   salesEmail: { type: String, required: true },
//   salesContactNumber: { type: String },
//   website: { type: String },
//   intro: { type: String },
//   avatarSource: { type: String },
//   location: {},
//   distributionAreas: {},
// });

const ProducerUserSchema = new mongoose.Schema({
  // email: { type: String, required: true },
  // name: { type: String, required: true },
  // givenName: { type: String },
  // familyName: { type: String },
  // picture: { type: String },
  // locale: { type: String },
  sub: { type: String, required: true },
  businessName: { type: String, required: true },
  producerId: { type: String, required: true },
  salesEmail: { type: String, required: true },
  salesContactNumber: { type: String },
  website: { type: String },
  intro: { type: String },
  avatarSource: { type: String },
  location: {},
  distributionAreas: {},
  stock: [],
  terms: { type: Boolean, required: true },
});

const ProducerUser = mongoose.model(
  'ProducerUser',
  ProducerUserSchema,
  'producerUser',
);

module.exports = ProducerUser;
