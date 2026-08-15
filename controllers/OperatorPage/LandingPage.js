const machine = require('../../models/machine.model.js')
const AlarmModel = require('../../models/alarm.model.js')
/** api/data/me:id -> request from frontend
 * 
 * first Authuser -> getmymachines (send macine data to user)
 * 
 * also apply rate limiter (for 5 requests)
  */

/* when user click on machines tabs -> first request to backend api => /api/machines => first authuser -> 
   getmymachines. */
async function Opmachines(req, res) {
    const companyId = req.company._id;
    if (!companyId) {
      return res.status(400).json({ description: "Bad Request", message: "Missing companyId" });
    }


   try{
  
    const machines = await machine.find({ companyId});
    
    const alarms = await AlarmModel.find({ 
        companyId ,
        status: "active",
      }).length;

    return res.status(200).json({
        description: "OK",
        message: "Fetched",
        data:{
            Machines: machines,
            UserName: req.user.name,
            alarmCount: alarms,
        }
    });
  }catch(err){
        return res.status(500).json({
        description: "server error",
        message: "internal server error",
    });
  } 
}

module.exports = Opmachines