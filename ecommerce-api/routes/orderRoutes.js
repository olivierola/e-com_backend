const express = require('express');
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

const router = express.Router();


router.post('/', auth, orderController.createOrder);


router.get('/', auth, orderController.getUserOrders);


router.get('/:orderId', auth, orderController.getOrderById);

module.exports = router;