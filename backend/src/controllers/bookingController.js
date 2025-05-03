const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;

    // Get property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Calculate total price
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * nights;

    // Create booking
    const booking = new Booking({
      property: propertyId,
      user: req.user.id,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'PENDING'
    });

    await booking.save();
    await booking.populate([
      { path: 'property', select: 'title location price images' },
      { path: 'user', select: 'name email' }
    ]);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// @desc    Get all bookings for user
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    let bookings;
    
    if (req.user.role === 'ADMIN') {
      // Admin can see all bookings
      bookings = await Booking.find()
        .populate('property', 'title location price images')
        .populate('user', 'name email');
    // Removed HOST logic
      // Removed HOST logic
      // Removed HOST logic
      const propertyIds = properties.map(p => p._id);
      bookings = await Booking.find({ property: { $in: propertyIds } })
        .populate('property', 'title location price images')
        .populate('user', 'name email');
    } else {
      // Guest can see their own bookings
      bookings = await Booking.find({ user: req.user.id })
        .populate('property', 'title location price images')
        .populate('user', 'name email');
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property', 'title location price images')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    if (
      req.user.role !== 'ADMIN' &&
      booking.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('property', 'title location price images host')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
}; 