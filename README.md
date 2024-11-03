# SecondaryDAO APIs as of 2/6/24 for website, non-frontend

Lightsail
Secondary-dao-api
2 GB RAM, 2 vCPUs, 60 GB SSD

34.238.228.191 
2600:1f18:1b91:7900:c728:4ad8:4081:4c68

https://lightsail.aws.amazon.com/ls/webapp/home/instances



# Complete API Documentation

## Category Management
### 1. Create Category
- **Location**: `./routes/categorydb.js`
- **Endpoint**: `POST /api/category`
- **Functionality**: Creates a new category in the database.
- **Access Level**: Public
- **Input**: `req.body` containing category details
- **Output**:
  - **200**: Newly created category object
  - **500**: Server error if creation fails

### 2. Get All Categories
- **Location**: `./routes/categorydb.js`
- **Endpoint**: `GET /api/category`
- **Functionality**: Retrieves all categories.
- **Access Level**: Public
- **Output**:
  - **200**: List of all categories
  - **500**: Server error if retrieval fails

## User Authentication
### 3. Login
- **Location**: `./routes/login.js`
- **Endpoint**: `POST /api/login`
- **Functionality**: Authenticates a user by email and password.
- **Access Level**: Public
- **Input**: `req.body` with `email` and `password`
- **Output**:
  - **200**: JWT token if authentication succeeds
  - **400**: "Invalid email or password" on failure

## User Management
### 4. Get All Users
- **Location**: `./routes/users.js`
- **Endpoint**: `GET /api/users`
- **Functionality**: Retrieves a list of all users (Admin access required).
- **Access Level**: Admin
- **Output**:
  - **200**: List of user objects
  - **500**: Server error if retrieval fails

### 5. Get User by ID
- **Location**: `./routes/users.js`
- **Endpoint**: `GET /api/users/find/:id`
- **Functionality**: Retrieves user details by ID.
- **Access Level**: Public
- **Input**: `req.params.id` (User ID)
- **Output**:
  - **200**: User details
  - **500**: Server error if retrieval fails

### 6. Update User
- **Location**: `./routes/users.js`
- **Endpoint**: `PUT /api/users/:id`
- **Functionality**: Updates user information by ID.
- **Access Level**: Admin
- **Input**: `req.params.id` and `req.body` (Updated user data)
- **Output**:
  - **200**: Confirmation of update
  - **500**: Server error if update fails

### 7. Delete User
- **Location**: `./routes/users.js`
- **Endpoint**: `DELETE /api/users/:id`
- **Functionality**: Deletes a user by ID.
- **Access Level**: Admin
- **Input**: `req.params.id` (User ID)
- **Output**:
  - **200**: Confirmation of deletion
  - **500**: Server error if deletion fails

## Product Management
### 8. Create Product
- **Location**: `./routes/products.js`
- **Endpoint**: `POST /api/products/:id`
- **Functionality**: Creates a new product in the database.
- **Access Level**: Admin
- **Input**: `req.body` with product details
- **Output**:
  - **200**: Created product object
  - **500**: Server error if creation fails

### 9. Update Token Price
- **Location**: `./routes/products.js`
- **Endpoint**: `GET /api/products/update/:id`
- **Functionality**: Updates the token price for a product.
- **Access Level**: Admin
- **Input**: `req.params.id` (Product ID)
- **Output**:
  - **200**: Transaction receipt
  - **500**: Server error if update fails

### 10. Delete Product
- **Location**: `./routes/products.js`
- **Endpoint**: `DELETE /api/products/:id`
- **Functionality**: Deletes a product by its ID.
- **Access Level**: Admin
- **Input**: `req.params.id` (Product ID)
- **Output**:
  - **200**: Confirmation of deletion
  - **500**: Server error if deletion fails

## Order Management
### 11. Create Order Match
- **Location**: `./routes/orderMatching.js`
- **Endpoint**: `POST /api/orderMatching`
- **Functionality**: Creates an order match entry between buyer and seller.
- **Access Level**: Public
- **Input**: `req.body` with details such as `orderId`, `BuyersAddress`, and `SellersAddress`
- **Output**:
  - **200**: Saved order matching object
  - **500**: Server error if creation fails

### 12. Approve Order Match
- **Location**: `./routes/orderMatching.js`
- **Endpoint**: `PUT /api/orderMatching/approve/:id`
- **Functionality**: Approves an order match.
- **Access Level**: Admin
- **Input**: `req.params.id` (Order match ID)
- **Output**:
  - **200**: Approval confirmation
  - **500**: Server error if approval fails

### 13. Delete Order Match
- **Location**: `./routes/orderMatching.js`
- **Endpoint**: `DELETE /api/orderMatching/:id`
- **Functionality**: Deletes an order match by ID.
- **Access Level**: Admin
- **Input**: `req.params.id` (Order match ID)
- **Output**:
  - **200**: Confirmation of deletion
  - **500**: Server error if deletion fails

## Seller Orders
### 14. Create Seller Order
- **Location**: `./routes/sellerOrder.js`
- **Endpoint**: `POST /api/sellerOrder`
- **Functionality**: Creates a new seller order.
- **Access Level**: Public
- **Input**: `req.body` containing order details
- **Output**:
  - **200**: Newly created seller order object
  - **500**: Server error if creation fails

### 15. Delete Seller Order
- **Location**: `./routes/sellerOrder.js`
- **Endpoint**: `DELETE /api/sellerOrder/:id`
- **Functionality**: Deletes a seller order by its ID.
- **Access Level**: Admin
- **Input**: `req.params.id` (Seller order ID)
- **Output**:
  - **200**: Confirmation of deletion
  - **500**: Server error if deletion fails

## User Registration
### 16. Register User
- **Location**: `./routes/register.js`
- **Endpoint**: `POST /api/register`
- **Functionality**: Registers a new user and creates a wallet address for them.
- **Access Level**: Public
- **Input**: `req.body` containing user details like name, email, and password
- **Output**:
  - **200**: JWT token for the new user
  - **500**: Error if registration fails

## KYC Management
### 17. KYC Verification Callback
- **Location**: `./routes/kyc.js`
- **Endpoint**: `POST /api/kyc/kyc-callback`
- **Functionality**: Handles KYC verification callback data.
- **Access Level**: Public
- **Input**: `req.body` containing KYC verification data
- **Output**:
  - **200**: Confirmation of verification update
  - **500**: Server error if update fails
- **Input**: `req.params.id` (Order match ID)
- **Output**:
  - **200**: Confirmation of deletion
  - **500**: Server error if deletion fails
