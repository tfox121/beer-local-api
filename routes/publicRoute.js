const router = require('express').Router();

const ProducerController = require('../controllers/producerController');

router.get('/producer/:producerId', ProducerController.findByProducerId);

router.get('/producers', ProducerController.getProducers);


module.exports = router;
