const mongoose = require('mongoose');

const StockSchema = require('./stock')

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  blogData: { type: String, required: true },
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now },
  author: { type: String },
  display: { type: Boolean }
})

const ProducerUserSchema = new mongoose.Schema({
  sub: { type: String, required: true },
  producerId: { type: String, required: true },
  salesEmail: { type: String, required: true },
  salesContactNumber: { type: String },
  intro: { type: String },
  distributionAreas: {},
  stock: [StockSchema],
  blog: [BlogSchema]
});

const ProducerUser = mongoose.model(
  'ProducerUser',
  ProducerUserSchema,
  'producerUser',
);

module.exports = ProducerUser;
