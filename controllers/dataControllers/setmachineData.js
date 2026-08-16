const machinemodel = require('../../models/machine.model.js')
const machineReading = require('../../models/machinesdata.model.js')


async function setdata(machine ,machineData){

    try{

    const companyId = machine.companyId;
    
    const machineId = machine._id;

    const data = await machineReading.create({
        companyId,
        machineId,
        machineType: machine.machineType,
        data: machineData
    })

  }catch(err){
    return res.status(500).json({
    message: "internal server error , reading couldn't be stored"
    })
  }
}

module.exports = setdata