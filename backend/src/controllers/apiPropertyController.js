import Property from '../models/Property.js';
import redisClient from '../config/redis.js';

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600;

export const getProperties = async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;
    const cacheKey = `properties:${location || 'all'}:${minPrice || '0'}:${maxPrice || '999999'}`;

    // Try to get from cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    let query = {};
    if (location) {
      query.location = location;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query);
    const response = {
      success: true,
      properties,
      message: location ? `Showing results for "${location}"` : 'All properties retrieved successfully'
    };

    // Cache the response
    await redisClient.setEx(cacheKey, CACHE_DURATION, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `property:${id}`;

    // Try to get from cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const response = {
      success: true,
      data: property
    };

    // Cache the response
    await redisClient.setEx(cacheKey, CACHE_DURATION, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
};

// Add cache invalidation for create, update, and delete operations
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    // Invalidate the properties cache
    await redisClient.del('properties:all:0:999999');
    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndUpdate(id, req.body, { new: true });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    // Invalidate both the specific property cache and the properties list cache
    await redisClient.del(`property:${id}`);
    await redisClient.del('properties:all:0:999999');
    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    // Invalidate both the specific property cache and the properties list cache
    await redisClient.del(`property:${id}`);
    await redisClient.del('properties:all:0:999999');
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
}; 