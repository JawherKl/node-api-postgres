# Node.js API with PostgreSQL
![nodepost](https://github.com/user-attachments/assets/6f206c6e-dea0-4045-8baa-a04e74a5fbf8)

This is a simple RESTful API built with Node.js and Express, designed to interact with a PostgreSQL database. The API provides endpoints for managing user data and includes authentication features.

## Features
- **Get All Users**: Retrieve a list of all users.
- **Get User by ID**: Retrieve a specific user by their ID.
- **Create User**: Add a new user to the database.
- **Update User**: Update details of an existing user.
- **Delete User**: Remove a user from the database.
- **User Authentication**: Secure API access using JSON Web Tokens (JWT).

## Technologies Used
- Node.js
- Express
- PostgreSQL
- Body-parser
- JSON Web Token (JWT)

## Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/JawherKl/node-api-postgres.git
   cd node-api-postgres
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up PostgreSQL**:
   Ensure you have PostgreSQL installed and running. Create a database and a `users` table as per your requirements.
   
4. **Configure Database Connection**:
   Update the `db.js` file to set up your PostgreSQL connection details.

5. **Generate a Random JWT Secret Key** (Optional):
   If you want to generate a random JWT secret key, you can use:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
## Inject Table
   ``` sql
   CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- Role-based access control
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL -- For soft delete functionality
   );
   ```
### Explanation of Columns:
1.`id`: A unique identifier for each user (auto-incrementing).
2.`name`: The user's name, with a maximum length of 100 characters.
3.`email`: A unique email address for each user, with a maximum length of 255 characters.
4.`password`: A hashed password stored securely.
5.`role`: The role of the user, e.g., user, admin. Default is user.
6.`created_at`: A timestamp of when the record was created.
7.`updated_at`: A timestamp of the last update (auto-updates on record modification).
8.`deleted_at`: A nullable field to mark the user as deleted without removing the record.
## Usage
Start the server:
  ```bash
  node index.js
  ```
The server will run on [http://localhost:3000].

## API Endpoints:
- **GET /** - Returns a simple welcome message.
- **GET /users** - Returns all users.
- **GET /users/:id** - Returns a user by ID.
- **POST /users** - Creates a new user (requires JSON body).
- **PUT /users/:id** - Updates an existing user by ID (requires JSON body).
- **DELETE /users/:id** - Deletes a user by ID.
- **POST /login** - Authenticates a user and returns a JWT (requires JSON body with email and password).

## Example Requests

### Get All Users
   ```bash
   curl -X GET http://localhost:3000/users
   ```

### Create User
   ```bash
   curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com"}'
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
   curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email": "john@example.com", "password": "your_password"}'
   ```

### Access Protected Route
   ```bash
   curl -X GET http://localhost:3000/users -H "Authorization: Bearer your_jwt_token"
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Thanks to the contributors and the open-source community for their support.
- Special thanks to the maintainers of the libraries used in this project.
