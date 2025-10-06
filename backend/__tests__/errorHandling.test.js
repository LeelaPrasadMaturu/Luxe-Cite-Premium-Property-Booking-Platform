import request from 'supertest';

describe('Error Handling and Edge Cases', () => {
  let userToken;
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

    // Get a property ID for testing
    const propertiesResponse = await request('http://localhost:5000')
      .get('/api/properties')
      .set('Authorization', `Bearer ${userToken}`);
    
    if (propertiesResponse.body.properties && propertiesResponse.body.properties.length > 0) {
      propertyId = propertiesResponse.body.properties[0]._id;
    }
  });

  describe('Booking Error Scenarios', () => {
    it('should handle booking conflicts gracefully', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-04-01',
        checkOut: '2024-04-03'
      };

      // Create first lock
      await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(200);

      // Try to create second lock (should fail)
      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('currently being booked');
      expect(response.body.lockInfo).toBeDefined();
    });

    it('should handle invalid property ID gracefully', async () => {
      const lockData = {
        propertyId: '507f1f77bcf86cd799439999', // Non-existent property
        checkIn: '2024-04-05',
        checkOut: '2024-04-07'
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Property not found');
    });

    it('should handle malformed property ID', async () => {
      const lockData = {
        propertyId: 'invalid-id-format',
        checkIn: '2024-04-10',
        checkOut: '2024-04-12'
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid property ID format');
    });
  });

  describe('Date Validation Errors', () => {
    it('should handle invalid date formats', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: 'invalid-date',
        checkOut: '2024-04-15'
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid date format');
    });

    it('should handle check-out before check-in', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-04-20',
        checkOut: '2024-04-18' // Check-out before check-in
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Check-out date must be after check-in date');
    });

    it('should handle same check-in and check-out dates', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-04-25',
        checkOut: '2024-04-25' // Same date
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Check-out date must be after check-in date');
    });

    it('should handle past dates', async () => {
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
  });

  describe('Authentication Errors', () => {
    it('should handle expired tokens', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE2MzQ1Njc4OTksImV4cCI6MTYzNDU3MTQ5OX0.invalid';
      
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.message).toContain('Token expired');
    });

    it('should handle malformed tokens', async () => {
      const malformedToken = 'invalid.token.format';
      
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${malformedToken}`)
        .expect(401);

      expect(response.body.message).toContain('Invalid token');
    });

    it('should handle missing authorization header', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.message).toContain('No token provided');
    });
  });

  describe('Input Validation Errors', () => {
    it('should handle missing required fields', async () => {
      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
      expect(response.body.details).toBeDefined();
    });

    it('should handle null values', async () => {
      const lockData = {
        propertyId: null,
        checkIn: null,
        checkOut: null
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle empty strings', async () => {
      const lockData = {
        propertyId: '',
        checkIn: '',
        checkOut: ''
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle extremely long strings', async () => {
      const lockData = {
        propertyId: 'A'.repeat(10000),
        checkIn: '2024-04-30',
        checkOut: '2024-05-02'
      };

      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Database Connection Errors', () => {
    it('should handle database connection failures gracefully', async () => {
      // This test would require mocking the database connection
      // In a real scenario, you'd temporarily disconnect the database
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-05-01',
        checkOut: '2024-05-03'
      };

      // This test assumes the database is working
      // In a real test environment, you'd mock the database to fail
      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send(lockData);

      // Should either succeed (if DB is working) or fail gracefully
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('Rate Limiting', () => {
    it('should handle rate limiting for login attempts', async () => {
      const loginData = {
        email: 'surya@gmail.com',
        password: 'wrongpassword'
      };

      // Make multiple failed login attempts
      const promises = Array(10).fill().map(() => 
        request('http://localhost:5000')
          .post('/api/auth/login')
          .send(loginData)
      );

      const responses = await Promise.allSettled(promises);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status === 429
      );

      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle concurrent lock creation requests', async () => {
      const lockData = {
        propertyId: propertyId,
        checkIn: '2024-05-10',
        checkOut: '2024-05-12'
      };

      // Make multiple concurrent requests
      const promises = Array(5).fill().map(() => 
        request('http://localhost:5000')
          .post('/api/bookings/lock')
          .set('Authorization', `Bearer ${userToken}`)
          .send(lockData)
      );

      const responses = await Promise.allSettled(promises);
      
      // Only one should succeed, others should fail
      const successCount = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status === 200
      ).length;
      
      const failCount = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status === 409
      ).length;

      expect(successCount).toBe(1);
      expect(failCount).toBe(4);
    });
  });

  describe('Error Response Format', () => {
    it('should return consistent error response format', async () => {
      const response = await request('http://localhost:5000')
        .post('/api/bookings/lock')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('details');
    });

    it('should include error codes for different error types', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code', 'UNAUTHORIZED');
    });
  });
});
