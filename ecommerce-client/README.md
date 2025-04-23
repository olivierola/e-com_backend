# Project Overview

This project is an E-commerce client interface built using Vue.js and Vite. It provides a responsive and user-friendly interface for customers to browse products, manage their shopping cart, and complete purchases. The application is designed without external design libraries, relying solely on custom CSS for styling.

## Project Structure

The project is organized into several directories and files, each serving a specific purpose:

```
ecommerce-client/
├── public/
│   └── favicon.ico                # Favicon for the application
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css            # Main CSS styles
│   │   │   └── variables.css       # CSS variables for consistent styling
│   │   └── images/
│   │       └── logo.svg           # Logo image for the application
│   ├── components/
│   │   ├── common/                 # Common reusable components
│   │   │   ├── Alert.vue           # Component for displaying alerts
│   │   │   ├── Loader.vue          # Component for loading spinner
│   │   │   ├── Pagination.vue       # Component for pagination controls
│   │   │   ├── Rating.vue          # Component for displaying product ratings
│   │   │   └── StarRating.vue      # Component for star rating input
│   │   ├── layout/                 # Layout components
│   │   │   ├── TheHeader.vue       # Header layout component
│   │   │   ├── TheFooter.vue       # Footer layout component
│   │   │   └── Sidebar.vue         # Sidebar layout component
│   │   ├── cart/                   # Cart-related components
│   │   │   ├── CartItem.vue        # Component for individual cart item
│   │   │   └── CartSummary.vue     # Component for cart summary
│   │   ├── product/                # Product-related components
│   │   │   ├── ProductCard.vue     # Component for product card
│   │   │   ├── ProductFilter.vue    # Component for filtering products
│   │   │   ├── ProductList.vue     # Component for displaying product list
│   │   │   ├── ProductReviews.vue   # Component for displaying product reviews
│   │   │   └── ProductGallery.vue   # Component for product gallery
│   │   └── order/                  # Order-related components
│   │       ├── OrderItem.vue       # Component for individual order item
│   │       └── OrderSummary.vue     # Component for order summary
│   ├── views/                      # Application views
│   │   ├── HomeView.vue            # Home view of the application
│   │   ├── LoginView.vue           # Login view of the application
│   │   ├── RegisterView.vue        # Registration view of the application
│   │   ├── ProductListView.vue     # View for displaying product list
│   │   ├── ProductDetailView.vue    # View for displaying product details
│   │   ├── CartView.vue            # View for shopping cart
│   │   ├── CheckoutView.vue        # View for checkout process
│   │   ├── AccountView.vue         # View for user account details
│   │   ├── OrderListView.vue       # View for displaying list of orders
│   │   ├── OrderDetailView.vue     # View for displaying order details
│   │   └── ChatView.vue            # View for chat interface
│   ├── services/                   # API service files
│   │   ├── api.js                  # Axios instance for API calls
│   │   ├── auth.service.js         # Functions for user authentication
│   │   ├── product.service.js      # Functions for product-related API endpoints
│   │   ├── cart.service.js         # Functions for managing shopping cart
│   │   ├── order.service.js        # Functions for managing orders
│   │   └── chat.service.js         # Functions for sending chat messages
│   ├── store/                      # Pinia store files
│   │   ├── auth.js                 # Store for managing authentication state
│   │   ├── cart.js                 # Store for managing cart state
│   │   ├── product.js              # Store for managing product state
│   │   └── index.js                # Combines all Pinia stores
│   ├── router/                     # Vue Router configuration
│   │   └── index.js                # Defines routes for the application
│   ├── utils/                      # Utility functions
│   │   ├── validators.js           # Functions for validating user input
│   │   └── formatters.js           # Functions for formatting data
│   ├── App.vue                     # Root Vue component
│   └── main.js                     # Entry point of the application
├── index.html                      # Main HTML file for the application
├── vite.config.js                  # Vite configuration file
├── package.json                    # Project dependencies and scripts
└── README.md                       # Documentation for the project
```

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd ecommerce-client
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:8080` to view the application.

## Features

- User authentication (login, registration)
- Product browsing and filtering
- Shopping cart management
- Order management
- Chat interface for customer support

## Technologies Used

- Vue.js
- Vite
- Pinia (state management)
- Axios (HTTP requests)

## License

This project is licensed under the MIT License. See the LICENSE file for more details.