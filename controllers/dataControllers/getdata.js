const { find } = require('../../models/machine.model.js');
const machineReadings = require('../../models/machinesdata.model.js')
const alarmModel = require('../../models/alarm.model.js')
const thresholdModel = require('../../models/threshold.model.js')
const machineModel = require('../../models/machine.model.js')
/** api/data/me: id -> to frontend
 * 
 * first Authuser -> getdata
  */


async function getdata( req , res){

    const user = req.user._id;
    const companyId = req.company._id;
    if(!req.body.id){
       return res.status(400).json({
        message: " Bad request "
       })
    }
  
    const machineid = req.body.id;
   
    try{
    const machine = await machineModel.findById(machineid)
    if(!machine){
      return res.status(400).json({
        message: " Bad request "
      })
    }
    const data= await machineReadings.find( {companyId: companyId , machineId: machineid , machineType: machine.machineType}).sort({ createdAt: -1 }) // newest first
   .limit(20);

    if(!data){
       return res.status(400).json({
        message: "machine is off"
       })
    }

    const threshold = await thresholdModel.findOne({ companyId: companyId , machineId: machineid })
    console.log(threshold)
    const machinethreshold = threshold.get('thresholds');
    console.log(machinethreshold)
    const alarms = await alarmModel.find( { companyId: companyId , machineId: machineid });
    let totalalarms = 0 , critical = 0 , warning = 0;
    if(alarms){
      totalalarms = alarms.length;
      
      alarms.forEach(element => {
        if(element.severity === 'critical') critical++;
        else warning++;
      });
    }
    const recentdata = data[[0]].data;

    return res.status(200).json({
        message: "success",
        data: {
        UserData:{
          user: req.user,
        },
        MachinetoShow:{
          machine: machine
        },
        CompanyDet:{
        company: req.company,
        },
        CurrentData :{
          recentdata
        },
        History:{
        datahistory: data,
        },
        AlarmDetails:{
          total: totalalarms,
          critical: critical,
          warning: warning
        },
        threshold:{
          machinethreshold
        }
        }
    })
    }catch(err){
        console.log(`getdata.js : ${err.message}`);
        return res.status(500).json({
             message: " Internal Server Error "
        })
    }

}

module.exports = getdata