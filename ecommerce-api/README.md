# E-commerce API

## Description
This project is a complete E-commerce API built with Express and Node.js. It provides a RESTful interface for managing users, products, orders, and more, following best practices for API development.

## Features
- User authentication and authorization
- Product management (CRUD operations)
- Cart management
- Order processing
- Admin functionalities
- Swagger API documentation
- Integration with Deepseek API for enhanced features

## Project Structure
```
ecommerce-api/
├── config/
│   ├── db.js
│   ├── swagger.js
│   └── deepseek.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── chatController.js
│   ├── deliveryController.js
│   ├── orderController.js
│   └── productController.js
├── middlewares/
│   ├── admin.js
│   ├── auth.js
│   ├── delivery.js
│   └── errorHandler.js
├── models/
│   ├── Cart.js
│   ├── Category.js
│   ├── Comment.js
│   ├── Order.js
│   ├── Product.js
│   ├── ProductCharacteristic.js
│   ├── Rating.js
│   └── User.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── chatRoutes.js
│   ├── deliveryRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
├── utils/
│   ├── jwtUtils.js
│   ├── passwordUtils.js
│   └── validation.js
├── app.js
├── server.js
├── package.json
└── .env
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ecommerce-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and configure your environment variables. You can use the provided `.env.example` as a reference.

4. Initialize the database:
   - Ensure your MySQL server is running.
   - Update the database configuration in the `.env` file.
   - Run the database initialization script by executing:
     ```
     node -e "require('./config/db').initDatabase()"
     ```

5. Start the server:
   ```
   npm run dev
   ```

## Usage
- The API is accessible at `http://localhost:3000`.
- Use tools like Postman or Swagger UI to interact with the API endpoints.

## API Documentation
API documentation is available via Swagger. Once the server is running, navigate to `http://localhost:3000/api-docs` to view the documentation.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.