const router = require('express').Router();

const ProducerController = require('../controllers/producerController');

router.get('/producer/:producerId', ProducerController.findUser);

module.exports = router;
