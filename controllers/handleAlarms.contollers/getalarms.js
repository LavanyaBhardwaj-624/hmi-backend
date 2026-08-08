const alarmModel = require('../../models/alarm.model.js')
const machineModel = require('../../models/machine.model.js')
/**
 * authuser -> getalarms
 */

async function getalarms( req , res){

    const companyId = req.company._id
    try{
    const alarms = await alarmModel.find({ companyId: companyId}).populate("machineId");
   
    // const categorizedAlarms = {
    //     all: alarms,
    //     active: [],
    //     acknowledged: [],
    //     resolved: [],
    //  };

    //    alarms.forEach((alarm) => {
    //        if (categorizedAlarms[alarm.status]) {
    //          categorizedAlarms[alarm.status].push(alarm);
    //        }
    //     });

    // const Severity_Categorized = {
    //     all: alarms,
    //     warning: [],
    //     critical: []
    // }
    // alarms.forEach((alarm) => {
    //     Severity_Categorized[alarm.severity].push(alarm);
    // })

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