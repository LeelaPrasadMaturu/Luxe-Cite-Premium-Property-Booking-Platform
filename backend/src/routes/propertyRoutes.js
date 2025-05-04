import express from 'express';
import Property from '../models/Property.js';
import auth from '../middleware/auth.js';
import redisClient from '../config/redis.js';

const router = express.Router();

// Cache duration in seconds (1 hour)
// const CACHE_DURATION = 3600;
const CACHE_DURATION = 5;
// this is in seconds

// Helper function to generate cache key based on query parameters
const generateCacheKey = (prefix, query) => {
  const queryString = Object.keys(query)
    .sort()
    .map(key => `${key}=${query[key]}`)
    .join('&');
  return `${prefix}:${queryString || 'all'}`;
};

// Get all properties with Redis caching
router.get('/all', async (req, res) => {
  try {
    const cacheKey = 'properties:all';
    
    // Try to get data from Redis cache
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache HIT: Retrieved properties from Redis cache');
      return res.json(JSON.parse(cachedData));
    }
    
    console.log('Cache MISS: Fetching properties from database - Route: GET /api/properties/all');
    const properties = await Property.find();
    
    // Cache the results
    await redisClient.setEx(
      cacheKey,
      CACHE_DURATION,
      JSON.stringify({
        success: true,
        properties: properties
      })
    );
    
    res.json({
      success: true,
      properties: properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching properties',
      error: error.message 
    });
  }
});

// Search properties with filters and Redis caching
router.get('/search', async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      guests,
      rating,
      amenities,
      specialOffers,
      checkIn,
      checkOut
    } = req.query;
    
    // Generate cache key based on search parameters
    const cacheKey = generateCacheKey('properties:search', req.query);
    
    // Try to get data from Redis cache
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache HIT: Retrieved search results from Redis cache');
      return res.json(JSON.parse(cachedData));
    }
    
    console.log('Cache MISS: Fetching search results from database - Route: GET /api/properties/search');
    let query = {};

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    if (specialOffers === 'true') {
      query.hasSpecialOffer = true;
    }

    if (checkIn && checkOut) {
      query.availability = {
        $not: {
          $elemMatch: {
            startDate: { $lte: new Date(checkOut) },
            endDate: { $gte: new Date(checkIn) }
          }
        }
      };
    }

    const properties = await Property.find(query);
    const response = {
      success: true,
      properties: properties
    };

    // Cache the results
    await redisClient.setEx(
      cacheKey,
      CACHE_DURATION,
      JSON.stringify(response)
    );

    res.json(response);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error searching properties',
      error: error.message 
    });
  }
});

// GET all properties with filters and Redis caching
router.get('/', async (req, res) => {
  try {
    const {
      location,
      checkIn,
      checkOut,
      guests,
      minPrice,
      maxPrice,
      rating,
      amenities,
      specialOffers
    } = req.query;

    // Generate cache key based on query parameters
    const cacheKey = generateCacheKey('properties:filtered', req.query);
    
    // Try to get data from Redis cache
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache HIT: Retrieved filtered properties from Redis cache');
      return res.json(JSON.parse(cachedData));
    }
    
    console.log('Cache MISS: Fetching filtered properties from database - Route: GET /api/properties');
    let query = {};

    // Location filter (case-insensitive partial match)
    if (location) {
      query.$or = [
        { location: { $regex: location, $options: 'i' } },
        { title: { $regex: location, $options: 'i' } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Guest capacity filter
    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    // Special offers filter
    if (specialOffers === 'true') {
      query.hasSpecialOffer = true;
    }

    // Date availability filter
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      
      // Ensure check-out is after check-in
      if (endDate <= startDate) {
        return res.status(400).json({ 
          success: false,
          message: 'Check-out date must be after check-in date' 
        });
      }

      query.availability = {
        $not: {
          $elemMatch: {
            startDate: { $lte: endDate },
            endDate: { $gte: startDate },
            isBooked: true
          }
        }
      };
    }

    const properties = await Property.find(query)
      .sort({ rating: -1, price: 1 });

    const response = {
      success: true,
      properties: properties,
      message: location ? `Showing results for "${location}"` : 'All properties'
    };

    // Cache the results
    await redisClient.setEx(
      cacheKey,
      CACHE_DURATION,
      JSON.stringify(response)
    );

    return res.json(response);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching properties',
      error: error.message 
    });
  }
});

// GET a single property by ID with Redis caching
router.get('/:id', async (req, res) => {
  try {
    const cacheKey = `property:${req.params.id}`;
    
    // Try to get data from Redis cache
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache HIT: Retrieved property details from Redis cache');
      return res.json(JSON.parse(cachedData));
    }
    
    console.log('Cache MISS: Fetching property details from database - Route: GET /api/properties/:id');
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const response = {
      success: true,
      data: property,
      message: 'Property details retrieved successfully'
    };

    // Cache the results
    await redisClient.setEx(
      cacheKey,
      CACHE_DURATION,
      JSON.stringify(response)
    );

    return res.json(response);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID format'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error fetching property details',
      error: error.message
    });
  }
});

// POST a new property with cache invalidation
router.post('/', auth, async (req, res) => {
  try {
    const property = new Property(req.body);
    const newProperty = await property.save();
    
    // Invalidate relevant caches
    await Promise.all([
      redisClient.del('properties:all'),
      redisClient.del('properties:search:*')
    ]);
    
    console.log('Cache INVALIDATED: Cleared property caches after new property creation');
    
    res.status(201).json({
      success: true,
      property: newProperty
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error creating property',
      error: error.message 
    });
  }
});

// PUT (update) a property with cache invalidation
router.put('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property) {
      Object.assign(property, req.body);
      const updatedProperty = await property.save();
      
      // Invalidate relevant caches
      await Promise.all([
        redisClient.del('properties:all'),
        redisClient.del('properties:search:*'),
        redisClient.del(`property:${req.params.id}`)
      ]);
      
      console.log('Cache INVALIDATED: Cleared property caches after property update');
      
      res.json({
        success: true,
        property: updatedProperty
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error updating property',
      error: error.message 
    });
  }
});

// DELETE a property with cache invalidation
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property) {
      await property.deleteOne();
      
      // Invalidate relevant caches
      await Promise.all([
        redisClient.del('properties:all'),
        redisClient.del('properties:search:*'),
        redisClient.del(`property:${req.params.id}`)
      ]);
      
      console.log('Cache INVALIDATED: Cleared property caches after property deletion');
      
      res.json({ 
        success: true,
        message: 'Property deleted' 
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting property',
      error: error.message 
    });
  }
});

export default router; 

// post, put, delete has auth middleware check
// get has no auth middleware check