import request from 'supertest';

describe('Booking Lock API Endpoints', () => {
  let userToken, adminToken;
  let propertyId;

  beforeEach(async () => {
    // Get user token
    const userLogin = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'surya@gmail.com',
        password: '123456'
      });
    userToken = userLogin.body.token;

    // Get admin token
    const adminLogin = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: '123456'
      });
    adminToken = adminLogin.body.token;

    // Get a property ID for testing
    const propertiesResponse = await request('http://localhost:5000')
      .get('/api/properties')
      .set('Authorization', `Bearer ${userToken}`);
    
    if (propertiesResponse.body.properties && propertiesResponse.body.properties.length > 0) {
      propertyId = propertiesResponse.body.properties[0]._id;
    }
  });

  describe('POST /api/bookings/lock', () => {
    it('should create a booking lock successfully', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-02-15',
        checkOut: '2024-02-17'
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.lockKey).toContain('booking_lock:');
      expect(response.body.expiresIn).toBe(600);
      expect(response.body.lockData).toBeDefined();
    });

    it('should fail when property is already locked by another user', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-02-15',
        checkOut: '2024-02-17'
      };

      // Create first lock
      await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData);

      // Try to create second lock with different user
      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(lockData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('currently being booked');
    });

    it('should fail with invalid property ID', async () => {
      const lockData = {
        propertyId: 'invalid-id',
        checkIn: '2024-02-15',
        checkOut: '2024-02-17'
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Property not found');
    });

    it('should fail with missing required fields', async () => {
      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should fail with invalid dates', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-02-17', // Check-out before check-in
        checkOut: '2024-02-15'
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Check-out date must be after check-in date');
    });

    it('should fail with past dates', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: '2020-01-01', // Past date
        checkOut: '2020-01-03'
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Check-in date cannot be in the past');
    });

    it('should require authentication', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-02-15',
        checkOut: '2024-02-17'
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .send(lockData)
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/bookings/confirm', () => {
    let lockKey;

    beforeEach(async () => {
      // Create a lock first
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-02-15',
        checkOut: '2024-02-17'
      };

      const lockResponse = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData);

      lockKey = lockResponse.body.lockKey;
    });

    it('should confirm booking successfully', async () => {
      const confirmData = {
        lockKey: lockKey,
        guests: 2,
        totalPrice: 200
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send(confirmData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Booking confirmed successfully');
      expect(response.body.booking).toBeDefined();
    });

    it('should fail with invalid lock key', async () => {
      const confirmData = {
        lockKey: 'invalid-lock-key',
        guests: 2,
        totalPrice: 200
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send(confirmData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid lock key format');
    });

    it('should fail with missing required fields', async () => {
      const response = await request('http://localhost:5000')
        .post('/api/bookings/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should fail when lock has expired', async () => {
      // Wait for lock to expire (in real scenario, this would be 10 minutes)
      // For testing, we'll use an invalid lock key
      const confirmData = {
        lockKey: 'booking_lock:expired:2024-01-01:2024-01-03',
        guests: 2,
        totalPrice: 200
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send(confirmData)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/bookings/lock/:lockKey', () => {
    let lockKey;

    beforeEach(async () => {
      // Create a lock first
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-02-15',
        checkOut: '2024-02-17'
      };

      const lockResponse = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData);

      lockKey = lockResponse.body.lockKey;
    });

    it('should release lock successfully', async () => {
      const response = await request('http://localhost:5000')
        .delete(`/api/bookings/lock/${lockKey}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Booking lock released successfully');
      expect(response.body.released).toBe(true);
    });

    it('should fail when trying to release another user\'s lock', async () => {
      const response = await request('http://localhost:5000')
        .delete(`/api/bookings/lock/${lockKey}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized to release this lock');
    });

    it('should require authentication', async () => {
      const response = await request('http://localhost:5000')
        .delete(`/api/bookings/lock/${lockKey}`)
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/bookings/locks', () => {
    it('should get all active locks', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/bookings/locks')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.locks)).toBe(true);
      expect(response.body.count).toBeDefined();
    });

    it('should require authentication', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/bookings/locks')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/bookings/cleanup-locks', () => {
    it('should cleanup expired locks', async () => {
      const response = await request('http://localhost:5000')
        .post('/api/bookings/cleanup-locks')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Lock cleanup completed');
      expect(response.body.totalLocks).toBeDefined();
      expect(response.body.cleaned).toBeDefined();
    });

    it('should require authentication', async () => {
      const response = await request('http://localhost:5000')
        .post('/api/bookings/cleanup-locks')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });
});
