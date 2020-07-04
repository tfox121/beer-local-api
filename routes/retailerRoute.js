const router = require('express').Router();

const RetailerController = require('../controllers/retailerController');

router.post('/order', RetailerController.placeOrder);

module.exports = router;

