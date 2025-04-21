const { pool } = require('../config/db');

// Add product to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!productId) {
      return res.status(400).json({ error: 'ID du produit requis' });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({ error: 'La quantité doit être positive' });
    }
    
    // Check if product exists and has enough stock
    const [products] = await pool.query(
      'SELECT id, stock, price FROM products WHERE id = ?',
      [productId]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    const product = products[0];
    
    if (product.stock < quantity) {
      return res.status(400).json({ 
        error: 'Stock insuffisant',
        availableStock: product.stock
      });
    }
    
    // Check if product is already in cart
    const [existingCartItems] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE userId = ? AND productId = ?',
      [userId, productId]
    );
    
    if (existingCartItems.length > 0) {
      // Update quantity
      const newQuantity = existingCartItems[0].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ 
          error: 'Stock insuffisant pour la quantité totale',
          availableStock: product.stock,
          currentCartQuantity: existingCartItems[0].quantity
        });
      }
      
      await pool.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingCartItems[0].id]
      );
      
      return res.json({ 
        message: 'Quantité mise à jour dans le panier',
        quantity: newQuantity
      });
    }
    
    // Add new item to cart
    await pool.query(
      'INSERT INTO cart_items (userId, productId, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
    
    res.status(201).json({ 
      message: 'Produit ajouté au panier',
      quantity
    });
    
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
exports.updateCartItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantité valide requise' });
    }
    
    // Check if product exists and has enough stock
    const [products] = await pool.query(
      'SELECT id, stock FROM products WHERE id = ?',
      [productId]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    if (products[0].stock < quantity) {
      return res.status(400).json({ 
        error: 'Stock insuffisant',
        availableStock: products[0].stock
      });
    }
    
    // Check if item is in cart
    const [cartItems] = await pool.query(
      'SELECT id FROM cart_items WHERE userId = ? AND productId = ?',
      [userId, productId]
    );
    
    if (cartItems.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé dans le panier' });
    }
    
    // Update quantity
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE userId = ? AND productId = ?',
      [quantity, userId, productId]
    );
    
    res.json({ 
      message: 'Quantité mise à jour',
      quantity
    });
    
  } catch (error) {
    next(error);
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    
    // Delete cart item
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE userId = ? AND productId = ?',
      [userId, productId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produit non trouvé dans le panier' });
    }
    
    res.json({ message: 'Produit retiré du panier' });
    
  } catch (error) {
    next(error);
  }
};

// Get user's cart
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get cart items with product details
    const [cartItems] = await pool.query(`
      SELECT 
        ci.id, 
        ci.productId, 
        ci.quantity,
        p.title,
        p.price,
        p.discount,
        p.stock,
        p.images,
        (p.price * (1 - p.discount/100) * ci.quantity) as subtotal
      FROM cart_items ci
      JOIN products p ON ci.productId = p.id
      WHERE ci.userId = ?
    `, [userId]);
    
    // Process items
    const processedItems = cartItems.map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : [],
      originalPrice: item.price,
      discountedPrice: item.price * (1 - item.discount/100),
    }));
    
    // Calculate totals
    const totalQuantity = processedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = processedItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    res.json({
      cartItems: processedItems,
      summary: {
        totalItems: processedItems.length,
        totalQuantity,
        totalPrice
      }
    });
    
  } catch (error) {
    next(error);
  }
};