const router = require('express').Router();

const UserController = require('../controllers/userController');

// router.post('/user', UserController.findUpdateCreateUser);

router.get('/', UserController.findUser);

router.patch('/', UserController.findUpdateUser);

router.post('/producer', UserController.findUpdateCreateProducerUser);

router.post('/retailer', UserController.findUpdateCreateRetailerUser);

router.post('/avatar', UserController.avatarUpload);

router.get('/orders', UserController.getOrders);

router.patch('/follow', UserController.addOrRemoveFollow);


module.exports = router;
