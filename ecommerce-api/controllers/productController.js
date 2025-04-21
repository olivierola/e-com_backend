const { pool } = require('../config/db');

// Get all products with pagination
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count for pagination
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM products');
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);
    
    // Get products with pagination
    const [products] = await pool.query(`
      SELECT 
        p.*, 
        c.name as categoryName,
        COALESCE(AVG(r.rating), 0) as averageRating,
        COUNT(DISTINCT r.id) as ratingCount,
        COUNT(DISTINCT cm.id) as commentCount
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN ratings r ON p.id = r.productId
      LEFT JOIN comments cm ON p.id = cm.productId
      GROUP BY p.id
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    // Get characteristics for all fetched products
    const productIds = products.map(p => p.id);
    
    if (productIds.length > 0) {
      const [characteristics] = await pool.query(`
        SELECT * FROM product_characteristics 
        WHERE productId IN (${productIds.join(',')})
      `);
      
      // Group characteristics by product
      const charByProduct = characteristics.reduce((acc, char) => {
        if (!acc[char.productId]) {
          acc[char.productId] = [];
        }
        acc[char.productId].push({
          name: char.name,
          value: char.value
        });
        return acc;
      }, {});
      
      // Add characteristics to products
      products.forEach(product => {
        product.characteristics = charByProduct[product.id] || [];
        // Parse images from JSON
        if (product.images) {
          product.images = JSON.parse(product.images);
        } else {
          product.images = [];
        }
      });
    }
    
    res.json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Get product categories
exports.getCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(`
      SELECT c.*, COUNT(p.id) as productCount
      FROM categories c
      LEFT JOIN products p ON c.id = p.categoryId
      GROUP BY c.id
    `);
    
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

// Search products with filters
exports.searchProducts = async (req, res, next) => {
  try {
    const {
      name,
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      page = 1,
      limit = 10
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query conditions
    let conditions = [];
    let params = [];
    
    if (name) {
      conditions.push('p.title LIKE ?');
      params.push(`%${name}%`);
    }
    
    if (category) {
      conditions.push('c.id = ? OR c.name LIKE ?');
      params.push(category, `%${category}%`);
    }
    
    if (minPrice) {
      conditions.push('p.price >= ?');
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      conditions.push('p.price <= ?');
      params.push(parseFloat(maxPrice));
    }
    
    if (minRating) {
      conditions.push('AVG(r.rating) >= ?');
      params.push(parseFloat(minRating));
    }
    
    if (inStock === 'true') {
      conditions.push('p.stock > 0');
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count for pagination
    const [countResult] = await pool.query(`
      SELECT COUNT(DISTINCT p.id) as total 
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN ratings r ON p.id = r.productId
      ${whereClause}
    `, params);
    
    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    
    // Get search results
    const queryParams = [...params, parseInt(limit), offset];
    const [products] = await pool.query(`
      SELECT 
        p.*, 
        c.name as categoryName,
        COALESCE(AVG(r.rating), 0) as averageRating,
        COUNT(DISTINCT r.id) as ratingCount,
        COUNT(DISTINCT cm.id) as commentCount
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN ratings r ON p.id = r.productId
      LEFT JOIN comments cm ON p.id = cm.productId
      ${whereClause}
      GROUP BY p.id
      LIMIT ? OFFSET ?
    `, queryParams);
    
    // Get characteristics for all fetched products
    const productIds = products.map(p => p.id);
    
    if (productIds.length > 0) {
      const [characteristics] = await pool.query(`
        SELECT * FROM product_characteristics 
        WHERE productId IN (${productIds.join(',')})
      `);
      
      // Group characteristics by product
      const charByProduct = characteristics.reduce((acc, char) => {
        if (!acc[char.productId]) {
          acc[char.productId] = [];
        }
        acc[char.productId].push({
          name: char.name,
          value: char.value
        });
        return acc;
      }, {});
      
      // Add characteristics to products
      products.forEach(product => {
        product.characteristics = charByProduct[product.id] || [];
        // Parse images from JSON
        if (product.images) {
          product.images = JSON.parse(product.images);
        } else {
          product.images = [];
        }
      });
    }
    
    res.json({
      products,
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

// Rate a product
exports.rateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'La note doit être entre 1 et 5' });
    }
    
    // Check if product exists
    const [products] = await pool.query('SELECT id FROM products WHERE id = ?', [productId]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Check if user has already rated this product
    const [existingRatings] = await pool.query(
      'SELECT id FROM ratings WHERE productId = ? AND userId = ?',
      [productId, userId]
    );
    
    if (existingRatings.length > 0) {
      // Update existing rating
      await pool.query(
        'UPDATE ratings SET rating = ? WHERE productId = ? AND userId = ?',
        [rating, productId, userId]
      );
      
      return res.json({ message: 'Note mise à jour avec succès' });
    }
    
    // Create new rating
    await pool.query(
      'INSERT INTO ratings (productId, userId, rating) VALUES (?, ?, ?)',
      [productId, userId, rating]
    );
    
    res.status(201).json({ message: 'Produit noté avec succès' });
    
  } catch (error) {
    next(error);
  }
};

// Comment on a product
exports.commentProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    
    // Validate comment
    if (!comment || comment.trim() === '') {
      return res.status(400).json({ error: 'Le commentaire ne peut pas être vide' });
    }
    
    // Check if product exists
    const [products] = await pool.query('SELECT id FROM products WHERE id = ?', [productId]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Create comment
    await pool.query(
      'INSERT INTO comments (productId, userId, comment) VALUES (?, ?, ?)',
      [productId, userId, comment]
    );
    
    res.status(201).json({ message: 'Commentaire ajouté avec succès' });
    
  } catch (error) {
    next(error);
  }
};