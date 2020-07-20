/* eslint-disable no-underscore-dangle */
const RetailerUser = require('../models/retailerUser');
const User = require('../models/user');

module.exports = class RetailerStore {
  // find user according to id and role
  static async findBySub(sub) {
    const retailer = await RetailerUser.findOne({ sub });
    const user = await User.findOne({ sub });
    return { ...user._doc, ...retailer._doc };
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
