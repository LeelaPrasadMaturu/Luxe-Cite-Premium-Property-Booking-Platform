const request = require('supertest');
const app = require('../src/app');

describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials for Surya', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'surya@gmail.com',
          password: '123456'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('surya@gmail.com');
    });

    it('should login with valid credentials for Srinu', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'srinu@gmail.com',
          password: '123456'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('srinu@gmail.com');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'surya@gmail.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.token).toBeUndefined();
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@gmail.com',
          password: '123456'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.token).toBeUndefined();
    });
  });
}); 