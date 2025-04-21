const deliveryAuth = (req, res, next) => {
  // Check if user is authenticated and has delivery role
  if (!req.user || req.user.role !== 'delivery') {
    return res.status(403).json({ error: 'Accès interdit - Droits livreur requis' });
  }
  
  next();
};

module.exports = deliveryAuth;