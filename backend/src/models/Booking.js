import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  numberOfRooms: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  guestsPerRoom: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  bookingNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique booking number before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.bookingNumber = `BK${year}${month}${random}`;
  }
  next();
});

// Index for querying user's bookings
bookingSchema.index({ user: 1, status: 1 });

// Index for querying property's bookings
bookingSchema.index({ property: 1, status: 1 });

// Method to check if dates are available
bookingSchema.statics.checkAvailability = async function(propertyId, checkIn, checkOut) {
  const conflictingBookings = await this.find({
    property: propertyId,
    status: { $ne: 'cancelled' },
    $or: [
      {
        checkIn: { $lte: checkOut },
        checkOut: { $gte: checkIn },
      },
    ],
  });
  return conflictingBookings.length === 0;
};

export default mongoose.model('Booking', bookingSchema); 