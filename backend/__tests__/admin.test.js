import request from 'supertest';

describe('Admin API', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Login as admin
    const adminResponse = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin1234'
      });
    adminToken = adminResponse.body.token;

    // Login as regular user
    const userResponse = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'Srinu@gmail.com',
        password: '123456'
      });
    userToken = userResponse.body.token;
  });

  describe('GET /api/admin/dashboard', () => {
    it('should get dashboard stats with admin token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('totalProperties');
      expect(response.body).toHaveProperty('totalBookings');
    });

    it('should not get dashboard stats without token', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/dashboard')
        .expect(401);
    });

    it('should not get dashboard stats with user token', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should get all users with admin token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).toHaveProperty('role');
    });

    it('should not get users without token', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/users')
        .expect(401);
    });

    it('should not get users with user token', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);
    });
  });

  describe('GET /api/admin/users/:id', () => {
    it('should get user by id with admin token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const userId = response.body[0]._id;
      const userResponse = await request('http://localhost:5000')
        .get(`/api/admin/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(userResponse.body).toHaveProperty('_id', userId);
      expect(userResponse.body).toHaveProperty('email');
      expect(userResponse.body).toHaveProperty('role');
    });

    it('should not get user with invalid id', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/users/invalidid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);
    });
  });

  describe('GET /api/admin/properties', () => {
    it('should get all properties with admin token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/properties')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('price');
    });

    it('should not get properties without token', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/properties')
        .expect(401);
    });

    it('should not get properties with user token', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/properties')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);
    });
  });

  describe('GET /api/admin/properties/:id', () => {
    it('should get property by id with admin token', async () => {
      const propertyId = '68167fd7fc8866b35241f1ce';
      const response = await request('http://localhost:5000')
        .get(`/api/admin/properties/${propertyId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', propertyId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('price');
    });

    it('should not get property with invalid id', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/properties/invalidid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);
    });
  });

  describe('GET /api/admin/bookings', () => {
    it('should get all bookings with admin token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('property');
      expect(response.body[0]).toHaveProperty('user');
    });

    it('should not get bookings without token', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/bookings')
        .expect(401);
    });

    it('should not get bookings with user token', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);
    });
  });

  describe('GET /api/admin/bookings/:id', () => {
    it('should get booking by id with admin token', async () => {
      const bookingId = '6816e68d98125a459f33ad5d';
      const response = await request('http://localhost:5000')
        .get(`/api/admin/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', bookingId);
      expect(response.body).toHaveProperty('property');
      expect(response.body).toHaveProperty('user');
    });

    it('should not get booking with invalid id', async () => {
      await request('http://localhost:5000')
        .get('/api/admin/bookings/invalidid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);
    });
  });

  // Second admin tests at the end
  describe('Second Admin Tests', () => {
    let secondAdminToken;

    beforeAll(async () => {
      // Login as second admin
      const secondAdminResponse = await request('http://localhost:5000')
        .post('/api/auth/login')
        .send({
          email: 'Balija@gmail.com',
          password: 'admin1234'
        });
      secondAdminToken = secondAdminResponse.body.token;
    });

    it('should get dashboard stats with second admin token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${secondAdminToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('totalProperties');
      expect(response.body).toHaveProperty('totalBookings');
    });

    it('should get all users with second admin token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${secondAdminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get all properties with second admin token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/admin/properties')
        .set('Authorization', `Bearer ${secondAdminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get property by id with second admin token', async () => {
      const propertyId = '68167fd7fc8866b35241f1cf';
      const response = await request('http://localhost:5000')
        .get(`/api/admin/properties/${propertyId}`)
        .set('Authorization', `Bearer ${secondAdminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', propertyId);
    });
  });
}); 