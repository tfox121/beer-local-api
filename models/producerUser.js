const mongoose = require('mongoose');

const StockSchema = require('./stock');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  blogData: { type: String, required: true },
  author: { type: String },
  display: { type: Boolean, default: false },
}, { timestamps: true });

const FollowingRetailerSchema = new mongoose.Schema({
  sub: { type: String, required: true },
}, { timestamps: true });

const PromotionSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  minSpend: { type: Number },
  multibuyQuantity: { type: String },
  multibuyType: { type: String },
  multibuyProduct: { type: String },
  multibuyPackageType: { type: String },
  discountType: { type: String, required: true },
  moneyOff: { type: Number },
  percentageOff: { type: Number },
  freeItemQuantity: { type: String },
  freeItemProduct: { type: String },
});

const ProducerUserSchema = new mongoose.Schema({
  sub: { type: String, required: true, index: { unique: true } },
  // businessId: { type: String, index: { unique: true } },
  salesEmail: { type: String, required: true },
  salesContactNumber: { type: String },
  intro: { type: String },
  distributionAreas: {},
  stock: [StockSchema],
  blog: [BlogSchema],
  profileOptions: {
    stockCategories: { type: Array, default: [''] },
    activeModules: { type: Array, default: ['blog', 'availability'] },
    distantPurchasing: { type: Boolean, default: false },
    distantPurchasingConditions: {
      minSpend: { type: Number },
    },
  },
  followingRetailers: [FollowingRetailerSchema],
  promotions: [PromotionSchema],
});

const ProducerUser = mongoose.model(
  'ProducerUser',
  ProducerUserSchema,
  'producerUser',
);

module.exports = ProducerUser;
