const router = require('express').Router();

const ProducerController = require('../controllers/producerController');

router.patch('/stock', ProducerController.updateStock);

router.post('/blog', ProducerController.addBlogPost);

router.patch('/orders', ProducerController.editOrderStatus);



module.exports = router;
