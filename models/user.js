const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  sub: { type: String, required: true, index: { unique: true } },
  businessName: { type: String, required: true, index: { unique: true } },
  businessId: { type: String, required: true, index: { unique: true } },
  role: { type: String, required: true },
  website: { type: String },
  avatarSource: {
    data: Buffer,
    contentType: String,
  },
  bannerSource: {
    data: Buffer,
    contentType: String,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, required: true },
  terms: { type: Boolean, required: true },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema, 'user');

module.exports = User;
