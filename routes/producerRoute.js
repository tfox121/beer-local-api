const router = require('express').Router();

const ProducerController = require('../controllers/producerController');

router.patch('/profile', ProducerController.updateProfile);

router.patch('/profile/options', ProducerController.updateProfileOptions);

// router.get('/promotion', ProducerController.getPromotions)

router.post('/promotion', ProducerController.addPromotion);

router.delete('/promotion/:id', ProducerController.deletePromotion);

// router.patch('/promotion', ProducerController.editPromotion)

router.patch('/stock', ProducerController.updateStock);

router.post('/blog', ProducerController.addBlogPost);

router.patch('/blog', ProducerController.editBlogPost);

router.get('/retailers', ProducerController.getNearbyRetailers);

module.exports = router;
