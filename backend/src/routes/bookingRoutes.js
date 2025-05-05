import express from 'express';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Protect all routes
router.use(auth);

// Get user's bookings
router.get('/my-bookings', async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'property',
        select: 'title location price images maxGuests amenities rating'
      })
      .sort({ createdAt: -1 });

    const validBookings = bookings
      .filter(booking => booking.property !== null)
      .map(booking => ({
        _id: booking._id,
        property: {
          _id: booking.property._id,
          title: booking.property.title,
          location: booking.property.location,
          price: booking.property.price,
          images: booking.property.images,
          maxGuests: booking.property.maxGuests,
          amenities: booking.property.amenities,
          rating: booking.property.rating
        },
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        status: booking.status,
        bookingNumber: booking.bookingNumber
      }));

    res.json({
      success: true,
      bookings: validBookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, totalPrice } = req.body;

    // Input validation
    if (!propertyId || !checkIn || !checkOut || !guests || !totalPrice) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          propertyId: !propertyId,
          checkIn: !checkIn,
          checkOut: !checkOut,
          guests: !guests,
          totalPrice: !totalPrice
        }
      });
    }

    // Convert dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }

    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Calculate required rooms based on maxGuests per room
    const requiredRooms = Math.ceil(guests / property.maxGuests);
    const guestsPerRoom = Math.ceil(guests / requiredRooms);

    // Calculate total price on backend for security and consistency
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const calculatedTotalPrice = property.price * nights * requiredRooms;

    // Check if property is available for the selected dates
    const isAvailable = await Booking.checkAvailability(propertyId, checkInDate, checkOutDate);
    if (!isAvailable) {
      return res.status(400).json({ 
        message: 'Property is not available for the selected dates' 
      });
    }

    // Create new booking
    const booking = new Booking({
      user: req.user.id,
      property: propertyId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      numberOfRooms: requiredRooms,
      guestsPerRoom,
      totalPrice: calculatedTotalPrice, // Use backend-calculated total price
      status: 'confirmed' // Set initial status as confirmed
    });

    await booking.save();

    // Populate property details
    await booking.populate('property');
    await booking.populate('user', 'name email');

    res.status(201).json({ 
      booking,
      message: 'Booking confirmed successfully' 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Invalid booking data',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid property ID format' });
    }
    res.status(500).json({ message: 'Error creating booking. Please try again.' });
  }
});

// Get all bookings for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Ensure user can only access their own bookings
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view these bookings' 
      });
    }

    const bookings = await Booking.find({ user: req.params.userId })
      .populate({
        path: 'property',
        select: 'title location price images maxGuests amenities rating'
      })
      .sort({ createdAt: -1 });

    // Check if any bookings have null property (in case property was deleted)
    const validBookings = bookings.filter(booking => booking.property !== null);

    res.json({
      success: true,
      data: validBookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching bookings',
      error: error.message 
    });
  }
});

// Get a specific booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'property',
        select: 'title location price images maxGuests amenities rating description'
      })
      .populate({
        path: 'user',
        select: 'name email phone'
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure user can only access their own bookings
    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      booking: {
        _id: booking._id,
        property: {
          _id: booking.property._id,
          title: booking.property.title,
          location: booking.property.location,
          price: booking.property.price,
          images: booking.property.images,
          maxGuests: booking.property.maxGuests,
          amenities: booking.property.amenities,
          rating: booking.property.rating,
          description: booking.property.description
        },
        user: {
          name: booking.user.name,
          email: booking.user.email,
          phone: booking.user.phone
        },
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        status: booking.status,
        bookingNumber: booking.bookingNumber,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// Cancel a booking
router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

export default router; 