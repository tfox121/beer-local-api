const router = require('express').Router();

const OrderController = require('../controllers/orderController');

router.post('/', OrderController.placeOrder);

router.get('/', OrderController.getOrders);

router.get('/:orderId', OrderController.getOrder);

router.patch('/:orderId', OrderController.editOrder);

router.post('/:orderId/message', OrderController.addOrderMessage);

module.exports = router;
