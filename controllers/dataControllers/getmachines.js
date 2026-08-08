const machine = require('../../models/machine.model.js')
const client = require('../../config/redis.js')
/** api/data/me:id -> request from frontend
 * 
 * first Authuser -> getmymachines (send macine data to user)
 * 
 * also apply rate limiter (for 5 requests)
  */

/* when user click on machines tabs -> first request to backend api => /api/machines => first authuser -> 
   getmymachines. */
async function getmymachines(req, res) {
    const companyId = req.company._id;
    if (!companyId) {
      return res.status(400).json({ description: "Bad Request", message: "Missing companyId" });
    }

    const cacheKey = `company:${companyId}:machines`;

   try{
    const cachedMachines = await client.get(cacheKey);

    if (cachedMachines) {
        return res.status(200).json({
            description: "OK",
            message: "Fetched from Redis",
            data: JSON.parse(cachedMachines)
        });
    }

   
    const machines = await machine.find({ companyId, isActive: true});
   
    await client.set(cacheKey, JSON.stringify(machines),{
            EX: 86400
        }
    );

    //delete the key with this username if machiens are modify(change , inc or dec) in edit api.
   console.log(machines)
    return res.status(200).json({
        description: "OK",
        message: "Fetched",
        data: machines
    });
  }catch(err){
        return res.status(500).json({
        description: "server error",
        message: "internal server error",
    });
  } 
}

module.exports = getmymachines