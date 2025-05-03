import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;

    // Check if user has a completed booking for this property
    const booking = await Booking.findOne({
      property: propertyId,
      user: req.user.id,
      status: 'COMPLETED'
    });

    if (!booking) {
      return res.status(403).json({ message: 'You can only review properties you have stayed at' });
    }

    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({
      property: propertyId,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this property' });
    }

    const review = new Review({
      property: propertyId,
      user: req.user.id,
      rating,
      comment,
      booking: booking._id
    });

    await review.save();
    await review.populate([
      { path: 'user', select: 'name' },
      { path: 'property', select: 'title' }
    ]);

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
};

// @desc    Get reviews for a property
// @route   GET /api/properties/:propertyId/reviews
// @access  Public
export const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name')
      .populate('property', 'title');

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const { rating, comment } = req.body;
    review.rating = rating;
    review.comment = comment;

    await review.save();
    await review.populate([
      { path: 'user', select: 'name' },
      { path: 'property', select: 'title' }
    ]);

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
}; 