const RetailerUser = require('../models/retailerUser');
const User = require('../models/user');
const Order = require('../models/order') 

module.exports = class RetailerStore {
  // find user according to id and role
  static async findByRetailerId(retailerId) {
    return RetailerUser.findOne({ retailerId });
  }

  static async findBySub(sub) {
    const retailer = await RetailerUser.findOne({ sub });
    const user = await User.findOne({ sub })
    return { ...user._doc, ...retailer._doc }
  }

  static async placeOrder(retailerSub, producerSub, items) {
    const newOrder = new Order({ retailerSub, producerSub, items })
    return newOrder.save();
  }

  static async addOrRemoveFollow(sub, following) {
    console.log(sub, following)
    const retailer = await RetailerUser.findOne({ sub })
    retailer.followedProducers.unshift({ sub: following })
    console.log("RETAILER", retailer)
    return retailer.save()
  }
};
