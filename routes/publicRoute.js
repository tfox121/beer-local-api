const router = require('express').Router();

const ProducerController = require('../controllers/producerController');

router.get('/producer/:producerId', ProducerController.findById);

router.get('/producers', ProducerController.getAll);


module.exports = router;
