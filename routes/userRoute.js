const router = require('express').Router();

const UserController = require('../controllers/userController');

// router.post('/user', UserController.findUpdateCreateUser);

router.get('/', UserController.findUser);

router.patch('/', UserController.findUpdateUser);

router.get('/avatar', UserController.getOwnAvatar);

router.get('/banner', UserController.getOwnBanner);

router.post('/producer', UserController.findUpdateCreateProducerUser);

router.post('/retailer', UserController.findUpdateCreateRetailerUser);

router.post('/avatar', UserController.avatarUpload);

router.get('/orders', UserController.getOrders);

router.patch('/orders', UserController.editOrder);

router.patch('/follow', UserController.addOrRemoveFollow);

module.exports = router;
