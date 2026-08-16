const machine = require('../../models/machine.model.js')
const AlarmModel = require('../../models/alarm.model.js')

async function Opmachines(req, res) {
    const companyId = req.company._id;
    if (!companyId) {
      return res.status(400).json({ description: "Bad Request", message: "Missing companyId" });
    }


   try{
  
    const machines = await machine.find({ companyId});
    
    const alarms = await AlarmModel.find({ companyId ,status: "active",});
    const  alarmsCount = alarms.length;

    return res.status(200).json({
        description: "OK",
        message: "Fetched",
        data:{
            Machines: machines,
            UserName: req.user.name,
            alarmCount: alarmsCount,
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