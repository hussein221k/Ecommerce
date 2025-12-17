# E-Commerce Backend API

A complete Node.js/Express backend for the e-commerce application with MongoDB integration.

## Features

- ✅ RESTful API endpoints
- ✅ MongoDB integration with Mongoose
- ✅ User authentication & JWT
- ✅ Product management
- ✅ Order management
- ✅ Shopping cart functionality
- ✅ Error handling middleware
- ✅ CORS enabled

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── Product.js            # Product schema
│   ├── User.js               # User schema with authentication
│   ├── Order.js              # Order schema
│   └── Cart.js               # Cart schema
├── controllers/
│   ├── productController.js  # Product logic
│   ├── userController.js     # Auth & user logic
│   ├── orderController.js    # Order logic
│   └── cartController.js     # Cart logic
├── routes/
│   ├── products.js           # Product routes
│   ├── users.js              # User routes
│   ├── orders.js             # Order routes
│   └── cart.js               # Cart routes
├── middleware/
│   ├── auth.js               # JWT authentication
│   └── errorHandler.js       # Error handling
├── .env                      # Environment variables
├── package.json              # Dependencies
└── server.js                 # Main server file
```

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with your MongoDB URI and other settings.

## Running the Server

### Development (with auto-reload):
```bash
npm run dev
```

### Production:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Users (Authentication)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `PUT /api/orders/:id` - Update order status (admin)
- `PUT /api/orders/:id/cancel` - Cancel order (protected)
- `GET /api/orders/admin/all` - Get all orders (admin)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `POST /api/cart/remove` - Remove item from cart (protected)
- `PUT /api/cart/update` - Update cart item quantity (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting a Token

1. Register or login to get a token
2. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Example Request
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/users/profile
```

## Request/Response Examples

### Register User
```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Add to Cart
```bash
POST /api/cart/add
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "65abc123...",
  "quantity": 1,
  "selectedSize": "M"
}
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": "65abc123...",
      "quantity": 2,
      "selectedSize": "L"
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card",
  "totalAmount": 199.98
}
```

## Environment Variables

The `.env` file contains:
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT signing
- `NODE_ENV` - Environment (development/production)

## Database Models

### Product
- id, name, price, description, image, category, sizes, rating, stock, reviews

### User
- name, email, password (hashed), phone, address, role, isActive

### Order
- orderNumber, userId, items, totalAmount, status, shippingAddress, paymentMethod, paymentStatus

### Cart
- userId, items, totalPrice

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Connecting Frontend to Backend

Update your frontend API calls to point to `http://localhost:5000/api/`

Example using fetch:
```javascript
const response = await fetch('http://localhost:5000/api/products');
const data = await response.json();
```

## Security Notes

- Always use HTTPS in production
- Change the JWT_SECRET in production
- Store sensitive data in environment variables
- Implement rate limiting for production
- Add input validation (validator package already installed)

## Next Steps

1. Create admin middleware to restrict admin endpoints
2. Add payment gateway integration (Stripe/PayPal)
3. Implement email notifications
4. Add product image upload functionality
5. Set up production database backups
6. Add logging system (Winston/Morgan)
7. Implement caching (Redis)

## Support

For issues or questions, check the routes and controllers for detailed implementation.

---

**Backend running on MongoDB Atlas with your cluster!**
