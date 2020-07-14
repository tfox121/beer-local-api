/* eslint-disable no-underscore-dangle */
const ProducerUser = require('../models/producerUser');
const User = require('../models/user');

exports.findById = async (businessId) => ProducerUser.findOne({ businessId });

exports.findBySub = async (sub) => {
  const producer = await ProducerUser.findOne({ sub });
  const user = await User.findOne({ sub });
  return { ...user._doc, ...producer._doc };
};

exports.getAvatar = async (businessId) => {
  const user = await User.findOne({ businessId });
  return user.avatarSource;
};

exports.getBanner = async (businessId) => {
  const user = await User.findOne({ businessId });
  return user.bannerSource;
};

exports.getAll = async () => {
  const producers = await ProducerUser.find({});
  const users = await User.find({ role: 'producer' });

  return producers.map((producer, index) => ({ ...producer._doc, ...users[index]._doc }));
};

exports.updateProfile = async (sub, updates) => ProducerUser.findOneAndUpdate({ sub },
  {
    ...updates,
    businessId: updates.businessName.toLowerCase().replace(/[^\w]/g, ''),
  },
  {
    new: true,
  });

exports.updateProfileOptions = async (sub, optionsChange) => {
  const producer = await ProducerUser.findOne({ sub });
  producer.profileOptions[optionsChange.name] = optionsChange.payload;
  return producer.save();
};

exports.addPromotion = async (sub, promotion) => {
  const producer = await ProducerUser.findOne({ sub });
  console.log(promotion);
  producer.promotions.unshift(promotion);
  return producer.save();
};

exports.deletePromotion = async (sub, promotionId) => {
  const producer = await ProducerUser.findOne({ sub });
  producer.promotions.id(promotionId).remove();
  return producer.save();
};

exports.updateStock = async (sub, stockData) => ProducerUser.findOneAndUpdate(
  { sub },
  {
    stock: stockData,
  },
  {
    new: true,
  },
);

exports.addBlogPost = async (sub, blogData, { title, author, display }) => {
  const producer = await ProducerUser.findOne({ sub });
  producer.blog.unshift({
    blogData, title, author, display,
  });
  return producer.save();
};

exports.editBlogPost = async (sub, id, blogData, { title, author, display }) => {
  const producer = await ProducerUser.findOne({ sub });
  producer.blog.id(id).blogData = blogData;
  producer.blog.id(id).title = title;
  producer.blog.id(id).author = author;
  producer.blog.id(id).display = display;
  producer.blog.id(id).modified = Date.now();
  return producer.save();
};

exports.addOrRemoveFollow = async (sub, follower) => {
  const producer = await ProducerUser.findOne({ sub });
  const follow = producer.followingRetailers.filter((retailer) => retailer.sub === follower);
  if (follow.length) {
    producer.followingRetailers.id(follow[0]._id).remove();
  } else {
    producer.followingRetailers.unshift({ sub: follower });
  }
  return producer.save();
};
