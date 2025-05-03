import request from 'supertest';

describe('Bookings API', () => {
  let suryaToken, srinuToken;

  beforeEach(async () => {
    // Get tokens for both users
    const suryaLogin = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'surya@gmail.com',
        password: '123456'
      });
    suryaToken = suryaLogin.body.token;

    const srinuLogin = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'srinu@gmail.com',
        password: '123456'
      });
    srinuToken = srinuLogin.body.token;
  });

  describe('GET /api/bookings/my-bookings', () => {
    it('should get Surya\'s bookings', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${suryaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.bookings)).toBe(true);
    });

    it('should get Srinu\'s bookings', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${srinuToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.bookings)).toBe(true);
    });

    it('should not get bookings without authentication', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });
}); 