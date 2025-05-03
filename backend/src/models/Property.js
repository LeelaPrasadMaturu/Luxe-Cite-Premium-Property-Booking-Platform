import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  amenities: [{
    type: String,
  }],
  maxGuests: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  hasSpecialOffer: {
    type: Boolean,
    default: false,
  },
  specialOfferDetails: {
    type: String,
  },
  availability: [{
    startDate: Date,
    endDate: Date,
    isBooked: {
      type: Boolean,
      default: false,
    }
  }],
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create text indexes for search
propertySchema.index({ 
  title: 'text', 
  location: 'text', 
  description: 'text' 
});

export default mongoose.model('Property', propertySchema); 