/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const ProducerUser = require('../models/producerUser');
const RetailerUser = require('../models/retailerUser');
const Order = require('../models/order');

exports.findUser = async (sub) => User.findOne({ sub }).select('-avatarSource -bannerSource');

exports.getAvatar = async (sub) => {
  const user = await User.findOne({ sub });
  return user.avatarSource;
};

exports.getBanner = async (sub) => {
  const user = await User.findOne({ sub });
  return user.bannerSource;
};

exports.findProducerUser = async (sub) => ProducerUser.findOne({ sub });

exports.findRetailerUser = async (sub) => RetailerUser.findOne({ sub });

exports.findUpdateCreateUser = async (sub, profileData, role) => User.findOneAndUpdate(
  { sub },
  {
    sub,
    role,
    businessId: profileData.businessName.toLowerCase().replace(/[^\w]/g, ''),
    ...profileData,
  },
  {
    new: true,
    upsert: true,
  },
).select('-avatarSource -bannerSource');

exports.findUpdateUser = async (sub, updatedData) => User.findOneAndUpdate(
  { sub },
  {
    ...updatedData,
    businessId: updatedData.businessName.toLowerCase().replace(/[^\w]/g, ''),
  },
  {
    new: true,
    upsert: false,
  },
).select('-avatarSource -bannerSource');

// add new PRODUCER user if they don't exist or update if they do
exports.findUpdateCreateProducerUser = async (sub, profileData) => ProducerUser.findOneAndUpdate(
  { sub },
  {
    sub,
    ...profileData,
    businessId: profileData.businessName.toLowerCase().replace(/[^\w]/g, ''),
  },
  {
    new: true,
    upsert: true,
  },
);

// add new RETAILER user if they don't exist or update if they do
exports.findUpdateCreateRetailerUser = async (sub, profileData) => RetailerUser.findOneAndUpdate(
  { sub },
  {
    sub,
    ...profileData,
    businessId: profileData.businessName.toLowerCase().replace(/[^\w]/g, ''),
  },
  {
    new: true,
    upsert: true,
  },
);

exports.getOrders = async (sub, role) => {
  console.log('Role', role);
  return Order.find({ [`${role}Sub`]: sub });
};

exports.editOrder = async (orderChanges) => Order.findOneAndUpdate(
  { _id: orderChanges._id },
  orderChanges,
  {
    new: true,
  },
);
