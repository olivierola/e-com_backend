class User {
  constructor(id, email, password, fullName, role, createdAt, updatedAt) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDatabaseRow(row) {
    return new User(
      row.id,
      row.email,
      row.password,
      row.fullName,
      row.role,
      row.createdAt,
      row.updatedAt
    );
  }
}

module.exports = User;