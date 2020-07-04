const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  sub: { type: String, required: true },
  role: { type: String, required: true },
  businessName: { type: String, required: true },
  website: { type: String },
  avatarSource: { type: String },
  location: {},
  address: { type: String },
  terms: { type: Boolean, required: true },
  created: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema, 'user');

module.exports = User;
