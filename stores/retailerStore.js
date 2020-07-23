/* eslint-disable no-underscore-dangle */
const RetailerUser = require('../models/retailerUser');
const User = require('../models/user');
const ProducerUser = require('../models/producerUser');
const ProducerStore = require('./producerStore');

const geoJsonContainsCoords = require('../lib/geoJsonContainsCoords');

// find user according to id and role
exports.findBySub = async (sub) => {
  const retailer = await RetailerUser.findOne({ sub });
  const user = await User.findOne({ sub });
  return { ...user._doc, ...retailer._doc };
};

exports.addOrRemoveFollow = async (sub, following) => {
  const retailer = await RetailerUser.findOne({ sub });
  const follow = retailer.followedProducers.filter((producer) => producer.sub === following);
  if (follow.length) {
    retailer.followedProducers.id(follow[0]._id).remove();
  } else {
    retailer.followedProducers.unshift({ sub: following });
  }
  return retailer.save();
};

exports.getProducerFeed = async (sub) => {
  const retailer = await RetailerUser.findOne({ sub });
  const retailerUserInfo = await User.findOne({ sub });
  const followedProducers = await Promise.all(
    retailer.followedProducers.map(async (producer) => {
      const producerInfo = await ProducerUser.findOne({ sub: producer.sub });
      const userInfo = await User.findOne({ sub: producer.sub });
      return { ...producerInfo._doc, ...userInfo._doc };
    }),
  );
  const allProducers = await ProducerStore.getAll();
  console.log(allProducers.length);
  const nearbyProducers = allProducers.filter((producer) => (
    geoJsonContainsCoords(producer.distributionAreas, retailerUserInfo.location)
  ));
  return { followedProducers, nearbyProducers };
};
