import request from 'supertest';

describe('Properties API', () => {
  describe('GET /api/properties', () => {
    it('should get all properties', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.properties)).toBe(true);
      expect(response.body.properties.length).toBeGreaterThan(0);
    });

    it('should filter properties by location - Dubai', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties')
        .query({ location: 'Dubai' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties.length).toBeGreaterThan(0);
      expect(response.body.properties[0].location).toBe('Dubai');
      expect(response.body.message).toBe('Showing results for "Dubai"');
    });

    it('should filter properties by location - New York', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties')
        .query({ location: 'New York' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties.length).toBeGreaterThan(0);
      expect(response.body.properties[0].location).toBe('New York');
      expect(response.body.message).toBe('Showing results for "New York"');
    });

    it('should filter properties by price range', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties')
        .query({ minPrice: 200, maxPrice: 1500 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties.length).toBeGreaterThan(0);
      expect(response.body.properties[0].price).toBeGreaterThanOrEqual(200);
      expect(response.body.properties[0].price).toBeLessThanOrEqual(1500);
    });
  });




  describe('GET /api/properties/:id', () => {
    it('should get a property by ID', async () => {
      // First, get a list of properties to retrieve a valid ID
      const listResponse = await request('http://localhost:5000')
        .get('/api/properties')
        .expect(200);
  
      const propertyId = listResponse.body.properties[0]._id; // Ensure this exists

      console.log(propertyId);
  
      const response = await request('http://localhost:5000')
        .get(`/api/properties/${propertyId}`)
        .expect(200);
  
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data._id.toString()).toBe(propertyId.toString());
    });
  
    it('should return 404 for non-existent property', async () => {
      const response = await request('http://localhost:5000')
        .get('/api/properties/507f1f77bcf86cd799439011')
        .expect(404);
  
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Property not found');
    });
  });

  // describe('GET /api/properties/:id', () => {
  //   it('should get a property by ID', async () => {
  //     // First get a list of properties to get a valid ID
  //     const listResponse = await request('http://localhost:5000')
  //       .get('/api/properties')
  //       .expect(200);

  //     const propertyId = listResponse.body.data[0]._id;

  //     const response = await request('http://localhost:5000')
  //       .get(`/api/properties/${propertyId}`)
  //       .expect(200);

  //     expect(response.body.success).toBe(true);
  //     expect(response.body.property).toBeDefined();
  //     expect(response.body.property._id.toString()).toBe(propertyId.toString());
  //   });

  //   it('should return 404 for non-existent property', async () => {
  //     const response = await request('http://localhost:5000')
  //       .get('/api/properties/507f1f77bcf86cd799439011')
  //       .expect(404);

  //     expect(response.body.success).toBe(false);
  //     expect(response.body.message).toBe('Property not found');
  //   });
  // });
}); 