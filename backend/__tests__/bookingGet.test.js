import request from 'supertest';

describe('Booking GET API', () => {
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

    // Login as first user (Surya who has bookings)
    const userResponse = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'surya@gmail.com',
        password: '123456'
      });
    userToken = userResponse.body.token;
  });

  describe('GET /api/bookings/my-bookings', () => {
    it('should return success flag as true', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should return bookings array', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('bookings');
      expect(Array.isArray(response.body.bookings)).toBe(true);
    });

    it('should return booking with correct _id', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (response.body.bookings.length > 0) {
        expect(response.body.bookings[0]).toHaveProperty('_id');
      }
    });

    it('should return booking with correct property details', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (response.body.bookings.length > 0) {
        const booking = response.body.bookings[0];
        expect(booking).toHaveProperty('property');
        expect(booking.property).toHaveProperty('_id');
        expect(booking.property).toHaveProperty('title');
        expect(booking.property).toHaveProperty('location');
        expect(booking.property).toHaveProperty('price');
        expect(booking.property).toHaveProperty('images');
        expect(booking.property).toHaveProperty('maxGuests');
        expect(booking.property).toHaveProperty('amenities');
        expect(booking.property).toHaveProperty('rating');
      }
    });

    it('should return booking with correct booking details', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (response.body.bookings.length > 0) {
        const booking = response.body.bookings[0];
        expect(booking).toHaveProperty('checkIn');
        expect(booking).toHaveProperty('checkOut');
        expect(booking).toHaveProperty('guests');
        expect(booking).toHaveProperty('totalPrice');
        expect(booking).toHaveProperty('status');
        expect(booking).toHaveProperty('bookingNumber');
      }
    });

    it('should not get bookings without token', async () => {
      await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .expect(401);
    });
  });

  describe('GET /api/bookings/:id', () => {
    let validBookingId;

    beforeAll(async () => {
      // Get a valid booking ID for testing
      const bookingsResponse = await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (bookingsResponse.body.bookings.length > 0) {
        validBookingId = bookingsResponse.body.bookings[0]._id;
      }
    });

    it('should return success flag as true for valid booking', async () => {
      if (!validBookingId) return;

      const response = await request('http://localhost:5000')
        .get(`/api/bookings/${validBookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should return booking object for valid booking', async () => {
      if (!validBookingId) return;

      const response = await request('http://localhost:5000')
        .get(`/api/bookings/${validBookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('booking');
    });

    it('should return correct booking ID', async () => {
      if (!validBookingId) return;

      const response = await request('http://localhost:5000')
        .get(`/api/bookings/${validBookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.booking).toHaveProperty('_id', validBookingId);
    });

    it('should return booking with property details', async () => {
      if (!validBookingId) return;

      const response = await request('http://localhost:5000')
        .get(`/api/bookings/${validBookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.booking).toHaveProperty('property');
      expect(response.body.booking.property).toHaveProperty('_id');
      expect(response.body.booking.property).toHaveProperty('title');
      expect(response.body.booking.property).toHaveProperty('location');
    });

    it('should return booking with user details', async () => {
      if (!validBookingId) return;

      const response = await request('http://localhost:5000')
        .get(`/api/bookings/${validBookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.booking).toHaveProperty('user');
      expect(response.body.booking.user).toHaveProperty('name');
      expect(response.body.booking.user).toHaveProperty('email');
      expect(response.body.booking.user).toHaveProperty('phone');
    });

    it('should return booking with correct dates and status', async () => {
      if (!validBookingId) return;

      const response = await request('http://localhost:5000')
        .get(`/api/bookings/${validBookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.booking).toHaveProperty('checkIn');
      expect(response.body.booking).toHaveProperty('checkOut');
      expect(response.body.booking).toHaveProperty('status');
    });

    it('should not get another user\'s booking', async () => {
      if (!validBookingId) return;

      // Login as second user just before using their token
      const secondUserResponse = await request('http://localhost:5000')
        .post('/api/auth/login')
        .send({
          email: 'Srinu@gmail.com',
          password: '123456'
        });
      const secondUserToken = secondUserResponse.body.token;

      await request('http://localhost:5000')
        .get(`/api/bookings/${validBookingId}`)
        .set('Authorization', `Bearer ${secondUserToken}`)
        .expect(403);
    });

    it('should return 400 for non-existent booking', async () => {
      const nonExistentId = '6816e68da459f33adff';
      await request('http://localhost:5000')
        .get(`/api/bookings/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);
    });

    it('should return 401 for invalid booking ID format without token', async () => {
      await request('http://localhost:5000')
        .get('/api/bookings/invalidid')
        .expect(401);
    });

    it('should return 400 for invalid booking ID format with token', async () => {
      await request('http://localhost:5000')
        .get('/api/bookings/invalidid')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);
    });
  });

  describe('GET /api/bookings/user/:userId', () => {
    let validUserId;

    beforeAll(async () => {
      // Get a valid user ID for testing
      const bookingsResponse = await request('http://localhost:5000')
        .get('/api/bookings/my-bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (bookingsResponse.body.bookings.length > 0) {
        validUserId = bookingsResponse.body.bookings[0].user;
      }
    });

    it('should return success flag as true for own bookings', async () => {
      if (!validUserId) return;

      const response = await request('http://localhost:5000')
        .get(`/api/bookings/my-bookings`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should return bookings array for own bookings', async () => {
      if (!validUserId) return;

      const response = await request('http://localhost:5000')
        .get(`/api/bookings/my-bookings`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('bookings');
      expect(Array.isArray(response.body.bookings)).toBe(true);
    });

    it('should return bookings with correct structure', async () => {
      if (!validUserId) return;

      const response = await request('http://localhost:5000')
        .get(`/api/bookings/my-bookings`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      response.body.bookings.forEach(booking => {
        expect(booking).toHaveProperty('_id');
        expect(booking).toHaveProperty('property');
        expect(booking).toHaveProperty('checkIn');
        expect(booking).toHaveProperty('checkOut');
        expect(booking).toHaveProperty('status');
      });
    });

    it('should not get bookings for another user ID', async () => {
      if (!validUserId) return;

      // Login as second user just before using their token
      const secondUserResponse = await request('http://localhost:5000')
        .post('/api/auth/login')
        .send({
          email: 'Srinu@gmail.com',
          password: '123456'
        });
      const secondUserToken = secondUserResponse.body.token;

      await request('http://localhost:5000')
        .get(`/api/bookings/user/${validUserId}`)
        .set('Authorization', `Bearer ${secondUserToken}`)
        .expect(401);
    });

    it('should return 401 for invalid user ID format without token', async () => {
      await request('http://localhost:5000')
        .get('/api/bookings/user/invalidid')
        .expect(401);
    });

    it('should return 403 for invalid user ID format with token', async () => {
      await request('http://localhost:5000')
        .get('/api/bookings/user/invalidid')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
}); 