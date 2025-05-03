import express from 'express';
import Property from '../models/Property.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all properties (moved to top)
router.get('/all', async (req, res) => {
  try {
    console.log('Properties Route - Fetching all properties');
    const properties = await Property.find();
    console.log(`Properties Route - Found ${properties.length} properties`);
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

// Search properties with filters
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
    res.json({
      success: true,
      properties: properties
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error searching properties',
      error: error.message 
    });
  }
});

// GET all properties with filters
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

    return res.json({
      success: true,
      properties: properties,
      message: location ? `Showing results for "${location}"` : 'All properties'
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching properties',
      error: error.message 
    });
  }
});

// GET a single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    return res.json({
      success: true,
      data: property,
      message: 'Property details retrieved successfully'
    });
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

// POST a new property
router.post('/', async (req, res) => {
  try {
    const property = new Property(req.body);
    const newProperty = await property.save();
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

// PUT (update) a property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property) {
      Object.assign(property, req.body);
      const updatedProperty = await property.save();
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

// DELETE a property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property) {
      await property.deleteOne();
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