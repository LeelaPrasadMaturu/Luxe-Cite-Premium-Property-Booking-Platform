const request = require('supertest');
const app = require('../src/app');

describe('Bookings API', () => {
  let suryaToken, srinuToken;

  beforeEach(async () => {
    // Get tokens for both users
    const suryaLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'surya@gmail.com',
        password: '123456'
      });
    suryaToken = suryaLogin.body.token;

    const srinuLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'srinu@gmail.com',
        password: '123456'
      });
    srinuToken = srinuLogin.body.token;
  });

  describe('GET /api/bookings', () => {
    it('should get Surya\'s bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${suryaToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.bookings)).toBe(true);
      expect(response.body.bookings[0].user.email).toBe('surya@gmail.com');
    });

    it('should get Srinu\'s bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${srinuToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.bookings)).toBe(true);
      expect(response.body.bookings[0].user.email).toBe('srinu@gmail.com');
    });

    it('should not get bookings without authentication', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
}); 