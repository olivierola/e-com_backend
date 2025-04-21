const { pool } = require('../config/db');

// Get orders assigned to delivery person
exports.getDeliveryOrders = async (req, res, next) => {
  try {
    const deliveryId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query conditions
    let conditions = ['o.deliveryId = ?'];
    let params = [deliveryId];
    
    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
    } else {
      // By default, show orders that are in delivery process
      conditions.push('o.status IN ("processing", "picked_up", "in_transit")');
    }
    
    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    
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
        u.fullName as customerName,
        o.totalAmount,
        o.status,
        o.deliveryAddress,
        o.createdAt,
        o.updatedAt,
        COUNT(oi.id) as itemCount
      FROM orders o
      JOIN users u ON o.userId = u.id
      JOIN order_items oi ON o.id = oi.orderId
      ${whereClause}
      GROUP BY o.id
      ORDER BY 
        CASE 
          WHEN o.status = 'processing' THEN 1
          WHEN o.status = 'picked_up' THEN 2
          WHEN o.status = 'in_transit' THEN 3
          ELSE 4
        END,
        o.createdAt ASC
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

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const deliveryId = req.user.id;
    
    // Validate status
    const validStatuses = ['picked_up', 'in_transit', 'delivered'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Statut invalide',
        validStatuses
      });
    }
    
    // Check if order exists and is assigned to this delivery person
    const [orders] = await pool.query(
      'SELECT id, status FROM orders WHERE id = ? AND deliveryId = ?',
      [orderId, deliveryId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ 
        error: 'Commande non trouvée ou non assignée à ce livreur'
      });
    }
    
    const currentStatus = orders[0].status;
    
    // Validate status transition
    let isValidTransition = false;
    
    switch (currentStatus) {
      case 'processing':
        isValidTransition = status === 'picked_up';
        break;
      case 'picked_up':
        isValidTransition = status === 'in_transit';
        break;
      case 'in_transit':
        isValidTransition = status === 'delivered';
        break;
      default:
        isValidTransition = false;
    }
    
    if (!isValidTransition) {
      return res.status(400).json({ 
        error: `Transition de statut invalide de "${currentStatus}" à "${status}"`,
        currentStatus,
        allowedNextStatus: getNextAllowedStatus(currentStatus)
      });
    }
    
    // Update status
    await pool.query(
      'UPDATE orders SET status = ?, updatedAt = NOW() WHERE id = ?',
      [status, orderId]
    );
    
    res.json({ 
      message: 'Statut de la commande mis à jour',
      orderId,
      newStatus: status
    });
    
  } catch (error) {
    next(error);
  }
};

// Complete delivery
exports.completeDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const deliveryId = req.user.id;
    
    // Check if order exists and is assigned to this delivery person
    const [orders] = await pool.query(
      'SELECT id, status, userId FROM orders WHERE id = ? AND deliveryId = ?',
      [orderId, deliveryId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ 
        error: 'Commande non trouvée ou non assignée à ce livreur'
      });
    }
    
    const order = orders[0];
    
    // Check if order is in the right status
    if (order.status !== 'in_transit') {
      return res.status(400).json({ 
        error: 'La commande doit être en transit pour être complétée',
        currentStatus: order.status
      });
    }
    
    // Update status to delivered
    await pool.query(
      'UPDATE orders SET status = "delivered", updatedAt = NOW() WHERE id = ?',
      [orderId]
    );
    
    // Here you would typically trigger a notification to the customer
    // This is just a placeholder - you would implement actual notification logic
    console.log(`Notification sent to user ${order.userId}: Your order #${orderId} has been delivered.`);
    
    res.json({ 
      message: 'Livraison complétée avec succès',
      orderId,
      status: 'delivered'
    });
    
  } catch (error) {
    next(error);
  }
};

// Helper function to get next allowed status
function getNextAllowedStatus(currentStatus) {
  switch (currentStatus) {
    case 'processing': return ['picked_up'];
    case 'picked_up': return ['in_transit'];
    case 'in_transit': return ['delivered'];
    case 'delivered': return [];
    default: return [];
  }
}