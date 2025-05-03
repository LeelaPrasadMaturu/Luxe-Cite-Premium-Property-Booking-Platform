import request from 'supertest';

describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials for Surya', async () => {
      const response = await request('http://localhost:5000')
        .post('/api/auth/login')
        .send({
          email: 'surya@gmail.com',
          password: '123456'
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('surya@gmail.com');
    });

    it('should login with valid credentials for Srinu', async () => {
      const response = await request('http://localhost:5000')
        .post('/api/auth/login')
        .send({
          email: 'srinu@gmail.com',
          password: '123456'
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('srinu@gmail.com');
    });

    it('should not login with invalid password', async () => {
      const response = await request('http://localhost:5000')
        .post('/api/auth/login')
        .send({
          email: 'surya@gmail.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should not login with non-existent email', async () => {
      const response = await request('http://localhost:5000')
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@gmail.com',
          password: '123456'
        })
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });
}); 