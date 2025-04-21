class Cart {
  constructor(userId) {
    this.userId = userId;
    this.items = [];
  }

  addItem(productId, quantity) {
    const existingItem = this.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ productId, quantity });
    }
  }

  updateItemQuantity(productId, quantity) {
    const existingItem = this.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity = quantity;
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.productId !== productId);
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
  }
}

module.exports = Cart;