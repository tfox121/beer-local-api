const multer = require('multer');
const path = require('path');
const UserStore = require('../stores/userStore');

module.exports = class UserController {
  static async findUser(req, res, next) {
    try {
      const user = await UserStore.findUser(
        req.user.sub,
        req.user['https://beerlocal/apiroles'],
      );
      if (user) {
        return res.json(user);
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

  static async findUpdateCreateProducerUser(req, res, next) {
    try {
      // console.log('USER?', req.user.sub);

      const user = await UserStore.findUpdateCreateProducerUser(
        req.user.sub,
        req.body,
      );
      console.log('PROUCER USER CREATED', user);
      res.json(user);
    } catch (err) {
      res.status(500).send({
        message: 'User retrieval error',
      });
      next(err);
    }
  }

  static async findUpdateCreateRetailerUser(req, res, next) {
    try {
      const user = await UserStore.findUpdateCreateRetailerUser(
        req.user.sub,
        req.body,
      );
      console.log('RETAILER USER CREATED', user);
      res.json(user);
    } catch (err) {
      res.status(500).send({
        message: 'User retrieval error',
      });
      next(err);
    }
  }

  static async avatarUpload(req, res, next) {
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

  // static async findUpdateCreateUser(req, res, next) {
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
};
