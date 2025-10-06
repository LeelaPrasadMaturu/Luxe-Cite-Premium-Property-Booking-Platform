import request from 'supertest';

describe('Payment Flow Integration Tests', () => {
  let userToken;
  let propertyId;
  let lockKey;

  beforeEach(async () => {
    // Get user token
    const userLogin = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'surya@gmail.com',
        password: '123456'
      });
    userToken = userLogin.body.token;

    // Get a property ID for testing
    const propertiesResponse = await request('http://localhost:5000')
      .get('/api/properties')
      .set('Authorization', `Bearer ${userToken}`);
    
    if (propertiesResponse.body.properties && propertiesResponse.body.properties.length > 0) {
      propertyId = propertiesResponse.body.properties[0]._id;
    }
  });

  describe('Complete Payment Flow', () => {
    it('should complete full booking flow: lock -> payment -> confirm', async () => {
      // Step 1: Create booking lock
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-02-15',
        checkOut: '2024-02-17'
      };

      const lockResponse = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(200);

      expect(lockResponse.body.success).toBe(true);
      lockKey = lockResponse.body.lockKey;

      // Step 2: Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Step 3: Confirm booking (simulate successful payment)
      const confirmData = {
        lockKey: lockKey,
        guests: 2,
        totalPrice: 200
      };

      const confirmResponse = await request('http://localhost:5000')
        .post('/api/bookings/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send(confirmData)
        .expect(201);

      expect(confirmResponse.body.success).toBe(true);
      expect(confirmResponse.body.booking).toBeDefined();
      expect(confirmResponse.body.booking.status).toBe('confirmed');
    });

    it('should handle payment failure and release lock', async () => {
      // Step 1: Create booking lock
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-02-20',
        checkOut: '2024-02-22'
      };

      const lockResponse = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(200);

      lockKey = lockResponse.body.lockKey;

      // Step 2: Simulate payment failure by releasing lock
      const releaseResponse = await request('http://localhost:5000')
        .delete(`/api/bookings/lock/${lockKey}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(releaseResponse.body.success).toBe(true);
      expect(releaseResponse.body.released).toBe(true);

      // Step 3: Verify lock is released (try to confirm should fail)
      const confirmData = {
        lockKey: lockKey,
        guests: 2,
        totalPrice: 200
      };

      const confirmResponse = await request('http://localhost:5000')
        .post('/api/bookings/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send(confirmData)
        .expect(500);

      expect(confirmResponse.body.success).toBe(false);
    });

    it('should prevent double booking during payment process', async () => {
      // Step 1: Create first lock
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-02-25',
        checkOut: '2024-02-27'
      };

      const lockResponse1 = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(200);

      // Step 2: Try to create second lock for same dates (should fail)
      const lockResponse2 = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(409);

      expect(lockResponse2.body.success).toBe(false);
      expect(lockResponse2.body.message).toContain('currently being booked');
    });

    it('should handle concurrent booking attempts', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-03-01',
        checkOut: '2024-03-03'
      };

      // Simulate concurrent lock creation attempts
      const promises = [
        request('http://localhost:5000')
          .post('/api/bookings/lock')
          .set('Authorization', `Bearer ${userToken}`)
          .send(lockData),
        request('http://localhost:5000')
          .post('/api/bookings/lock')
          .set('Authorization', `Bearer ${userToken}`)
          .send(lockData)
      ];

      const responses = await Promise.allSettled(promises);
      
      // One should succeed, one should fail
      const successCount = responses.filter(r => r.status === 'fulfilled' && r.value.status === 200).length;
      const failCount = responses.filter(r => r.status === 'fulfilled' && r.value.status === 409).length;

      expect(successCount).toBe(1);
      expect(failCount).toBe(1);
    });
  });

  describe('Payment Error Handling', () => {
    it('should handle invalid payment data', async () => {
      // Create lock first
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-03-05',
        checkOut: '2024-03-07'
      };

      const lockResponse = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(200);

      lockKey = lockResponse.body.lockKey;

      // Try to confirm with invalid data
      const invalidConfirmData = {
        lockKey: lockKey,
        guests: -1, // Invalid guest count
        totalPrice: -100 // Invalid price
      };

      const confirmResponse = await request('http://localhost:5000')
        .post('/api/bookings/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidConfirmData)
        .expect(500);

      expect(confirmResponse.body.success).toBe(false);
    });

    it('should handle network errors during payment', async () => {
      // This test would simulate network failures
      // In a real scenario, you'd mock the payment service
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-03-10',
        checkOut: '2024-03-12'
      };

      const lockResponse = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(200);

      lockKey = lockResponse.body.lockKey;

      // Simulate network error by using invalid lock key
      const confirmData = {
        lockKey: 'invalid-lock-key',
        guests: 2,
        totalPrice: 200
      };

      const confirmResponse = await request('http://localhost:5000')
        .post('/api/bookings/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send(confirmData)
        .expect(400);

      expect(confirmResponse.body.success).toBe(false);
    });
  });

  describe('Lock Expiry Handling', () => {
    it('should handle lock expiry gracefully', async () => {
      // Create lock
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-03-15',
        checkOut: '2024-03-17'
      };

      const lockResponse = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(200);

      lockKey = lockResponse.body.lockKey;

      // In a real scenario, we'd wait for the lock to expire (10 minutes)
      // For testing, we'll simulate by using an expired lock key format
      const expiredLockKey = 'booking_lock:expired:2024-01-01:2024-01-03';
      
      const confirmData = {
        lockKey: expiredLockKey,
        guests: 2,
        totalPrice: 200
      };

      const confirmResponse = await request('http://localhost:5000')
        .post('/api/bookings/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send(confirmData)
        .expect(500);

      expect(confirmResponse.body.success).toBe(false);
    });
  });
});
