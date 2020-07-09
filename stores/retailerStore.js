/* eslint-disable no-underscore-dangle */
const RetailerUser = require('../models/retailerUser');
const User = require('../models/user');
const Order = require('../models/order');

module.exports = class RetailerStore {
  // find user according to id and role
  static async findBybusinessId(businessId) {
    return RetailerUser.findOne({ businessId });
  }

  static async findBySub(sub) {
    const retailer = await RetailerUser.findOne({ sub });
    const user = await User.findOne({ sub });
    return { ...user._doc, ...retailer._doc };
  }

  static async placeOrder(retailerSub, producerSub, items) {
    const newOrder = new Order({ retailerSub, producerSub, items });
    return newOrder.save();
  }

  static async addOrRemoveFollow(sub, following) {
    console.log(sub, following);
    const retailer = await RetailerUser.findOne({ sub });
    const follow = retailer.followedProducers.filter((producer) => producer.sub === following);
    if (follow.length) {
      retailer.followedProducers.id(follow[0]._id).remove();
    } else {
      retailer.followedProducers.unshift({ sub: following });
    }
    return retailer.save();
  }
};
