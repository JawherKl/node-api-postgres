import chai from 'chai';
import chaiHttp from 'chai-http';
import request from 'supertest';
import app from '../index.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

chai.use(chaiHttp);
const { expect } = chai;

describe('User API', () => {
  let token; // Store the authentication token
  let server;

  // Start server before tests and login to get token
  before(async () => {
    // Start the app server
    server = app.listen(3000, () => {
      console.log('Test server started');
    });

    const res = await request(app)
      .post('/login')
      .send({ email: 'alaa@gmail.com', password: 'alaapass' });
      
    token = res.body.token; // Adjust depending on your login response
  });

  describe('GET /users', () => {
    it('should return a list of users with a valid token', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return 401 without a token', async () => {
      const res = await request(app).get('/users');
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('error', 'Unauthorized');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by ID with a valid token', async () => {
      const userId = 9; // Replace with an actual valid numeric user ID in your database
      const res = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', userId);
      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('email');
    });
  
    it('should return 404 if user not found', async () => {
      const invalidUserId = 999999; // Replace with a numeric ID that doesn't exist in your database
      const res = await request(app)
        .get(`/users/${invalidUserId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'User not found');
    });
  
    it('should return 401 without a token', async () => {
      const userId = 1; // Replace with an actual valid numeric user ID in your database
      const res = await request(app)
        .get(`/users/${userId}`);
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('error', 'Unauthorized');
    });
  });  

  /*describe('POST /users', () => {
    it('should create a new user with valid data and token', async () => {
      const filePath = path.join(__dirname, 'fixtures/sample-profile-pic.jpg');

      const res = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .field('name', 'John Doe')
        .field('email', 'john.doe@example.com')
        .field('password', 'password123')
        .attach('picture', filePath); // Attach a file
  
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User added');
    });
  
    it('should return 400 for invalid user data', async () => {
      const res = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'JD', email: 'not-an-email', password: '123' });
    
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error').that.includes('"name" length must be at least 3 characters long');
    });
  
    it('should return 401 without a token', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Jane Doe', email: 'jane.doe@example.com', password: 'password123' });
    
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('error', 'Unauthorized');
    });
  });  */

  describe('PUT /users/:id', () => {
    it('should update a user with valid data', async () => {
      const userId = 44; // Use a valid integer ID
      const updatedData = { name: 'John Updated', email: 'john.updated@example.com', password: 'password123' };

      const res = await request(app)
          .put(`/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updatedData);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', `User modified with ID: ${userId}`);
      expect(res.body).to.have.property('user');
      expect(res.body.user).to.have.property('name', 'John Updated');
      expect(res.body.user).to.have.property('email', 'john.updated@example.com');
      
      const isPasswordCorrect = await bcrypt.compare(updatedData.password, res.body.user.password);
      expect(isPasswordCorrect).to.be.true;
    });

    it('should return 400 for invalid user data', async () => {
        const userId = 44;  // Use a valid user ID
        const updatedData = { name: 'JD', email: 'not-an-email', password: '123' };

        const res = await request(app)
            .put(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error').that.includes('Invalid email format');
    });

    it('should return 404 if user not found', async () => {
        const invalidUserId = 9999;  // Use a non-existing user ID
        const updatedData = { name: 'Nonexistent User', email: 'nonexistent@example.com', password: 'password123' };

        const res = await request(app)
            .put(`/users/${invalidUserId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error', 'User not found');
    });

    it('should return 401 without a token', async () => {
        const userId = 44;  // Use a valid user ID
        const updatedData = { name: 'John Doe', email: 'john.doe@example.com', password: 'password123' };

        const res = await request(app)
            .put(`/users/${userId}`)
            .send(updatedData);

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('error', 'Unauthorized');
    });
  });


  describe('DELETE /users/:id', () => {
    it('should delete a user with valid ID', async () => {
      const userId = 45; // Replace with an actual user ID (integer)
  
      const res = await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'User soft deleted with ID: ' + userId);
    });
  
    it('should return 404 if user not found', async () => {
      const invalidUserId = 999999; // Use a non-existent integer ID
  
      const res = await request(app)
        .delete(`/users/${invalidUserId}`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'User not found');
    });
  
    it('should return 401 without a token', async () => {
      const userId = 45; // Replace with a valid integer ID
  
      const res = await request(app)
        .delete(`/users/${userId}`);
  
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('error', 'Unauthorized');
    });
  });
  
  // Close the server after tests
  after(async () => {
    if (server) {
      server.close();
    }
  });
});
