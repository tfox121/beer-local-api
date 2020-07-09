const router = require('express').Router();

const ProducerController = require('../controllers/producerController');

router.get('/producer/avatar/:businessId', ProducerController.getAvatar);

router.get('/producer/banner/:businessId', ProducerController.getBanner);

router.get('/producer/:businessId', ProducerController.findById);

router.get('/producers', ProducerController.getAll);

module.exports = router;
