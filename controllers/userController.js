const multer = require('multer');
const formidable = require('formidable');
const path = require('path');
const UserStore = require('../stores/userStore');
const ProducerStore = require('../stores/producerStore');
const RetailerStore = require('../stores/retailerStore');


exports.findUser = async (req, res, next) => {
    try {
      console.log("FINDING USER", req.user)
      const user = await UserStore.findUser(req.user.sub);
      let business
      switch (req.role) {
        case 'producer':
          business = await UserStore.findProducerUser(req.user.sub);
          break;
        case 'retailer':
          business = await UserStore.findRetailerUser(req.user.sub)
          break;
        default:
          return res.status(400).send({
            message: 'Invalid role',
          });
      }
      if (user && business) {
        return res.json({user, business});
      }
      return res.status(404).send({
        message: 'User not found',
      });
    } catch (err) {
      res.status(500).send({
        message: 'User retrieval error',
        error: err,
      });
      return next(err);
    }
  }

  exports.findUpdateUser = async (req, res, next) => {
    try {
      const user = await UserStore.findUpdateUser(
        req.user.sub,
        req.body
      )
      let business

      switch (req.role) {
        case 'producer':
          if (req.body.businessName) {
            business = await ProducerStore.updateProfile(req.user.sub, { producerId: req.body.businessName.toLowerCase().replace(/\s+/g, '')})
          } else {
            business = await UserStore.findProducerUser(req.user.sub);
          }
          break;
        case 'retailer':
          if (req.body.businessName) {
            business = await RetailerStore.updateProfile(req.user.sub, { retailerId: req.body.businessName.toLowerCase().replace(/\s+/g, '') })
          } else {
            business = await UserStore.findRetailerUser(req.user.sub)
          }
          break;
        default:
          return res.status(400).send({
            message: 'Invalid role',
          });
      }
      if (user && business) {
        return res.json({ user, business });
      }
      return res.status(404).send({
        message: 'User not found',
      });
    } catch (err) {
      res.status(500).send({
        message: 'User update error',
      });
      next(err);
    }
  }

  exports.findUpdateCreateProducerUser = async (req, res, next) => {
    try {
      const user = await UserStore.findUpdateCreateUser(
        req.user.sub,
        req.body,
        'producer'
      );
      const business = await UserStore.findUpdateCreateProducerUser(
        req.user.sub,
        req.body,
      );
      res.json({ user, business });
    } catch (err) {
      res.status(500).send({
        message: 'User creation error',
      });
      next(err);
    }
  }

  exports.findUpdateCreateRetailerUser = async (req, res, next) => {
    try {
      console.log("REQ BODY", req.body)
      // const form = formidable({ multiples: true });

      // form.parse(req, (err, fields, files) => {
      //   if (err) {
      //     console.log(err)
      //     next(err);
      //     return;
      //   }
      //   // res.json({ fields, files });
      //   console.log(fields)
      // });
      res.send('Success!')

      // const user = await UserStore.findUpdateCreateUser(
      //   req.user.sub,
      //   req.body,
      //   'retailer'
      // );
      // const business = await UserStore.findUpdateCreateRetailerUser(
      //   req.user.sub,
      //   req.body,
      // );
      // res.json({ user, business });
    } catch (err) {
      console.error(err)

      res.status(500).json({
        message: 'User creation error',
      });
      next(err);
    }
  }

  exports.avatarUpload = async (req, res, next) => {
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

      upload(req, res, err => {
        if (err) {
          console.error(err);
          res.status(500).send({
            message: 'File upload error',
          });
          return next(err);
        }
        console.log('Request ---', req.body);
        console.log('Request file ---', req.file);

        if (!err) res.status(200).json(req.file);
      });
    } catch (err) {
      res.status(500).send({
        message: 'File upload error',
      });
      next(err);
    }
  }

  exports.getOrders = async (req, res, next) => {
    try {
      console.log("ROLE", req.role)
      const orders = await UserStore.getOrders(req.user.sub, req.role);
      if (orders || orders.length) {
        if (req.role === 'producer') {
          const purchasers = await Promise.all(orders.map(async (order) => {
            const purchaser = await RetailerStore.findBySub(order.retailerSub)
            return purchaser
          }))
          return res.json({ orders: orders.reverse(), businesses: purchasers.reverse() });
        }
        if (req.role === 'retailer') {
          const producers = await Promise.all(orders.map(async (order) => {
            const producer = await ProducerStore.findBySub(order.producerSub)
            return producer
          }))
          return res.json({ orders: orders.reverse(), businesses: producers.reverse() });
        }
      }
      return res.status(404).send({
        message: 'No orders found'
      })
    } catch (err) {
      res.status(500).send({
        message: 'Order fetch error',
        error: err,
      });
      return next(err);
    }
  }

  exports.addOrRemoveFollow = async (req, res, next) => {
    try {
      // console.log("FOLLOW", req.user.sub, req.body.follow)
      const retailer = await RetailerStore.addOrRemoveFollow(req.user.sub, req.body.follow)
      const producer = await ProducerStore.addOrRemoveFollow(req.body.follow, req.user.sub)
      return res.json(retailer)
      // res.send('Success!')
    } catch (err) {
      res.status(500).send({
        message: 'Follow add error',
        error: err,
      });
      return next(err);
    }
  }

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
