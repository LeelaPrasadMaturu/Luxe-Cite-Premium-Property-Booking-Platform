import express from 'express';
import {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/property/:propertyId', getPropertyReviews);

// Protected routes
router.post('/', auth, createReview);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

export default router; 