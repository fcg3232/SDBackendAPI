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
- **Functionality**: Creates a new category.
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
- **Functionality**: Authenticates a user.
- **Access Level**: Public
- **Input**: `req.body` with `email` and `password`
- **Output**:
  - **200**: JWT token if authentication succeeds
  - **400**: "Invalid email or password" on failure


## User Management
### 4. Get All Users
- **Location**: `./routes/users.js`
- **Endpoint**: `GET /api/users`
- **Functionality**: Retrieves a list of all users.
- **Access Level**: Admin
- **Output**:
  - **200**: List of users
  - **500**: Server error if retrieval fails

### 5. Get User by ID
- **Location**: `./routes/users.js`
- **Endpoint**: `GET /api/users/find/:id`
- **Functionality**: Retrieves details of a specific user.
- **Access Level**: Public
- **Input**: `req.params.id` (User ID)
- **Output**:
  - **200**: User details
  - **500**: Server error if retrieval fails

### 6. Update User by ID
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
- **Functionality**: Creates a new product.
- **Access Level**: Admin
- **Input**: `req.body` with product details
- **Output**:
  - **200**: Created product object
  - **500**: Server error if creation fails

### 9. Update Token Price
- **Location**: `./routes/products.js`
- **Endpoint**: `GET /api/products/update/:id`
- **Functionality**: Updates the token price.
- **Access Level**: Admin
- **Input**: `req.params.id` (Product ID)
- **Output**:
  - **200**: Transaction receipt
  - **500**: Server error if update fails

### 10. Delete Product
- **Location**: `./routes/products.js`
- **Endpoint**: `DELETE /api/products/:id`
- **Functionality**: Deletes a product by ID.
- **Access Level**: Admin
- **Input**: `req.params.id` (Product ID)
- **Output**:
  - **200**: Confirmation of deletion
  - **500**: Server error if deletion fails


## Order Management
### 11. Create Order Match
- **Location**: `./routes/orderMatching.js`
- **Endpoint**: `POST /api/orderMatching`
- **Functionality**: Creates an order match between buyer and seller.
- **Access Level**: Public
- **Input**: `req.body` with details like `orderId`, `BuyersAddress`, `SellersAddress`
- **Output**:
  - **200**: Order match object
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
