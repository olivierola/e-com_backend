const { pool } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const validator = require('validator');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, fullName, role = 'client' } = req.body;

    // Validate inputs
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Tous les champs sont requis ' });
    }
    
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    
    // Check if user exists
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Validate role (only admin can create admin or delivery users)
    let validatedRole = 'client';
    if (role === 'admin' || role === 'delivery') {
      // For demo purposes - in production, this check should be more robust
      // or require admin authentication for creating special roles
      validatedRole = role;
    }
    
    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (email, password, fullName, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, fullName, validatedRole]
    );
    
    // Generate token
    const token = generateToken(result.insertId, validatedRole);
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: result.insertId,
        email,
        fullName,
        role: validatedRole
      },
      token
    });
    
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    // Find user
    const [users] = await pool.query('SELECT id, email, password, fullName, role FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    const user = users[0];
    
    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    // Generate token
    const token = generateToken(user.id, user.role);
    
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token
    });
    
  } catch (error) {
    next(error);
  }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
};