class Comment {
  constructor(id, productId, userId, comment, createdAt) {
    this.id = id;
    this.productId = productId;
    this.userId = userId;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}

module.exports = Comment;