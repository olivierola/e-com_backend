class Rating {
  constructor(productId, userId, rating) {
    this.productId = productId;
    this.userId = userId;
    this.rating = rating;
  }

  static validateRating(rating) {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
  }
}

module.exports = Rating;