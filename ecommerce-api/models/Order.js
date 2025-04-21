class Order {
  constructor(id, userId, totalAmount, status, deliveryAddress, deliveryId, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.totalAmount = totalAmount;
    this.status = status;
    this.deliveryAddress = deliveryAddress;
    this.deliveryId = deliveryId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Method to update the order status
  updateStatus(newStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  // Method to get order details
  getOrderDetails() {
    return {
      id: this.id,
      userId: this.userId,
      totalAmount: this.totalAmount,
      status: this.status,
      deliveryAddress: this.deliveryAddress,
      deliveryId: this.deliveryId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Order;