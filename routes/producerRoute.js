const router = require('express').Router();

const ProducerController = require('../controllers/producerController');

router.patch('/profile', ProducerController.updateProfile);

router.patch('/profile/options', ProducerController.updateProfileOptions);

router.patch('/stock', ProducerController.updateStock);

router.post('/blog', ProducerController.addBlogPost);

router.patch('/blog', ProducerController.editBlogPost);

module.exports = router;
