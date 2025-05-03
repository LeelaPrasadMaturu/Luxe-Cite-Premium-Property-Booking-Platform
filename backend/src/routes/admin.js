import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getDashboardStats
} from '../controllers/adminController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Dashboard stats
router.get('/dashboard', verifyAdmin, getDashboardStats);

// User routes
router.get('/users', verifyAdmin, getAllUsers);
router.get('/users/:id', verifyAdmin, getUserById);
router.put('/users/:id', verifyAdmin, updateUser);
router.delete('/users/:id', verifyAdmin, deleteUser);

// Property routes
router.get('/properties', verifyAdmin, getAllProperties);
router.get('/properties/:id', verifyAdmin, getPropertyById);
router.put('/properties/:id', verifyAdmin, updateProperty);
router.delete('/properties/:id', verifyAdmin, deleteProperty);

// Booking routes
router.get('/bookings', verifyAdmin, getAllBookings);
router.get('/bookings/:id', verifyAdmin, getBookingById);
router.put('/bookings/:id', verifyAdmin, updateBooking);
router.delete('/bookings/:id', verifyAdmin, deleteBooking);

export default router; 