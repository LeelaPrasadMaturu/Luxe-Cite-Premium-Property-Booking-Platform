import { 
  createBookingLock, 
  checkBookingLock, 
  promoteLockToBooking, 
  releaseBookingLock,
  getAllActiveLocks,
  cleanupExpiredLocks 
} from '../src/services/bookingLockService.js';
import redisClient from '../src/config/redis.js';

// Mock Redis client
jest.mock('../src/config/redis.js', () => ({
  setNX: jest.fn(),
  expire: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  ttl: jest.fn()
}));

describe('Booking Lock Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBookingLock', () => {
    it('should create a booking lock successfully', async () => {
      const propertyId = '507f1f77bcf86cd799439011';
      const checkIn = '2024-01-15';
      const checkOut = '2024-01-17';
      const userId = '507f1f77bcf86cd799439012';

      redisClient.setNX.mockResolvedValue(true);
      redisClient.expire.mockResolvedValue(true);

      const result = await createBookingLock(propertyId, checkIn, checkOut, userId);

      expect(result.success).toBe(true);
      expect(result.lockKey).toContain('booking_lock:');
      expect(result.expiresIn).toBe(600); // 10 minutes
      expect(redisClient.setNX).toHaveBeenCalled();
      expect(redisClient.expire).toHaveBeenCalled();
    });

    it('should fail when lock already exists', async () => {
      const propertyId = '507f1f77bcf86cd799439011';
      const checkIn = '2024-01-15';
      const checkOut = '2024-01-17';
      const userId = '507f1f77bcf86cd799439012';

      redisClient.setNX.mockResolvedValue(false);
      redisClient.get.mockResolvedValue(JSON.stringify({
        userId: 'other-user-id',
        propertyId,
        checkIn,
        checkOut,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 600000).toISOString()
      }));

      const result = await createBookingLock(propertyId, checkIn, checkOut, userId);

      expect(result.success).toBe(false);
      expect(result.message).toContain('currently being booked');
    });

    it('should handle Redis errors gracefully', async () => {
      const propertyId = '507f1f77bcf86cd799439011';
      const checkIn = '2024-01-15';
      const checkOut = '2024-01-17';
      const userId = '507f1f77bcf86cd799439012';

      redisClient.setNX.mockRejectedValue(new Error('Redis connection failed'));

      await expect(createBookingLock(propertyId, checkIn, checkOut, userId))
        .rejects.toThrow('Failed to create booking lock');
    });
  });

  describe('checkBookingLock', () => {
    it('should return lock exists when valid lock found', async () => {
      const propertyId = '507f1f77bcf86cd799439011';
      const checkIn = '2024-01-15';
      const checkOut = '2024-01-17';

      const lockData = {
        userId: '507f1f77bcf86cd799439012',
        propertyId,
        checkIn,
        checkOut,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 600000).toISOString()
      };

      redisClient.get.mockResolvedValue(JSON.stringify(lockData));

      const result = await checkBookingLock(propertyId, checkIn, checkOut);

      expect(result.exists).toBe(true);
      expect(result.lock).toEqual(lockData);
    });

    it('should return lock expired when TTL exceeded', async () => {
      const propertyId = '507f1f77bcf86cd799439011';
      const checkIn = '2024-01-15';
      const checkOut = '2024-01-17';

      const expiredLock = {
        userId: '507f1f77bcf86cd799439012',
        propertyId,
        checkIn,
        checkOut,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() - 1000).toISOString() // Expired
      };

      redisClient.get.mockResolvedValue(JSON.stringify(expiredLock));
      redisClient.del.mockResolvedValue(1);

      const result = await checkBookingLock(propertyId, checkIn, checkOut);

      expect(result.exists).toBe(false);
      expect(result.expired).toBe(true);
      expect(redisClient.del).toHaveBeenCalled();
    });

    it('should return lock not exists when no lock found', async () => {
      const propertyId = '507f1f77bcf86cd799439011';
      const checkIn = '2024-01-15';
      const checkOut = '2024-01-17';

      redisClient.get.mockResolvedValue(null);

      const result = await checkBookingLock(propertyId, checkIn, checkOut);

      expect(result.exists).toBe(false);
    });
  });

  describe('promoteLockToBooking', () => {
    it('should promote lock to booking successfully', async () => {
      const lockKey = 'booking_lock:507f1f77bcf86cd799439011:2024-01-15:2024-01-17';
      const bookingData = {
        user: '507f1f77bcf86cd799439012',
        property: '507f1f77bcf86cd799439011',
        checkIn: new Date('2024-01-15'),
        checkOut: new Date('2024-01-17'),
        guests: 2,
        numberOfRooms: 1,
        guestsPerRoom: 2,
        totalPrice: 200,
        status: 'confirmed'
      };

      const lockData = {
        userId: '507f1f77bcf86cd799439012',
        propertyId: '507f1f77bcf86cd799439011',
        checkIn: '2024-01-15',
        checkOut: '2024-01-17'
      };

      redisClient.get.mockResolvedValue(JSON.stringify(lockData));
      redisClient.del.mockResolvedValue(1);

      // Mock Booking model
      const mockBooking = {
        _id: '507f1f77bcf86cd799439013',
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockResolvedValue(true)
      };

      // Mock Booking constructor
      const MockBooking = jest.fn().mockImplementation(() => mockBooking);
      jest.doMock('../src/models/Booking.js', () => MockBooking);

      const result = await promoteLockToBooking(lockKey, bookingData);

      expect(result.success).toBe(true);
      expect(result.booking).toBeDefined();
      expect(redisClient.del).toHaveBeenCalledWith(lockKey);
    });

    it('should fail when lock has expired', async () => {
      const lockKey = 'booking_lock:507f1f77bcf86cd799439011:2024-01-15:2024-01-17';
      const bookingData = {
        user: '507f1f77bcf86cd799439012',
        property: '507f1f77bcf86cd799439011'
      };

      redisClient.get.mockResolvedValue(null);

      await expect(promoteLockToBooking(lockKey, bookingData))
        .rejects.toThrow('Booking lock has expired or been released');
    });

    it('should fail when lock belongs to different user', async () => {
      const lockKey = 'booking_lock:507f1f77bcf86cd799439011:2024-01-15:2024-01-17';
      const bookingData = {
        user: '507f1f77bcf86cd799439012',
        property: '507f1f77bcf86cd799439011'
      };

      const lockData = {
        userId: 'different-user-id',
        propertyId: '507f1f77bcf86cd799439011',
        checkIn: '2024-01-15',
        checkOut: '2024-01-17'
      };

      redisClient.get.mockResolvedValue(JSON.stringify(lockData));

      await expect(promoteLockToBooking(lockKey, bookingData))
        .rejects.toThrow('Lock does not belong to requesting user');
    });
  });

  describe('releaseBookingLock', () => {
    it('should release lock successfully', async () => {
      const lockKey = 'booking_lock:507f1f77bcf86cd799439011:2024-01-15:2024-01-17';

      redisClient.del.mockResolvedValue(1);

      const result = await releaseBookingLock(lockKey);

      expect(result.success).toBe(true);
      expect(result.released).toBe(true);
      expect(redisClient.del).toHaveBeenCalledWith(lockKey);
    });

    it('should handle lock not found gracefully', async () => {
      const lockKey = 'booking_lock:507f1f77bcf86cd799439011:2024-01-15:2024-01-17';

      redisClient.del.mockResolvedValue(0);

      const result = await releaseBookingLock(lockKey);

      expect(result.success).toBe(true);
      expect(result.released).toBe(false);
    });
  });

  describe('getAllActiveLocks', () => {
    it('should return all active locks', async () => {
      const lockKeys = [
        'booking_lock:507f1f77bcf86cd799439011:2024-01-15:2024-01-17',
        'booking_lock:507f1f77bcf86cd799439014:2024-01-20:2024-01-22'
      ];

      const lockData1 = {
        userId: '507f1f77bcf86cd799439012',
        propertyId: '507f1f77bcf86cd799439011',
        checkIn: '2024-01-15',
        checkOut: '2024-01-17',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 600000).toISOString()
      };

      const lockData2 = {
        userId: '507f1f77bcf86cd799439015',
        propertyId: '507f1f77bcf86cd799439014',
        checkIn: '2024-01-20',
        checkOut: '2024-01-22',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 600000).toISOString()
      };

      redisClient.keys.mockResolvedValue(lockKeys);
      redisClient.get
        .mockResolvedValueOnce(JSON.stringify(lockData1))
        .mockResolvedValueOnce(JSON.stringify(lockData2));
      redisClient.ttl
        .mockResolvedValueOnce(300)
        .mockResolvedValueOnce(400);

      const result = await getAllActiveLocks();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        key: lockKeys[0],
        ...lockData1,
        ttl: 300
      });
    });

    it('should return empty array when no locks found', async () => {
      redisClient.keys.mockResolvedValue([]);

      const result = await getAllActiveLocks();

      expect(result).toHaveLength(0);
    });
  });

  describe('cleanupExpiredLocks', () => {
    it('should cleanup expired locks', async () => {
      const locks = [
        {
          key: 'booking_lock:expired:2024-01-15:2024-01-17',
          expiresAt: new Date(Date.now() - 1000).toISOString(), // Expired
          userId: '507f1f77bcf86cd799439012'
        },
        {
          key: 'booking_lock:active:2024-01-20:2024-01-22',
          expiresAt: new Date(Date.now() + 600000).toISOString(), // Active
          userId: '507f1f77bcf86cd799439015'
        }
      ];

      redisClient.keys.mockResolvedValue([locks[0].key, locks[1].key]);
      redisClient.get
        .mockResolvedValueOnce(JSON.stringify(locks[0]))
        .mockResolvedValueOnce(JSON.stringify(locks[1]));
      redisClient.ttl
        .mockResolvedValueOnce(-1)
        .mockResolvedValueOnce(300);
      redisClient.del.mockResolvedValue(1);

      const result = await cleanupExpiredLocks();

      expect(result.totalLocks).toBe(2);
      expect(result.cleaned).toBe(1);
      expect(redisClient.del).toHaveBeenCalledWith(locks[0].key);
    });
  });
});
