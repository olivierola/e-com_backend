const { pool } = require('../config/db');

// Create a new product
exports.createProduct = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      price, 
      stock, 
      categoryId, 
      images = [], 
      characteristics = [] 
    } = req.body;
    
    // Validate required fields
    if (!title || !price) {
      return res.status(400).json({ error: 'Titre et prix requis' });
    }
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create product
      const [productResult] = await connection.query(
        'INSERT INTO products (title, description, price, stock, categoryId, images) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, price, stock || 0, categoryId, JSON.stringify(images)]
      );
      
      const productId = productResult.insertId;
      
      // Add characteristics if any
      if (characteristics && characteristics.length > 0) {
        for (const char of characteristics) {
          if (char.name && char.value) {
            await connection.query(
              'INSERT INTO product_characteristics (productId, name, value) VALUES (?, ?, ?)',
              [productId, char.name, char.value]
            );
          }
        }
      }
      
      // Commit transaction
      await connection.commit();
      connection.release();
      
      res.status(201).json({
        message: 'Produit créé avec succès',
        product: {
          id: productId,
          title,
          description,
          price,
          stock,
          categoryId,
          images,
          characteristics
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

// Update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      price, 
      stock, 
      categoryId, 
      images,
      characteristics 
    } = req.body;
    
    // Check if product exists
    const [products] = await pool.query('SELECT id FROM products WHERE id = ?', [id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Build update query based on provided fields
      const updateFields = [];
      const updateValues = [];
      
      if (title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(title);
      }
      
      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      
      if (price !== undefined) {
        updateFields.push('price = ?');
        updateValues.push(price);
      }
      
      if (stock !== undefined) {
        updateFields.push('stock = ?');
        updateValues.push(stock);
      }
      
      if (categoryId !== undefined) {
        updateFields.push('categoryId = ?');
        updateValues.push(categoryId);
      }
      
      if (images !== undefined) {
        updateFields.push('images = ?');
        updateValues.push(JSON.stringify(images));
      }
      
      if (updateFields.length > 0) {
        const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
        await connection.query(updateQuery, [...updateValues, id]);
      }
      
      // Update characteristics if provided
      if (characteristics !== undefined) {
        // Remove existing characteristics
        await connection.query('DELETE FROM product_characteristics WHERE productId = ?', [id]);
        
        // Add new characteristics
        if (characteristics && characteristics.length > 0) {
          for (const char of characteristics) {
            if (char.name && char.value) {
              await connection.query(
                'INSERT INTO product_characteristics (productId, name, value) VALUES (?, ?, ?)',
                [id, char.name, char.value]
              );
            }
          }
        }
      }
      
      // Commit transaction
      await connection.commit();
      connection.release();
      
      res.json({ message: 'Produit mis à jour avec succès', productId: id });
      
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
    
  } catch (error) {
    next(error);
  }
};

// Add discount to a product
exports.addDiscount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { discount } = req.body;
    
    // Validate discount
    if (discount === undefined || discount < 0 || discount > 100) {
      return res.status(400).json({ error: 'Réduction invalide (doit être entre 0 et 100)' });
    }
    
    // Check if product exists
    const [products] = await pool.query('SELECT id FROM products WHERE id = ?', [id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Update discount
    await pool.query('UPDATE products SET discount = ? WHERE id = ?', [discount, id]);
    
    res.json({ 
      message: 'Réduction appliquée avec succès',
      productId: id,
      discount
    });
    
  } catch (error) {
    next(error);
  }
};

// Delete a product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Delete product (CASCADE will handle related records)
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json({ message: 'Produit supprimé avec succès' });
    
  } catch (error) {
    next(error);
  }
};

