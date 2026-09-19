const modbusconnection = require('../config/Modbus.connection.js')
const setmachinesdata = require('./dataControllers/setmachineData.js')
const addalarms = require('./handleAlarms.contollers/addAlarms.js')
const MachineModel = require('../models/machine.model.js')


async function backgroundjob() {
    const allmachines = await MachineModel.find();

    await Promise.all(
        allmachines.map(async (machine) => {
            try {

                const machineData = await modbusconnection(machine);
                console.log(machineData)
                if (!machineData) {
                    if (machine.status !== "offline") {
                        console.warn(
                            `[WARN] Machine ${machine._id}: ${machine.status} → offline`
                        );
                    }

                    await MachineModel.findByIdAndUpdate(machine._id, {
                      $set:{
                        isActive: false,
                        status: "offline",
                        
                      },
                    });
                    return;
                }

                if (machine.status !== "online") {
                    console.log(
                        `[INFO] Machine ${machine._id}: ${machine.status} → online`
                    );
                }
                await MachineModel.findByIdAndUpdate(machine._id, {
                  $set:{
                    isActive: true,
                    status: "online",
                    lastSeen: new Date()
                  },
                });

                await setmachinesdata(machine, machineData);
                await addalarms(machine, machineData);

            } catch (err) {
            
                await MachineModel.findByIdAndUpdate(machine._id, {
                    $set: {
                        isActive: false,
                        status: "offline",
                    }
                });
            console.log( 'error in abckground job' , err.mesage)
            }
        })
    );
}

module.exports = backgroundjob;