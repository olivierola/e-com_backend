const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');

const router = express.Router();


router.get('/', productController.getProducts);

router.get('/categories', productController.getCategories);


router.get('/search', productController.searchProducts);


router.post('/:productId/rate', auth, productController.rateProduct);


router.post('/:productId/comment', auth, productController.commentProduct);

module.exports = router;