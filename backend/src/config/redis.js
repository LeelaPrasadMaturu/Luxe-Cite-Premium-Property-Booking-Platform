import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://default:your_password@redis-12345.c123.us-east-1-4.ec2.cloud.redislabs.com:12345'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

await redisClient.connect();

export default redisClient; 