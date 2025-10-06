import redisClient from '../config/redis.js';
import Booking from '../models/Booking.js';

// Lock duration in seconds (10 minutes)
const LOCK_DURATION = 600;

// Lock monitoring and logging
const logLockEvent = (event, data) => {
  const timestamp = new Date().toISOString();
  console.log(`[BOOKING_LOCK] ${timestamp} - ${event}:`, JSON.stringify(data));
};

// Create a soft lock for booking
export const createBookingLock = async (propertyId, checkIn, checkOut, userId) => {
  try {
    const lockKey = `booking_lock:${propertyId}:${checkIn}:${checkOut}`;
    const lockData = {
      userId,
      propertyId,
      checkIn,
      checkOut,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + LOCK_DURATION * 1000).toISOString()
    };

    // Use SETNX to atomically create lock only if it doesn't exist
    const lockCreated = await redisClient.setNX(lockKey, JSON.stringify(lockData));
    
    if (!lockCreated) {
      // Lock already exists, get current lock info
      const existingLock = await redisClient.get(lockKey);
      const lockInfo = existingLock ? JSON.parse(existingLock) : null;
      
      logLockEvent('LOCK_CONFLICT', {
        propertyId,
        checkIn,
        checkOut,
        existingLock: lockInfo,
        requestingUser: userId
      });
      
      return {
        success: false,
        message: 'Property is currently being booked by another user',
        lockInfo
      };
    }

    // Set TTL for automatic expiration
    await redisClient.expire(lockKey, LOCK_DURATION);
    
    logLockEvent('LOCK_CREATED', {
      propertyId,
      checkIn,
      checkOut,
      userId,
      expiresIn: LOCK_DURATION
    });

    return {
      success: true,
      lockKey,
      expiresIn: LOCK_DURATION,
      lockData
    };
  } catch (error) {
    logLockEvent('LOCK_ERROR', { error: error.message, propertyId, checkIn, checkOut, userId });
    throw new Error('Failed to create booking lock');
  }
};

// Check if lock exists and is valid
export const checkBookingLock = async (propertyId, checkIn, checkOut) => {
  try {
    const lockKey = `booking_lock:${propertyId}:${checkIn}:${checkOut}`;
    const lockData = await redisClient.get(lockKey);
    
    if (!lockData) {
      return { exists: false };
    }

    const lock = JSON.parse(lockData);
    const now = new Date();
    const expiresAt = new Date(lock.expiresAt);
    
    if (now > expiresAt) {
      // Lock has expired, clean it up
      await redisClient.del(lockKey);
      logLockEvent('LOCK_EXPIRED', { propertyId, checkIn, checkOut, lock });
      return { exists: false, expired: true };
    }

    return { exists: true, lock };
  } catch (error) {
    logLockEvent('LOCK_CHECK_ERROR', { error: error.message, propertyId, checkIn, checkOut });
    return { exists: false, error: error.message };
  }
};

// Promote lock to confirmed booking
export const promoteLockToBooking = async (lockKey, bookingData) => {
  try {
    // Verify lock still exists and belongs to the user
    const lockData = await redisClient.get(lockKey);
    if (!lockData) {
      throw new Error('Booking lock has expired or been released');
    }

    const lock = JSON.parse(lockData);
    if (lock.userId !== bookingData.user) {
      throw new Error('Lock does not belong to requesting user');
    }

    // Create the booking
    const booking = new Booking(bookingData);
    await booking.save();
    await booking.populate('property');
    await booking.populate('user', 'name email');

    // Remove the lock since booking is confirmed
    await redisClient.del(lockKey);
    
    logLockEvent('LOCK_PROMOTED', {
      lockKey,
      bookingId: booking._id,
      userId: bookingData.user,
      propertyId: bookingData.property
    });

    return {
      success: true,
      booking
    };
  } catch (error) {
    logLockEvent('LOCK_PROMOTION_ERROR', { 
      error: error.message, 
      lockKey, 
      bookingData: { user: bookingData.user, property: bookingData.property }
    });
    throw error;
  }
};

// Release a booking lock
export const releaseBookingLock = async (lockKey) => {
  try {
    const result = await redisClient.del(lockKey);
    
    logLockEvent('LOCK_RELEASED', { lockKey, deleted: result > 0 });
    
    return {
      success: true,
      released: result > 0
    };
  } catch (error) {
    logLockEvent('LOCK_RELEASE_ERROR', { error: error.message, lockKey });
    throw new Error('Failed to release booking lock');
  }
};

// Get all active locks (for monitoring)
export const getAllActiveLocks = async () => {
  try {
    const pattern = 'booking_lock:*';
    const keys = await redisClient.keys(pattern);
    const locks = [];
    
    for (const key of keys) {
      const lockData = await redisClient.get(key);
      if (lockData) {
        const lock = JSON.parse(lockData);
        locks.push({
          key,
          ...lock,
          ttl: await redisClient.ttl(key)
        });
      }
    }
    
    return locks;
  } catch (error) {
    logLockEvent('GET_LOCKS_ERROR', { error: error.message });
    return [];
  }
};

// Clean up expired locks (can be run as a cron job)
export const cleanupExpiredLocks = async () => {
  try {
    const locks = await getAllActiveLocks();
    const now = new Date();
    let cleanedCount = 0;
    
    for (const lock of locks) {
      const expiresAt = new Date(lock.expiresAt);
      if (now > expiresAt) {
        await redisClient.del(lock.key);
        cleanedCount++;
        logLockEvent('LOCK_CLEANUP', { lockKey: lock.key, expired: true });
      }
    }
    
    logLockEvent('CLEANUP_COMPLETE', { totalLocks: locks.length, cleaned: cleanedCount });
    return { totalLocks: locks.length, cleaned: cleanedCount };
  } catch (error) {
    logLockEvent('CLEANUP_ERROR', { error: error.message });
    throw error;
  }
};
