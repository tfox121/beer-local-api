const router = require('express').Router();

const ProducerController = require('../controllers/producerController');
const UserController = require('../controllers/userController');

router.get('/producer/:businessId', UserController.getByBusinessId);

router.get('/producers', ProducerController.getAll);

module.exports = router;
