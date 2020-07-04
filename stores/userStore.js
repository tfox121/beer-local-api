const User = require('../models/user')
const ProducerUser = require('../models/producerUser');
const RetailerUser = require('../models/retailerUser');
const Order = require('../models/order') 

module.exports = class UserStore {
  // find user according to id
  static async findUser(sub) {
    return User.findOne({ sub });
  }

  static async findProducerUser(sub) {
    return ProducerUser.findOne({ sub });
  }

  static async findRetailerUser(sub) {
    return RetailerUser.findOne({ sub });
  }

  static async findUpdateCreateUser(sub, profileData, role) {
    return User.findOneAndUpdate(
      {sub},
      {
        sub,
        role,
        ...profileData,
        avatarSource: profileData.avatar
          ? `/images/avatars/${sub}-profile.${profileData.pictureFileExt}`
          : `/images/avatars/blank-profile.webp`,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  // add new PRODUCER user if they don't exist or update if they do
  static async findUpdateCreateProducerUser(sub, profileData) {
    return ProducerUser.findOneAndUpdate(
      { sub },
      {
        sub,
        ...profileData,
        producerId: profileData.businessName.toLowerCase().replace(/\s+/g, ''),
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  // add new RETAILER user if they don't exist or update if they do
  static async findUpdateCreateRetailerUser(sub, profileData) {
    console.log('FINDING', sub, profileData);
    return RetailerUser.findOneAndUpdate(
      { sub },
      {
        sub,
        ...profileData,
        retailerId: profileData.businessName.toLowerCase().replace(/\s+/g, ''),
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  static async getOrders(sub, role) {
    console.log("Role", role)
    return Order.find({ [`${role}Sub`]: sub })
  }

};
