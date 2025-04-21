class Category {
  constructor(id, name, description, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDatabaseRow(row) {
    return new Category(
      row.id,
      row.name,
      row.description,
      row.createdAt,
      row.updatedAt
    );
  }
}

module.exports = Category;