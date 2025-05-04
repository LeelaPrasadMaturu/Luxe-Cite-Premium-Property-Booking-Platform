import { createClient } from 'redis';

// const client = createClient({
//     username: 'default',
//     password: 'j8iLpU841ugKvNc9AlchkDRXWO01QMw3',
//     socket: {
//         host: 'redis-16092.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 16092
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

// Create a Redis client with authentication and connection details
const client = createClient({
    username: 'default',
    password: 'j8iLpU841ugKvNc9AlchkDRXWO01QMw3',
    socket: {
        host: 'redis-16092.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 16092,
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000) // Reconnection strategy
    }
});

// Handle client events
client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Connected to Redis Cloud successfully'));

await client.connect();

// Perform Redis operations without closing the connection
async function handleRedisOperations() {
    try {
        // Verify connection
        const pingResponse = await client.ping();
        console.log(`Ping response: ${pingResponse}`);

        // Set key-value pair
        await client.set('foo', 'bar');
        console.log('Key "foo" set successfully');

        // Retrieve stored value
        const result = await client.get('foo');
        console.log(`Retrieved value: ${result}`);

    } catch (error) {
        console.error('Error interacting with Redis:', error);
    }
}

handleRedisOperations();

export default client;