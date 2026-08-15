const client = require('../config/redis.js');


async function ratelimiter(req , res , next){

    try{

    const ip = req.ip;

    const requests = await client.incr(ip)

    if( Number(requests) >= 10 ){
        return res.status(429).json({
            message: 'request limit reached'
        })
    }

    if( Number(requests) == 1){
        await client.expire(ip , 120)
    }

    next()
   }catch(err){
     return res.status(500).json({
        message: "internal error!"
     })
   }
}

module.exports = ratelimiter