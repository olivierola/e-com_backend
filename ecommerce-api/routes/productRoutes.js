const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');

const router = express.Router();



router.get('/search', productController.searchProducts);
router.get('/categories', productController.getCategories);
router.get('/category/:categoryId', productController.getProductsByCategory);

// Ensuite les routes dynamiques
router.get('/:id', productController.getProductById);
router.get('/', productController.getProducts);

router.post('/:productId/rate', auth, productController.rateProduct);
router.post('/:productId/comment', auth, productController.commentProduct);
// router.get('/', productController.getProducts);

// router.get('/category/:categoryId', productController.getProductsByCategory);


// router.get('/categories', productController.getCategories);


// router.get('/:id', productController.getProductById);


// router.get('/search', productController.searchProducts);


// router.post('/:productId/rate', auth, productController.rateProduct);


// router.post('/:productId/comment', auth, productController.commentProduct);

module.exports = router;