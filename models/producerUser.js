const mongoose = require('mongoose');

const StockSchema = require('./stock')

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  blogData: { type: String, required: true },
  author: { type: String },
  display: { type: Boolean, default: false }
}, { timestamps: true })

const FollowingRetailers = new mongoose.Schema({
  sub: { type: String, required: true, index: { unique: true } },
}, { timestamps: true })

const ProducerUserSchema = new mongoose.Schema({
  sub: { type: String, required: true, index: { unique: true } },
  producerId: { type: String, required: true },
  salesEmail: { type: String, required: true },
  salesContactNumber: { type: String },
  intro: { type: String },
  distributionAreas: {},
  stock: [StockSchema],
  blog: [BlogSchema],
  profileOptions: {
    stockCategories: { type: Array, default: [''] }
  },
  followingRetailers: [FollowingRetailers]
});

const ProducerUser = mongoose.model(
  'ProducerUser',
  ProducerUserSchema,
  'producerUser',
);

module.exports = ProducerUser;
