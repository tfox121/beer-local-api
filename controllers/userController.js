/* eslint-disable no-underscore-dangle */
const UserStore = require('../stores/userStore');
const ProducerStore = require('../stores/producerStore');
const RetailerStore = require('../stores/retailerStore');
const { sendWelcomeEmail } = require('../email/email');

exports.getOwnProfile = async (req, res) => {
  try {
    console.log('FINDING USER', req.user);
    const user = await UserStore.findBySub(req.user.sub);

    let business;
    switch (req.role) {
      case 'producer':
        business = await UserStore.findProducerUser(req.user.sub);
        break;
      case 'retailer':
        business = await UserStore.findRetailerUser(req.user.sub);
        break;
      default:
        res.status(404).json({
          message: 'User has no role',
        });
        return;
    }
    if (user._id && business._id) {
      const notifications = await Promise.all(user.notifications.map(async (notification) => ({
        ...notification._doc,
        image: await UserStore.getAvatar(notification._doc.from),
        name: await UserStore.getBusinessName(notification._doc.from),
      })));
      res.json({ user: { ...user._doc, notifications }, business });
    } else {
      res.status(404).json({
        message: 'Profile not found',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Profile retrieval error',
      error: err,
    });
  }
};

exports.getByBusinessId = async (req, res, next) => {
  try {
    const user = await UserStore.findByBusinessId(req.params.businessId);
    const business = user.role === 'producer' ? await ProducerStore.findBySub(user.sub) : await RetailerStore.findBySub(user.sub);
    console.log('PRODUCER RETRIEVED');
    if (user && business) {
      return res.json({ business, user });
    }
    return res.status(404).send({
      message: 'Business not found',
    });
  } catch (err) {
    res.status(500).send({
      message: 'Business retrieval error',
      error: err,
    });
    return next(err);
  }
};

exports.findOrCreateUser = async (req, res) => {
  try {
    console.log('New user:', req.body);

    const user = await UserStore.findUpdateCreateUser(
      req.user.sub,
      req.body,
      req.body.type,
    );
    let business;
    if (req.body.type === 'producer') {
      business = await UserStore.findUpdateCreateProducerUser(
        req.user.sub,
        req.body,
      );
    } else if (req.body.type === 'retailer') {
      business = await UserStore.findUpdateCreateRetailerUser(
        req.user.sub,
        req.body,
      );
    } else {
      res.status(400).send({
        message: 'Invalid role',
      });
      return;
    }

    sendWelcomeEmail({ ...user._doc, ...business._doc });

    res.json({ user, business });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'User creation error',
    });
  }
};

exports.findUpdateOwnProfile = async (req, res) => {
  try {
    console.log('USER', req.body);
    const user = await UserStore.findUpdateUser(
      req.user.sub,
      req.body,
    );

    console.log('USER UPDATED', user.businessName);

    const { businessName } = req.body;
    let business;

    switch (req.role) {
      case 'producer':
        if (businessName) {
          business = await ProducerStore.updateProfile(req.user.sub, { businessName });
        } else {
          business = await UserStore.findProducerUser(req.user.sub);
        }
        break;
      case 'retailer':
        if (businessName) {
          business = await RetailerStore.updateProfile(req.user.sub, { businessName });
        } else {
          business = await UserStore.findRetailerUser(req.user.sub);
        }
        break;
      default:
        res.status(400).send({
          message: 'Invalid role',
        });
    }
    console.log('BUSINESS', business.sub);
    if (user && business) {
      console.log('SUCCESS!');
      res.json({ user, business });
    } else {
      res.status(404).send({
        message: 'User not found',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'User update error',
    });
  }
};

// exports.findUpdateCreateRetailerUser = async (req, res) => {
//   try {
//     console.log('Retailer:', req.body);

//     const user = await UserStore.findUpdateCreateUser(
//       req.user.sub,
//       req.body,
//       'retailer',
//     );

//     const business = await UserStore.findUpdateCreateRetailerUser(
//       req.user.sub,
//       req.body,
//     );
//     res.json({ user, business });
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       message: 'User creation error',
//     });
//   }
// };

// exports.avatarUpload = async (req, res) => {
//   try {
//     const storage = multer.diskStorage({
//       destination(req_, file, cb) {
//         cb(null, 'public/images/avatars');
//       },
//       filename(req_, file, cb) {
//         console.log('FILENAME', req_.user);
//         cb(
//           null,
//           `${req_.user.sub}-profile${path.extname(file.originalname)}`,
//         );
//       },
//     });

//     const upload = multer({ storage }).single('myImage');

//     upload(req, res, (err) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send({
//           message: 'File upload error',
//         });
//       }
//       console.log('Request ---', req.body);
//       console.log('Request file ---', req.file);

//       if (!err) res.status(200).json(req.file);
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: 'File upload error',
//     });
//   }
// };

exports.addOrRemoveFollow = async (req, res) => {
  try {
    const retailer = await RetailerStore.addOrRemoveFollow(req.user.sub, req.body.follow);
    await ProducerStore.addOrRemoveFollow(req.body.follow, req.user.sub);
    res.json({ followedProducers: retailer.followedProducers });
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).send({
      message: 'Notifications dismiss error',
      error: err,
    });
  }
};
