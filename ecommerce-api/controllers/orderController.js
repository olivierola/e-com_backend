const { pool } = require('../config/db');

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const { deliveryAddress } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!deliveryAddress) {
      return res.status(400).json({ error: 'Adresse de livraison requise' });
    }
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Get cart items
      const [cartItems] = await connection.query(`
        SELECT 
          ci.productId, 
          ci.quantity,
          p.price,
          p.discount,
          p.stock,
          p.title
        FROM cart_items ci
        JOIN products p ON ci.productId = p.id
        WHERE ci.userId = ?
      `, [userId]);
      
      if (cartItems.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ error: 'Panier vide' });
      }
      
      // Check stock availability and calculate total
      let totalAmount = 0;
      const outOfStockProducts = [];
      
      for (const item of cartItems) {
        if (item.stock < item.quantity) {
          outOfStockProducts.push({
            productId: item.productId,
            title: item.title,
            requestedQuantity: item.quantity,
            availableStock: item.stock
          });
        }
        
        // Calculate discounted price
        const discountedPrice = item.price * (1 - item.discount/100);
        totalAmount += discountedPrice * item.quantity;
      }
      
      if (outOfStockProducts.length > 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ 
          error: 'Produits en rupture de stock',
          outOfStockProducts
        });
      }
      
      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (userId, totalAmount, deliveryAddress, status) VALUES (?, ?, ?, ?)',
        [userId, totalAmount, deliveryAddress, 'pending']
      );
      
      const orderId = orderResult.insertId;
      
      // Create order items and update stock
      for (const item of cartItems) {
        const discountedPrice = item.price * (1 - item.discount/100);
        
        // Add order item
        await connection.query(
          'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, discountedPrice]
        );
        
        // Update stock
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }
      
      // Clear cart
      await connection.query('DELETE FROM cart_items WHERE userId = ?', [userId]);
      
      // Commit transaction
      await connection.commit();
      connection.release();
      
      res.status(201).json({
        message: 'Commande créée avec succès',
        order: {
          id: orderId,
          totalAmount,
          status: 'pending',
          deliveryAddress
        }
      });
      
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
    
  } catch (error) {
    next(error);
  }
};

// Get order details by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    
    // Get order with items
    const [orders] = await pool.query(`
      SELECT 
        o.id, 
        o.totalAmount,
        o.status,
        o.deliveryAddress,
        o.createdAt,
        o.updatedAt,
        CASE 
          WHEN u.id = ? THEN u.fullName
          ELSE NULL
        END as deliveryPerson
      FROM orders o
      LEFT JOIN users u ON o.deliveryId = u.id
      WHERE o.id = ? AND o.userId = ?
    `, [userId, orderId, userId]);
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    const order = orders[0];
    
    // Get order items
    const [orderItems] = await pool.query(`
      SELECT 
        oi.id,
        oi.productId,
        oi.quantity,
        oi.price,
        p.title,
        p.images
      FROM order_items oi
      JOIN products p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `, [orderId]);
    
    // Process items
    const processedItems = orderItems.map(item => ({
      ...item,
      images: Array.isArray(item.images)
      ? item.images
      : typeof item.images === 'string'
        ? JSON.parse(item.images)
        : [],

      subtotal: item.price * item.quantity
    }));
    
    res.json({
      order: {
        ...order,
        items: processedItems
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Get all orders for current user
exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM orders WHERE userId = ?',
      [userId]
    );
    
    const totalOrders = countResult[0].total;
    const totalPages = Math.ceil(totalOrders / limit);
    
    // Get orders
    const [orders] = await pool.query(`
      SELECT 
        o.id, 
        o.totalAmount,
        o.status,
        o.createdAt,
        o.updatedAt,
        COUNT(oi.id) as itemCount
      FROM orders o
      JOIN order_items oi ON o.id = oi.orderId
      WHERE o.userId = ?
      GROUP BY o.id
      ORDER BY o.createdAt DESC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);
    
    res.json({
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit
      }
    });
    
  } catch (error) {
    next(error);
  }
};