/* eslint-disable no-underscore-dangle */
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const UserStore = require('../stores/userStore');
const ProducerStore = require('../stores/producerStore');
const RetailerStore = require('../stores/retailerStore');

exports.findUser = async (req, res) => {
  try {
    console.log('FINDING USER', req.user);
    const user = await UserStore.findUser(req.user.sub);

    const notifications = await Promise.all(user.notifications.map(async (notification) => ({
      ...notification._doc,
      image: await UserStore.getAvatar(notification._doc.from),
      name: await UserStore.getBusinessName(notification._doc.from),
    })));

    let business;
    switch (req.role) {
      case 'producer':
        business = await UserStore.findProducerUser(req.user.sub);
        break;
      case 'retailer':
        business = await UserStore.findRetailerUser(req.user.sub);
        break;
      default:
        res.status(400).json({
          message: 'Invalid role',
        });
    }
    if (user && business) {
      res.json({ user: { ...user._doc, notifications }, business });
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'User retrieval error',
      error: err,
    });
  }
};

exports.getOwnAvatar = async (req, res) => {
  try {
    const avatar = await UserStore.getAvatar(req.user.sub);
    res.set('Content-Type', avatar.contentType);
    res.send(avatar.data);
  } catch (err) {
    res.status(500).json({
      message: 'Avatar retrieval error',
      error: err,
    });
  }
};

exports.getOwnBanner = async (req, res) => {
  try {
    const banner = await UserStore.getBanner(req.user.sub);
    res.set('Content-Type', banner.contentType);
    res.send(banner.data);
  } catch (err) {
    res.status(500).json({
      message: 'Banner retrieval error',
      error: err,
    });
  }
};

exports.findUpdateUser = async (req, res) => {
  try {
    const userObj = { ...req.fields };
    console.log(userObj);

    if (req.files.avatarSource) {
      userObj.avatarSource = {};
      userObj.avatarSource.data = fs.readFileSync(req.files.avatarSource.path);
      userObj.avatarSource.contentType = req.files.avatarSource.type;
    }

    if (req.files.bannerSource) {
      userObj.bannerSource = {};
      userObj.bannerSource.data = fs.readFileSync(req.files.bannerSource.path);
      userObj.bannerSource.contentType = req.files.bannerSource.type;
    }

    const user = await UserStore.findUpdateUser(
      req.user.sub,
      userObj,
    );

    console.log('USER UPDATED', user);

    let business;

    switch (req.role) {
      case 'producer':
        if (req.body.businessName) {
          business = await ProducerStore.updateProfile(req.user.sub, { businessId: req.fields.businessName.toLowerCase().replace(/[^\w]/g, '') });
        } else {
          business = await UserStore.findProducerUser(req.user.sub);
        }
        break;
      case 'retailer':
        if (req.body.businessName) {
          business = await RetailerStore.updateProfile(req.user.sub, { businessId: req.fields.businessName.toLowerCase().replace(/[^\w]/g, '') });
        } else {
          business = await UserStore.findRetailerUser(req.user.sub);
        }
        break;
      default:
        res.status(400).send({
          message: 'Invalid role',
        });
    }
    if (user && business) {
      res.json({ user, business });
    } else {
      res.status(404).send({
        message: 'User not found',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'User update error',
    });
  }
};

exports.findUpdateCreateProducerUser = async (req, res) => {
  try {
    console.log('FIELDS', req.fields);
    console.log('FILES', req.files);
    const userObj = { ...req.fields };

    if (req.fields.location) {
      userObj.location = JSON.parse(req.fields.location);
    }
    if (req.fields.distributionAreas) {
      userObj.distributionAreas = JSON.parse(req.fields.distributionAreas);
    }

    userObj.avatarSource = {};

    userObj.avatarSource.data = fs.readFileSync(req.files.pictureFile.path);

    userObj.avatarSource.contentType = req.files.pictureFile.type;
    const user = await UserStore.findUpdateCreateUser(
      req.user.sub,
      userObj,
      'producer',
    );
    const business = await UserStore.findUpdateCreateProducerUser(
      req.user.sub,
      userObj,
    );
    res.json({ user, business });
  } catch (err) {
    res.status(500).send({
      message: 'User creation error',
    });
  }
};

exports.findUpdateCreateRetailerUser = async (req, res) => {
  try {
    const userObj = { ...req.fields };

    if (req.fields.location) {
      userObj.location = JSON.parse(req.fields.location);
    }
    if (req.fields.contactOptions) {
      userObj.contactOptions = JSON.parse(req.fields.contactOptions);
    }

    userObj.avatarSource = {};
    userObj.avatarSource.data = fs.readFileSync(req.files.pictureFile.path);
    userObj.avatarSource.contentType = req.files.pictureFile.type;

    console.log(userObj);
    const user = await UserStore.findUpdateCreateUser(
      req.user.sub,
      userObj,
      'retailer',
    );
    console.log(user);

    const business = await UserStore.findUpdateCreateRetailerUser(
      req.user.sub,
      userObj,
    );
    console.log(business);
    res.json({ user, business });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'User creation error',
    });
  }
};

exports.avatarUpload = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination(req_, file, cb) {
        cb(null, 'public/images/avatars');
      },
      filename(req_, file, cb) {
        console.log('FILENAME', req_.user);
        cb(
          null,
          `${req_.user.sub}-profile${path.extname(file.originalname)}`,
        );
      },
    });

    const upload = multer({ storage }).single('myImage');

    upload(req, res, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send({
          message: 'File upload error',
        });
      }
      console.log('Request ---', req.body);
      console.log('Request file ---', req.file);

      if (!err) res.status(200).json(req.file);
    });
  } catch (err) {
    res.status(500).send({
      message: 'File upload error',
    });
  }
};

exports.addOrRemoveFollow = async (req, res) => {
  try {
    const retailer = await RetailerStore.addOrRemoveFollow(req.user.sub, req.body.follow);
    await ProducerStore.addOrRemoveFollow(req.body.follow, req.user.sub);
    res.json(retailer);
  } catch (err) {
    res.status(500).send({
      message: 'Follow add error',
      error: err,
    });
  }
};

exports.notificationDismiss = async (req, res) => {
  try {
    const user = await UserStore.dismissNotification(req.user.sub, req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).send({
      message: 'Notification dismiss error',
      error: err,
    });
  }
};

exports.notificationsDismiss = async (req, res) => {
  try {
    const user = await UserStore.notificationsDismiss(req.user.sub);
    const notifications = await Promise.all(user.notifications.map(async (notification) => ({
      ...notification._doc,
      image: await UserStore.getAvatar(notification._doc.from),
      name: await UserStore.getBusinessName(notification._doc.from),
    })));
    res.json({ ...user._doc, notifications });
  } catch (err) {
    res.status(500).send({
      message: 'Notifications dismiss error',
      error: err,
    });
  }
};

// exports.findUpdateCreateUser = async (req, res, next) => {
//   try {
//     const user = await UserStore.findUpdateCreateUser(req.body);
//     console.log('USER RETRIEVED', user);
//     res.json(user);
//   } catch (err) {
//     res.status(500).send({
//       message: 'User retrieval error',
//     });
//     next(err);
//   }
// }
