/* eslint-disable camelcase */
// const User = require('../models/user');
const producerUser = require('../models/producerUser');
const retailerUser = require('../models/retailerUser');

const { addRole, deleteVisitorRole } = require('../roles');

module.exports = class UserStore {
  // find user according to id and role
  static async findUser(sub, roles) {
    console.log('FINDING', sub, roles);
    if (roles.length > 1) {
      return new Error('Too many roles');
    }
    if (roles.includes('Producer')) {
      return producerUser.findOne({ sub });
    }
    if (roles.includes('Retailer')) {
      return retailerUser.findOne({ sub });
    }
    return new Error('Invalid role');
  }

  // add new PRODUCER user if they don't exist or update if they do
  static async findUpdateCreateProducerUser(sub, profileData) {
    console.log('FINDING', sub, profileData);
    deleteVisitorRole(sub);
    addRole(sub, process.env.AUTH0_PRODUCER_ROLE_ID);
    return producerUser.findOneAndUpdate(
      sub,
      {
        sub,
        ...profileData,
        producerId: profileData.businessName.toLowerCase().replace(/\s+/g, ''),
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

  // add new RETAILER user if they don't exist or update if they do
  static async findUpdateCreateRetailerUser(sub, profileData) {
    console.log('FINDING', sub, profileData);
    deleteVisitorRole(sub);
    addRole(sub, process.env.AUTH0_RETAILER_ROLE_ID);
    return retailerUser.findOneAndUpdate(
      sub,
      {
        sub,
        ...profileData,
        retailerId: profileData.businessName.toLowerCase().replace(/\s+/g, ''),
        avatarSource: `/images/avatars/${
          profileData.avatar ? sub : 'blank'
        }-profile`,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  // static async getUser(id) {
  //   return User.findById(id).exec();
  // }

  // // add new user if they don't exist or update if they do
  // static async findUpdateCreateUser({
  //   email,
  //   name,
  //   given_name,
  //   family_name,
  //   picture,
  //   locale,
  //   sub,
  // }) {
  //   const updates = {
  //     email,
  //     name,
  //     givenName: given_name,
  //     familyName: family_name,
  //     picture,
  //     locale,
  //     socialId: sub,
  //   };
  //   return User.findOneAndUpdate({ socialId: sub }, updates, { upsert: true });
  // }
};
