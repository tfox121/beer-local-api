const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  read: { type: Boolean, required: true, default: false },
  resourceId: { type: String },
  from: { type: String },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  sub: { type: String, required: true, index: { unique: true } },
  businessName: { type: String, required: true, index: { unique: true } },
  businessId: { type: String, index: { unique: true } },
  primaryContactName: { type: String, required: true },
  role: { type: String, required: true },
  website: { type: String },
  avatarSource: { type: String },
  bannerSource: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, required: true },
  terms: { type: Boolean, required: true },
  notifications: [NotificationSchema],
}, { timestamps: true });

const User = mongoose.model('User', UserSchema, 'user');

module.exports = User;
