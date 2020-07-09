const User = require('../models/user');
const ProducerUser = require('../models/producerUser');
const RetailerUser = require('../models/retailerUser');
const Order = require('../models/order');

module.exports = class UserStore {
  // find user according to id
  static async findUser(sub) {
    return User.findOne({ sub }).select('-avatarSource -bannerSource');
  }

  static async getAvatar(sub) {
    const user = await User.findOne({ sub });
    return user.avatarSource;
  }

  static async getBanner(sub) {
    const user = await User.findOne({ sub });
    return user.bannerSource;
  }

  static async findProducerUser(sub) {
    return ProducerUser.findOne({ sub });
  }

  static async findRetailerUser(sub) {
    return RetailerUser.findOne({ sub });
  }

  static async findUpdateCreateUser(sub, profileData, role) {
    return User.findOneAndUpdate(
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
  }

  static async findUpdateUser(sub, updatedData) {
    return User.findOneAndUpdate(
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
  }

  // add new PRODUCER user if they don't exist or update if they do
  static async findUpdateCreateProducerUser(sub, profileData) {
    return ProducerUser.findOneAndUpdate(
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
  }

  // add new RETAILER user if they don't exist or update if they do
  static async findUpdateCreateRetailerUser(sub, profileData) {
    return RetailerUser.findOneAndUpdate(
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
  }

  static async getOrders(sub, role) {
    console.log('Role', role);
    return Order.find({ [`${role}Sub`]: sub });
  }
};
