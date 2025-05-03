const request = require('supertest');
const app = require('../src/app');

describe('Properties API', () => {
  describe('GET /api/properties', () => {
    it('should get all properties', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.properties)).toBe(true);
      expect(response.body.properties.length).toBeGreaterThan(0);
    });

    it('should filter properties by location', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({ location: 'Mumbai' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties[0].location).toBe('Mumbai');
    });

    it('should filter properties by price range', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({ minPrice: 200, maxPrice: 1500 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties[0].price).toBeGreaterThanOrEqual(200);
      expect(response.body.properties[0].price).toBeLessThanOrEqual(1500);
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should get a property by ID', async () => {
      // First get a list of properties to get a valid ID
      const listResponse = await request(app)
        .get('/api/properties')
        .expect(200);

      const propertyId = listResponse.body.properties[0]._id;

      const response = await request(app)
        .get(`/api/properties/${propertyId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.property._id.toString()).toBe(propertyId.toString());
    });

    it('should return 404 for non-existent property', async () => {
      const response = await request(app)
        .get('/api/properties/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
}); 