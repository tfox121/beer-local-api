const router = require('express').Router();

const RetailerController = require('../controllers/retailerController');

router.get('/producers', RetailerController.getFollowedProducers);

module.exports = router;
