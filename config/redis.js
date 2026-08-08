const redis =  require('redis');

const {createClient} = redis;

require('dotenv').config();

const client = createClient({
    username: 'default',
    password: process.env.password,
    socket: {
        host: process.env.url,
        port: Number(process.env.redis_port)
    }
});

client.on('error', err => console.log('Redis Client Error', err));

module.exports = client;



