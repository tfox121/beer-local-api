const router = require('express').Router();

const UserController = require('../controllers/userController');

// router.post('/user', UserController.findUpdateCreateUser);

router.get('/', UserController.getOwnProfile);

router.post('/', UserController.findOrCreateUser);

router.patch('/', UserController.findUpdateOwnProfile);

// router.post('/retailer', UserController.findUpdateCreateRetailerUser);

router.patch('/follow', UserController.addOrRemoveFollow);

router.patch('/notification/:id', UserController.notificationDismiss);

router.patch('/notifications', UserController.notificationsDismiss);

module.exports = router;
