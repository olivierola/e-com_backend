const { pool } = require('./db');

// Create a new category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Validate inputs
    if (!name) {
      return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }

    // Create category
    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
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

// Update an existing category
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Validate inputs
    if (!name) {
      return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
    }

    // Update category
    await pool.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );

    res.json({ message: 'Catégorie mise à jour avec succès' });

  } catch (error) {
    next(error);
  }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete category
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);

    res.json({ message: 'Catégorie supprimée avec succès' });

  } catch (error) {
    next(error);
  }
};

// Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories');

    res.json({ categories });

  } catch (error) {
    next(error);
  }
};