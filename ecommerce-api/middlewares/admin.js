const adminAuth = (req, res, next) => {
  // Check if user is authenticated and has admin role
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès interdit - Droits administrateur requis' });
  }
  
  next();
};

module.exports = adminAuth;