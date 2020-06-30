const router = require('express').Router();

const ProducerController = require('../controllers/producerController');

router.patch('/stock', ProducerController.updateStock);

module.exports = router;