// Create a category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Nom de catégorie requis' });
    }
    
    // Check if category already exists
    const [existingCategories] = await pool.query('SELECT id FROM categories WHERE name = ?', [name]);
    
    if (existingCategories.length > 0) {
      return res.status(400).json({ error: 'Cette catégorie existe déjà' });
    }
    
    // Create category
    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    
    res.status(201).json({
      message: 'Catégorie créée avec succès',
      category: {
        id: result.insertId,
        name,
        description
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if category has products
    const [products] = await pool.query('SELECT COUNT(*) as count FROM products WHERE categoryId = ?', [id]);
    
    if (products[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cette catégorie contient des produits', 
        productCount: products[0].count
      });
    }
    
    // Delete category
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    
    res.json({ message: 'Catégorie supprimée avec succès' });
    
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { 
      status, 
      startDate, 
      endDate, 
      userId,
      page = 1,
      limit = 10
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query conditions
    let conditions = [];
    let params = [];
    
    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
    }
    
    if (startDate) {
      conditions.push('o.createdAt >= ?');
      params.push(new Date(startDate));
    }
    
    if (endDate) {
      conditions.push('o.createdAt <= ?');
      params.push(new Date(endDate));
    }
    
    if (userId) {
      conditions.push('o.userId = ?');
      params.push(userId);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      params
    );
    
    const totalOrders = countResult[0].total;
    const totalPages = Math.ceil(totalOrders / parseInt(limit));
    
    // Get orders with pagination
    const [orders] = await pool.query(`
      SELECT 
        o.id, 
        o.userId,
        u.fullName as userName,
        o.totalAmount,
        o.status,
        o.deliveryAddress,
        o.deliveryId,
        d.fullName as deliveryPersonName,
        o.createdAt,
        o.updatedAt,
        COUNT(oi.id) as itemCount
      FROM orders o
      JOIN users u ON o.userId = u.id
      LEFT JOIN users d ON o.deliveryId = d.id
      JOIN order_items oi ON o.id = oi.orderId
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.createdAt DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);
    
    res.json({
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// View stock report
exports.getStockReport = async (req, res, next) => {
  try {
    const { 
      lowStock, 
      categoryId,
      search,
      page = 1,
      limit = 10
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query conditions
    let conditions = [];
    let params = [];
    
    if (lowStock) {
      const threshold = parseInt(lowStock);
      conditions.push('p.stock <= ?');
      params.push(threshold);
    }
    
    if (categoryId) {
      conditions.push('p.categoryId = ?');
      params.push(categoryId);
    }
    
    if (search) {
      conditions.push('p.title LIKE ?');
      params.push(`%${search}%`);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      params
    );
    
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    
    // Get stock report
    const [stockReport] = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.stock,
        p.price,
        c.name as categoryName,
        (SELECT SUM(oi.quantity) FROM order_items oi
         JOIN orders o ON oi.orderId = o.id
         WHERE oi.productId = p.id AND o.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ) as monthlySales
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      ${whereClause}
      ORDER BY p.stock ASC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);
    
    // Get summary stats
    const [summary] = await pool.query(`
      SELECT 
        COUNT(*) as totalProducts,
        SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as outOfStockProducts,
        SUM(CASE WHEN stock < 10 THEN 1 ELSE 0 END) as lowStockProducts,
        AVG(stock) as averageStock
      FROM products
    `);
    
    res.json({
      stockReport,
      summary: summary[0],
      pagination: {
        totalProducts,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Get sales report
exports.getSalesReport = async (req, res, next) => {
  try {
    const { 
      period = 'monthly', // daily, weekly, monthly, yearly
      startDate,
      endDate,
      categoryId
    } = req.query;
    
    // Set time format and grouping based on period
    let timeFormat;
    let groupBy;
    
    switch (period) {
      case 'daily':
        timeFormat = '%Y-%m-%d';
        groupBy = 'DATE(o.createdAt)';
        break;
      case 'weekly':
        timeFormat = '%Y-%u';
        groupBy = 'YEARWEEK(o.createdAt)';
        break;
      case 'monthly':
        timeFormat = '%Y-%m';
        groupBy = 'DATE_FORMAT(o.createdAt, "%Y-%m")';
        break;
      case 'yearly':
        timeFormat = '%Y';
        groupBy = 'YEAR(o.createdAt)';
        break;
      default:
        timeFormat = '%Y-%m';
        groupBy = 'DATE_FORMAT(o.createdAt, "%Y-%m")';
    }
    
    // Build query conditions
    let conditions = ['o.status = "delivered"']; // Only count completed orders
    let params = [];
    
    if (startDate) {
      conditions.push('o.createdAt >= ?');
      params.push(new Date(startDate));
    }
    
    if (endDate) {
      conditions.push('o.createdAt <= ?');
      params.push(new Date(endDate));
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get sales by time period
    const [salesByPeriod] = await pool.query(`
      SELECT 
        DATE_FORMAT(o.createdAt, '${timeFormat}') as period,
        SUM(o.totalAmount) as totalSales,
        COUNT(DISTINCT o.id) as orderCount,
        COUNT(DISTINCT o.userId) as customerCount
      FROM orders o
      ${whereClause}
      GROUP BY ${groupBy}
      ORDER BY period ASC
    `, params);
    
    // Get total sales summary
    const [salesSummary] = await pool.query(`
      SELECT 
        SUM(o.totalAmount) as totalSales,
        COUNT(DISTINCT o.id) as totalOrders,
        COUNT(DISTINCT o.userId) as totalCustomers,
        AVG(o.totalAmount) as averageOrderValue
      FROM orders o
      ${whereClause}
    `, params);
    
    // Get top selling products
    const topProductsQuery = `
      SELECT 
        p.id,
        p.title,
        SUM(oi.quantity) as totalQuantitySold,
        SUM(oi.price * oi.quantity) as totalRevenue
      FROM order_items oi
      JOIN orders o ON oi.orderId = o.id
      JOIN products p ON oi.productId = p.id
      ${whereClause} ${categoryId ? 'AND p.categoryId = ?' : ''}
      GROUP BY p.id
      ORDER BY totalRevenue DESC
      LIMIT 10
    `;
    
    const topProductsParams = categoryId 
      ? [...params, categoryId]
      : params;
    
    const [topProducts] = await pool.query(topProductsQuery, topProductsParams);
    
    // Get sales by category
    const [salesByCategory] = await pool.query(`
      SELECT 
        c.id,
        c.name,
        SUM(oi.price * oi.quantity) as totalRevenue,
        COUNT(DISTINCT o.id) as orderCount
      FROM order_items oi
      JOIN orders o ON oi.orderId = o.id
      JOIN products p ON oi.productId = p.id
      LEFT JOIN categories c ON p.categoryId = c.id
      ${whereClause}
      GROUP BY c.id
      ORDER BY totalRevenue DESC
    `, params);
    
    res.json({
      salesByPeriod,
      salesSummary: salesSummary[0],
      topProducts,
      salesByCategory
    });
    
  } catch (error) {
    next(error);
  }
};