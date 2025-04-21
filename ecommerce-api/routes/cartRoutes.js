const express = require('express');
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/auth');

const router = express.Router();


router.get('/', auth, cartController.getCart);


router.post('/', auth, cartController.addToCart);

router.put('/:productId', auth, cartController.updateCartItemQuantity);


router.delete('/:productId', auth, cartController.removeFromCart);

module.exports = router;