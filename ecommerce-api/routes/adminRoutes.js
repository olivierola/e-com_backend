const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/admin');

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(auth, adminAuth);

router.post('/products', adminController.createProduct);

router.put('/products/:id', adminController.updateProduct);

router.put('/reduction/:id', adminController.addDiscount);

router.delete('/products/:id', adminController.deleteProduct);

router.post('/categories', adminController.createCategory);

router.delete('/categories/:id', adminController.deleteCategory);

router.get('/orders', adminController.getAllOrders);

router.get('/stock', adminController.getStockReport);

router.get('/sales', adminController.getSalesReport);

module.exports = router;