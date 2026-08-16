const alarmModel = require('../../models/alarm.model.js')
const machineModel = require('../../models/machine.model.js')

async function getalarms( req , res){

    const companyId = req.company._id
    try{
    const alarms = await alarmModel.find({ companyId: companyId}).populate("machineId");
   
    return res.status(200).json({
        message: "success",
        data:alarms
    })
    }catch(err){
         return res.status(500).json({
          message: ' internal server error '
        })
    }
}

module.exports = getalarms