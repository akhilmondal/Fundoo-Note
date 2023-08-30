import { createClient } from 'redis';
export const client = createClient();

const redis = async () => {
  try {
    await client.connect(); // To connect with redis database.
    console.log('Succesfully connected to the Redis Client');
  } catch (error) {
    console.log('Redis client connection failed.', error);
  }
};

export default redis;
