import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import { createError } from '../utils/error.js';

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return next(createError(404, 'User not found'));
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    if (!updatedUser) return next(createError(404, 'User not found'));
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted');
  } catch (err) {
    next(err);
  }
};

// Get all properties
export const getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (err) {
    next(err);
  }
};

// Get property by ID
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return next(createError(404, 'Property not found'));
    res.status(200).json(property);
  } catch (err) {
    next(err);
  }
};

// Update property
export const updateProperty = async (req, res, next) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedProperty) return next(createError(404, 'Property not found'));
    res.status(200).json(updatedProperty);
  } catch (err) {
    next(err);
  }
};

// Delete property
export const deleteProperty = async (req, res, next) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json('Property has been deleted');
  } catch (err) {
    next(err);
  }
};

// Get all bookings
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('property', 'title location');
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

// Get booking by ID
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('property', 'title location');
    if (!booking) return next(createError(404, 'Booking not found'));
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

// Update booking
export const updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('property', 'title location');
    if (!updatedBooking) return next(createError(404, 'Booking not found'));
    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

// Delete booking
export const deleteBooking = async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json('Booking has been deleted');
  } catch (err) {
    next(err);
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('property', 'title');

    res.status(200).json({
      totalUsers,
      totalProperties,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentBookings
    });
  } catch (err) {
    next(err);
  }
}; 