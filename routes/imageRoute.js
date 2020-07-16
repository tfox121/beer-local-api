const router = require('express').Router();

const ImageController = require('../controllers/imageController');

router.post('/', ImageController.putImage);

// router.get('/', ImageController.getOwnImage);

module.exports = router;
