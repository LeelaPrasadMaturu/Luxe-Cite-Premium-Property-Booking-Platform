import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });

// Update property rating when a review is created
reviewSchema.post('save', async function() {
  const Property = mongoose.model('Property');
  const reviews = await this.constructor.find({ property: this.property });
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  await Property.findByIdAndUpdate(this.property, {
    rating: averageRating,
  });
});

const Review = mongoose.model('Review', reviewSchema);

export default Review; 