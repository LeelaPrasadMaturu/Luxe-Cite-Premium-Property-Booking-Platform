import request from 'supertest';

describe('Property GET API', () => {
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

  describe('GET /api/properties', () => {
    it('should get all properties without filters', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.properties)).toBe(true);
      expect(response.body.properties.length).toBeGreaterThan(0);
      expect(response.body.properties[0]).toHaveProperty('title');
      expect(response.body.properties[0]).toHaveProperty('price');
    });

    it('should get properties with location filter', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties?location=Hyderabad')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.properties)).toBe(true);
      expect(response.body.message).toContain('Hyderabad');
    });

    it('should get properties with price range filter', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties?minPrice=1000&maxPrice=5000')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.properties)).toBe(true);
      response.body.properties.forEach(property => {
        expect(property.price).toBeGreaterThanOrEqual(1000);
        expect(property.price).toBeLessThanOrEqual(5000);
      });
    });

    it('should get properties with multiple filters', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties?location=Hyderabad&minPrice=1000&maxPrice=5000')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.properties)).toBe(true);
      expect(response.body.message).toContain('Hyderabad');
      response.body.properties.forEach(property => {
        expect(property.price).toBeGreaterThanOrEqual(1000);
        expect(property.price).toBeLessThanOrEqual(5000);
      });
    });

    it('should handle invalid date range', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties?checkIn=2024-03-05&checkOut=2024-03-01')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Check-out date must be after check-in date');
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should get property by valid ID', async () => {
      const propertyId = '68167fd7fc8866b35241f1ce';
      const response = await request('http://localhost:5000')
        .get(`/api/properties/${propertyId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id', propertyId);
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('price');
    });

    it('should return 400 for non-existent property', async () => {
      const nonExistentId = '68167fd7fcb35241f1ff'; // Assuming this ID doesn't exist
      const response = await request('http://localhost:5000')
        .get(`/api/properties/${nonExistentId}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid property ID format');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties/invalidid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid property ID format');
    });
  });

  describe('GET /api/properties/search', () => {
    it('should search properties by location', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties/search?location=Hyderabad')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.properties)).toBe(true);
      if (response.body.properties.length > 0) {
        expect(response.body.properties[0].location).toContain('Hyderabad');
      }
    });

    it('should search properties by amenities', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties/search?amenities=wifi,pool')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.properties)).toBe(true);
    });

    it('should search properties by date range', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties/search?checkIn=2024-03-01&checkOut=2024-03-05')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.properties)).toBe(true);
    });

    it('should search properties with multiple criteria', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties/search?location=Hyderabad&minPrice=1000&maxPrice=5000&amenities=wifi')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.properties)).toBe(true);
    });
  });
}); 