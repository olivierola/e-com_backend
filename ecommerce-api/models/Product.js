class Product {
  constructor(id, title, description, price, stock, categoryId, discount, images, createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.categoryId = categoryId;
    this.discount = discount;
    this.images = images;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Method to calculate the final price after discount
  getFinalPrice() {
    return this.price - (this.price * (this.discount / 100));
  }

  // Method to check if the product is in stock
  isInStock() {
    return this.stock > 0;
  }
}

module.exports = Product;