# Express - Node.js API with PostgreSQL

![nodepost](https://github.com/user-attachments/assets/6f206c6e-dea0-4045-8baa-a04e74a5fbf8)

This is a modern RESTful API built with **Node.js** and **Express**, designed to interact with a **PostgreSQL** database. The API provides various endpoints for managing user data, with additional features like authentication, JWT protection, soft deletion, and automated testing. We've also integrated **Swagger** for auto-generated API documentation.

## Features 🚀
- **User Management**:
  - **Get All Users**: Retrieve a list of all users.
  - **Get User by ID**: Retrieve a specific user by their ID.
  - **Create User**: Add a new user to the database.
  - **Update User**: Update details of an existing user.
  - **Delete User**: Remove a user from the database (soft delete functionality).
  
- **Authentication & Authorization**:
  - **User Authentication**: Secure API access using **JSON Web Tokens (JWT)**.
  - **Role-based Access Control (RBAC)**: Control access to resources based on user roles (e.g., admin, user).

- **Swagger API Documentation**:
  - **Swagger** integrated for real-time API documentation and testing directly in the browser. Access the documentation at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

- **Database**:
  - Integration with **PostgreSQL** for storing user data securely.
  - **Soft delete functionality**: Mark users as deleted without removing their data.

- **Unit Testing**:
  - Comprehensive unit tests using **Mocha** and **Chai** to ensure the reliability of the application.
  - **Test Cases**: Includes tests for user creation, update, deletion, and authentication.

## Technologies Used ⚙️
- **Node.js** (JavaScript runtime)
- **Express** (Web framework)
- **PostgreSQL** (Database)
- **JSON Web Token (JWT)** (Authentication)
- **Body-Parser** (Parsing JSON request bodies)
- **Swagger** (API documentation)
- **Mocha** (Testing framework)
- **Chai** (Assertion library)

## Installation 🛠️
### Step 1: Clone the Repository
```bash
git clone https://github.com/JawherKl/node-api-postgres.git
cd node-api-postgres
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set up PostgreSQL
Ensure you have **PostgreSQL** installed and running. Create a new database and configure the connection.

### Step 4: Configure Database Connection
Update the `db.js` file to set up your PostgreSQL connection credentials.

### Step 5: Generate JWT Secret (Optional)
Generate a random JWT secret key (recommended for production environments):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Inject Table into PostgreSQL
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  picture VARCHAR(255) NULL,
  role VARCHAR(20) DEFAULT 'user',  -- Role-based access control
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL  -- For soft delete functionality
);
```

### Column Explanation
- `id`: Unique identifier for each user (auto-increment).
- `name`: User's name (max 100 characters).
- `email`: Unique email address (max 255 characters).
- `password`: Hashed password for security.
- `role`: User's role (e.g., admin, user).
- `created_at`: Timestamp for record creation.
- `updated_at`: Timestamp for last update (auto-updates on modification).
- `deleted_at`: Nullable timestamp for soft deletion.

## Usage 🏃‍♂️

### Start the Server
```bash
node index.js
```
The server will run on [http://localhost:3000].

### Access Swagger API Docs
Once the server is running, you can access the auto-generated API documentation powered by Swagger at:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs).

## API Endpoints 📡
- **GET /** - Returns a simple welcome message.
- **GET /users** - Get all users.
- **GET /users/:id** - Get a user by ID.
- **POST /users** - Create a new user (requires JSON body).
- **PUT /users/:id** - Update an existing user by ID (requires JSON body).
- **DELETE /users/:id** - Delete a user by ID.
- **POST /login** - Authenticate a user and return a JWT (requires JSON body with email and password).

## Example Requests 📝

### Get All Users
```bash
curl -X GET http://localhost:3000/users
```

### Create User
```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com", "password": "password"}'
```

### Update User
```bash
curl -X PUT http://localhost:3000/users/1 -H "Content-Type: application/json" -d '{"name": "Jane Doe"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/users/1
```

### Authenticate User
```bash
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email": "john@example.com", "password": "password"}'
```

### Access Protected Route
```bash
curl -X GET http://localhost:3000/users -H "Authorization: Bearer your_jwt_token"
```

## Unit Testing 🧪
Unit tests are implemented using **Mocha** and **Chai**. To run tests:

1. Install **test dependencies** (if not installed):
   ```bash
   npm install --save-dev mocha chai
   ```

2. Run the tests:
   ```bash
   npm test
   ```

This will run all tests and output the results to the console. You can find the test cases for different routes and operations in the `test` folder.

## Contributing 🤝
Contributions are welcome! If you have suggestions, improvements, or bug fixes, please open an issue or submit a pull request.

## License 📝
This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments 🙏
- Special thanks to all contributors and the open-source community.
- Gratitude to the maintainers of the libraries used in this project.
