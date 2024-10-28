const request = require('supertest');
const app = require('../index'); // Assuming index.js exports `app`

describe('User API', () => {
  it('should retrieve all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  // Additional test cases here...
});
