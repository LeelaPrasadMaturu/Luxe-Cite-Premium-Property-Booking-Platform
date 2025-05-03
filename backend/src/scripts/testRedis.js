import redisClient from '../config/redis.js';

async function testRedis() {
  try {
    console.log('Testing Redis Cloud connection...');
    
    // Test setting a value
    await redisClient.set('test', 'Hello Redis Cloud!');
    console.log('Successfully set test value');

    // Test getting the value
    const value = await redisClient.get('test');
    console.log('Retrieved value:', value);

    // Test setting with expiration
    await redisClient.setEx('test-expire', 60, 'This will expire in 60 seconds');
    console.log('Successfully set expiring value');

    // Test getting the expiring value
    const expiringValue = await redisClient.get('test-expire');
    console.log('Retrieved expiring value:', expiringValue);

    // Test property caching
    const testProperty = {
      id: 'test123',
      name: 'Test Hotel',
      price: 200
    };
    
    await redisClient.setEx(
      'property:test123',
      3600,
      JSON.stringify(testProperty)
    );
    console.log('Successfully cached test property');

    const cachedProperty = await redisClient.get('property:test123');
    console.log('Retrieved cached property:', cachedProperty);

    console.log('All Redis Cloud tests passed successfully!');
  } catch (error) {
    console.error('Redis Cloud test failed:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check your Redis Cloud credentials and connection string.');
    } else if (error.code === 'WRONGPASS') {
      console.error('Authentication failed. Please check your Redis Cloud password.');
    }
  } finally {
    // Close the Redis connection
    await redisClient.quit();
  }
}

testRedis(); 