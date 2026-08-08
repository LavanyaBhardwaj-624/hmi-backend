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
      console.log("internal Failure : " + err.message)
  }
}

module.exports = setdata