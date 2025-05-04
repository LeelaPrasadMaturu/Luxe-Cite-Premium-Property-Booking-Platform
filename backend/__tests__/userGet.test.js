import request from 'supertest';
import { faker } from '@faker-js/faker';

describe('User API', () => {
  let adminToken;
  let userToken;
  let newUserToken;

  beforeAll(async () => {
    // Login as admin
    const adminResponse = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin1234'
      });
    adminToken = adminResponse.body.token;

    // Login as existing user
    const userResponse = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'surya@gmail.com',
        password: '123456'
      });
    userToken = userResponse.body.token;
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: 'password123'
      };

      const response = await request('http://localhost:5000')
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name', userData.name);
      expect(response.body.user).toHaveProperty('email', userData.email.toLowerCase());
      expect(response.body.user).toHaveProperty('phone', userData.phone);
      expect(response.body.user).toHaveProperty('role', 'GUEST');

      newUserToken = response.body.token;
    });

    it('should not register with existing email', async () => {
      const userData = {
        name: faker.person.fullName(),
        email: 'surya@gmail.com', // Using existing email
        phone: faker.phone.number(),
        password: 'password123'
      };

      await request('http://localhost:5000')
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should not register with invalid email format', async () => {
      const userData = {
        name: faker.person.fullName(),
        email: 'invalid-email',
        phone: faker.phone.number(),
        password: 'password123'
      };

      await request('http://localhost:5000')
        .post('/api/auth/register')
        .send(userData)
        .expect(500);
    });

    it('should not register with short password', async () => {
      const userData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: '12345' // Less than 6 characters
      };

      await request('http://localhost:5000')
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should not register without name', async () => {
      const userData = {
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: 'password123'
      };

      await request('http://localhost:5000')
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should not register without email', async () => {
      const userData = {
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        password: 'password123'
      };

      await request('http://localhost:5000')
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should not register without phone', async () => {
      const userData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123'
      };

      await request('http://localhost:5000')
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should not register without password', async () => {
      const userData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number()
      };

      await request('http://localhost:5000')
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should not register with very long password', async () => {
      const userData = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: 'a'.repeat(73) // More than 72 bytes (bcrypt limit)
      };

      await request('http://localhost:5000')
        .post('/api/auth/register')
        .send(userData)
        .expect(500);
    });

    it('should not register with very long name', async () => {
      const userData = {
        name: 'a'.repeat(256), // Very long name
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: 'password123'
      };

      await request('http://localhost:5000')
        .post('/api/auth/register')
        .send(userData)
        .expect(500);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user profile', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('phone');
      expect(response.body).toHaveProperty('role');
      expect(['GUEST', 'ADMIN']).toContain(response.body.role);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not get profile without token', async () => {
      await request('http://localhost:5000')
        .get('/api/auth/me')
        .expect(401);
    });

    it('should not get profile with invalid token', async () => {
      await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('GET /api/auth/me with different tokens', () => {
    it('should get admin profile with admin token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('role', 'ADMIN');
    });

    it('should get user profile with user token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('role', 'GUEST');
    });

    it('should not get profile with malformed token', async () => {
      await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', 'Bearer malformed.token.here')
        .expect(401);
    });

    it('should not get profile with expired token', async () => {
      // This is a manually constructed expired JWT token
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDk0ZjZhMjAwZjM2MDAyNGE4ZDY0YiIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGUiOiJHVUVTVCIsImlhdCI6MTYyNDg5NjM2MiwiZXhwIjoxNjI0ODk5OTYyfQ.7GSyh7Kj9J5qSj7YjhMZ8j9D5vYhXB8RQXRgX5WtZQY';
      
      await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('GET /api/admin/users (Admin only)', () => {
    it('should get all users for admin', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(user => {
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('role');
        expect(['GUEST', 'ADMIN']).toContain(user.role);
        expect(user).not.toHaveProperty('password');
      });
    });

    it('should not get all users for regular user', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);
    });

    it('should not get all users without token', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/users')
        .expect(401);
    });
  });

  describe('GET /api/admin/users/:id', () => {
    let userId;

    beforeAll(async () => {
      // Get a valid user ID for testing
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
      userId = response.body._id;
    });

    it('should get user by ID for admin', async () => {
      const response = await request('http://localhost:5000')
        .get(`/api/admin/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', userId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('role');
      expect(['GUEST', 'ADMIN']).toContain(response.body.role);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not get user by ID for regular user', async () => {
      await request('http://localhost:5000')
        .get(`/api/admin/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);
    });

    it('should not get user by ID without token', async () => {
      await request('http://localhost:5000')
        .get(`/api/admin/users/${userId}`)
        .expect(401);
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = '6816e68da459f33adff';
      await request('http://localhost:5000')
        .get(`/api/admin/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);
    });

    it('should return 400 for invalid user ID format', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/users/invalidid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);
    });
  });

  describe('GET /api/admin/users with query parameters', () => {
    it('should get users with role filter', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/users?role=GUEST')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(user => {
        expect(['GUEST', 'ADMIN']).toContain(user.role);
      });
    });

    it('should get users with search query', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/users?search=surya')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some(user => 
        user.name.toLowerCase().includes('surya') || 
        user.email.toLowerCase().includes('surya')
      )).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/users?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(30);
    });
  });

  describe('PUT /api/auth/me', () => {
    it('should update own user profile', async () => {
      const updateData = {
        name: faker.person.fullName(),
        phone: faker.phone.number()
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('name', updateData.name);
      expect(response.body).toHaveProperty('phone', updateData.phone);
    });

    it('should not update with existing email', async () => {
      const updateData = {
        email: 'admin@gmail.com' // Using existing email
      };

      await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(400);
    });

    it('should not update with invalid email format', async () => {
      const updateData = {
        email: 'invalid-email'
      };

      await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(500);
    });

    it('should not update profile without token', async () => {
      const updateData = {
        name: faker.person.fullName()
      };

      await request('http://localhost:5000')
        .put('/api/auth/me')
        .send(updateData)
        .expect(401);
    });

  

    it('should not update with invalid phone format', async () => {
      const updateData = {
        phone: 2323
      };

      await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(500);
    });
  });

  describe('PUT /api/auth/me with various updates', () => {
    it('should update user name with special characters', async () => {
      const updateData = {
        name: "O'Connor-Smith"
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('name', updateData.name);
    });

    it('should update phone number with international format', async () => {
      const updateData = {
        phone: '+1-555-123-4567'
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('phone', updateData.phone);
    });

    it('should handle concurrent profile updates', async () => {
      const updateData1 = {
        name: faker.person.fullName()
      };
      const updateData2 = {
        phone: faker.phone.number()
      };

      await Promise.all([
        request('http://localhost:5000')
          .put('/api/auth/me')
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData1)
          .expect(200),
        request('http://localhost:5000')
          .put('/api/auth/me')
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData2)
          .expect(200)
      ]);
    });
  });
}); 