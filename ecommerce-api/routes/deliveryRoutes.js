const express = require('express');
const deliveryController = require('../controllers/deliveryController');
const auth = require('../middlewares/auth');
const deliveryAuth = require('../middlewares/delivery');

const router = express.Router();

// Apply auth and delivery middleware to all routes
router.use(auth, deliveryAuth);

router.get('/orders', deliveryController.getDeliveryOrders);

router.put('/orders/:orderId/status', deliveryController.updateOrderStatus);

router.post('/orders/:orderId/complete', deliveryController.completeDelivery);

module.exports = router;