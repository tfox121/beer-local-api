/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const ProducerUser = require('../models/producerUser');
const RetailerUser = require('../models/retailerUser');

exports.findBySub = async (sub) => User.findOne({ sub });

exports.findByBusinessId = async (businessId) => User.findOne({ businessId });

exports.getBusinessName = async (sub) => {
  const user = await User.findOne({ sub });
  return user.businessName;
};

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
    ...profileData,
    businessId: profileData.businessName.toLowerCase().replace(/[^\w]/g, ''),
  },
  {
    new: true,
    upsert: true,
  },
);

exports.findUpdateUser = async (sub, updatedData) => {
  const data = { ...updatedData };
  if (data.businessName) {
    data.businessId = data.businessName.toLowerCase().replace(/[^\w]/g, '');
  }
  return (
    User.findOneAndUpdate(
      { sub },
      {
        ...data,
      },
      {
        new: true,
        upsert: false,
      },
    )
  );
};

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

exports.addNotification = async (sub, type, resourceId, from) => {
  const user = await User.findOne({ sub });
  const duplicatedNotification = user.notifications.filter(
    (notification) => notification.resourceId === resourceId.toString()
      && notification.type === type,
  );
  if (duplicatedNotification.length) {
    user.notifications.id(duplicatedNotification[0]._id).remove();
  }
  user.notifications.unshift({ type, resourceId, from });
  return user.save();
};

exports.dismissNotification = async (sub, id) => {
  const user = await User.findOne({ sub });
  user.notifications.id(id).read = true;
  return user.save();
};

exports.notificationsDismiss = async (sub) => {
  const user = await User.findOne({ sub });
  user.notifications.forEach((notification) => {
    notification.read = true;
  });
  return user.save();
};
