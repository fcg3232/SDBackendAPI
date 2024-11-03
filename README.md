# SecondaryDAO APIs as of 2/6/24 for website, non-frontend

Lightsail
Secondary-dao-api
2 GB RAM, 2 vCPUs, 60 GB SSD

34.238.228.191 
2600:1f18:1b91:7900:c728:4ad8:4081:4c68

https://lightsail.aws.amazon.com/ls/webapp/home/instances




# SecondaryDAO API Documentation

## 1. Getting Started

### 1.1 Main Information
- **Base URL (Development)**: `http://localhost:5000/api`
- **Base URL (Production)**: `https://api.secondarydao.com/api`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: <Token>`

---

## 2. API Endpoints

### 2.1 User Registration and Authentication

#### Register User
- **Location**: `./routes/register.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/register`
- **HTTP Method**: POST
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "First_name": "User's first name",
    "Last_name": "User's last name",
    "phone": "Mobile number",
    "email": "Email Address",
    "dateofBirth": "Date of Birth",
    "Residence_country": "Country of residence",
    "Nationality": "Nationality",
    "Password": "At least 8 characters"
  }
  ```

#### User Login
- **Location**: `./routes/login.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/login`
- **HTTP Method**: POST
- **Description**: User login
- **Request Body**:
  ```json
  {
    "email": "User's email address",
    "password": "User's password"
  }
  ```

---

### 2.2 User Management Endpoints

#### Fetch All Users (Admin Only)
- **Location**: `./routes/users.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/users`
- **HTTP Method**: GET
- **Description**: Fetch a list of all users (Admin only)

#### Delete User by ID
- **Location**: `./routes/users.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/:id`
- **HTTP Method**: DELETE
- **Description**: Delete a specific user

#### Get User by ID
- **Location**: `./routes/users.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/find/:id`
- **HTTP Method**: GET
- **Description**: Retrieve a specific user by ID

#### Update User During KYC
- **Location**: `./routes/users.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/:id`
- **HTTP Method**: PATCH
- **Description**: Update user details during KYC process

#### Accept Terms and Conditions
- **Location**: `./routes/users.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/isaccept/:id`
- **HTTP Method**: PUT
- **Description**: Update user status upon accepting the Terms and Conditions

#### Update User
- **Location**: `./routes/users.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/:id`
- **HTTP Method**: PUT
- **Description**: General user update

#### Update User Wallet Public Key
- **Location**: `./routes/users.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/wallet/update/:id`
- **HTTP Method**: PATCH
- **Description**: Update user's wallet public key

---

### 2.3 Product Management

#### Create Property
- **Location**: `./routes/products.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/products`
- **HTTP Method**: POST
- **Description**: Create a new property listing
- **Request Body**:
  ```json
  {
    "uid": "Property unique ID",
    "name": "Property Name",
    "AdminWallet": "Admin's wallet address",
    "location": "Property Location",
    "propertyType": "Type of Property",
    "bedroom": "Number of bedrooms",
    "bathroom": "Number of bathrooms",
    "propertyaddress": "Physical address",
    "date": "Listed date",
    "desc": "Property description",
    "image": "Property image URL"
  }
  ```

#### Update Property Token Price
- **Location**: `./routes/products.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/products/update/:id`
- **HTTP Method**: GET
- **Description**: Updates the token price by calling a smart contract

#### Delete Property
- **Location**: `./routes/products.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/products/:id`
- **HTTP Method**: DELETE
- **Description**: Delete a listed property

#### Get All Properties
- **Location**: `./routes/products.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/products`
- **HTTP Method**: GET
- **Description**: Retrieve all properties listed on the marketplace

---

### 2.4 Order Management

#### Place Buy Order
- **Location**: `./routes/buyerOrder.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/buyerOrder`
- **HTTP Method**: POST
- **Description**: Place a buy order for property tokens

#### Approve Buy Order
- **Location**: `./routes/buyerOrder.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/buyerOrder/:id`
- **HTTP Method**: PATCH
- **Description**: Approve tokens on behalf of buyers using permit functionality

#### Fetch Buy Orders by Property Address
- **Location**: `./routes/buyerOrder.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/buyerOrder/find/:PropertyAddress`
- **HTTP Method**: GET
- **Description**: Get all buyer orders for a specific property address

---

### 2.5 Additional Endpoints

#### Change Password
- **Location**: `./routes/changePassword.js`
- **Endpoint URL**: `https://api.secondarydao.com/api/changePassword`
- **HTTP Method**: POST
- **Description**: API for changing password
- **Request Body**:
  ```json
  {
    "email": "User email",
    "password": "New password"
  }
  ```

#### Blog Management
- **Location**: `./routes/blogdb.js`
- **Create Blog Post**
  - **Endpoint URL**: `https://api.secondarydao.com/api/blogdb`
  - **HTTP Method**: POST
  - **Description**: Create a new blog post
- **Retrieve All Blogs**
  - **Endpoint URL**: `https://api.secondarydao.com/api/blogdb`
  - **HTTP Method**: GET
  - **Description**: Get all blogs
- **Update Blog**
  - **Endpoint URL**: `https://api.secondarydao.com/api/blogdb/:id`
  - **HTTP Method**: PUT
  - **Description**: Update an existing blog post

---

## 3. Common Response Codes

- **200**: OK - Request was successful
- **400**: Bad Request - Invalid details or missing data
- **401**: Authentication Error - Invalid or missing token
- **404**: Not Found - Resource not found
- **429**: Too Many Requests - Rate limit exceeded
- **503**: Service Unavailable - Server currently unavailable

- **Input**: `req.params.id` (Order match ID)
- **Output**:
  - **200**: Confirmation of deletion
  - **500**: Server error if deletion fails
