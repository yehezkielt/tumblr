const { Redis } = require("ioredis");

const redis = new Redis({
    port: 15552,
    host: 'redis-15552.c1.asia-northeast1-1.gce.redns.redis-cloud.com',
    username: "default",
    password: process.env.REDIS_PASS,
    db: 0,
});

module.exports = redis;