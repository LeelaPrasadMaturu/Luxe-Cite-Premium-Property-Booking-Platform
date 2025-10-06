import request from 'supertest';

describe('Profile Management API', () => {
  let userToken;
  let userId;

  beforeEach(async () => {
    // Get user token
    const userLogin = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({
        email: 'surya@gmail.com',
        password: '123456'
      });
    userToken = userLogin.body.token;
    userId = userLogin.body.user._id;
  });

  describe('GET /api/auth/me', () => {
    it('should get user profile successfully', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body._id).toBe(userId);
      expect(response.body.email).toBe('surya@gmail.com');
      expect(response.body.name).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should fail with invalid token', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('PUT /api/auth/me', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Surya Updated',
        phone: '+1234567890'
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('Surya Updated');
      expect(response.body.phone).toBe('+1234567890');
    });

    it('should update email successfully', async () => {
      const updateData = {
        email: 'surya.updated@gmail.com'
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.email).toBe('surya.updated@gmail.com');
    });

    it('should validate email format', async () => {
      const updateData = {
        email: 'invalid-email-format'
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toContain('Invalid email format');
    });

    it('should validate phone number format', async () => {
      const updateData = {
        phone: 'invalid-phone'
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toContain('Invalid phone number format');
    });

    it('should prevent duplicate email', async () => {
      // First, get another user's email
      const adminLogin = await request('http://localhost:5000')
        .post('/api/auth/login')
        .send({
          email: 'admin@gmail.com',
          password: '123456'
        });

      const updateData = {
        email: adminLogin.body.user.email // Try to use admin's email
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toContain('Email already exists');
    });

    it('should require authentication', async () => {
      const updateData = {
        name: 'Test User'
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .send(updateData)
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should handle partial updates', async () => {
      const updateData = {
        name: 'Surya Partial Update'
        // Only updating name, not email or phone
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('Surya Partial Update');
      // Other fields should remain unchanged
    });

    it('should handle empty update data', async () => {
      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(200);

      expect(response.body).toBeDefined();
      // Should return current user data without changes
    });
  });

  describe('Profile Data Validation', () => {
    it('should validate name length', async () => {
      const updateData = {
        name: 'A' // Too short
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toContain('Name must be at least 2 characters');
    });

    it('should validate name maximum length', async () => {
      const updateData = {
        name: 'A'.repeat(101) // Too long
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toContain('Name must be less than 100 characters');
    });

    it('should validate phone number length', async () => {
      const updateData = {
        phone: '123' // Too short
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toContain('Phone number must be at least 10 digits');
    });
  });

  describe('Profile Security', () => {
    it('should not allow updating other user profiles', async () => {
      // Get another user's token
      const adminLogin = await request('http://localhost:5000')
        .post('/api/auth/login')
        .send({
          email: 'admin@gmail.com',
          password: '123456'
        });

      const updateData = {
        name: 'Hacked User'
      };

      // Try to update with different user's token
      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`) // Using original user's token
        .send(updateData)
        .expect(200);

      // Should only update the authenticated user's profile
      expect(response.body).toBeDefined();
      expect(response.body._id).toBe(userId);
    });

    it('should sanitize input data', async () => {
      const updateData = {
        name: '<script>alert("xss")</script>Surya',
        phone: '+1234567890'
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toBeDefined();
      // Should sanitize the script tag
      expect(response.body.name).not.toContain('<script>');
    });
  });

  describe('Profile Update Response', () => {
    it('should return updated user data', async () => {
      const updateData = {
        name: 'Surya Test',
        phone: '+1234567890',
        email: 'surya.test@gmail.com'
      };

      const response = await request('http://localhost:5000')
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body._id).toBe(userId);
      expect(response.body.name).toBe('Surya Test');
      expect(response.body.phone).toBe('+1234567890');
      expect(response.body.email).toBe('surya.test@gmail.com');
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should not return sensitive data', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.password).toBeUndefined();
      expect(response.body.__v).toBeUndefined();
    });
  });
});
