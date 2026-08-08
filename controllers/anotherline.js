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

                if (!machineData) {
                    await MachineModel.findByIdAndUpdate(machine._id, {
                        status: "offline",
                        lastSeen: new Date()
                    });
                    return;
                }

                await MachineModel.findByIdAndUpdate(machine._id, {
                    status: "online",
                    lastSeen: new Date()
                });

                await setmachinesdata(machine, machineData);
                await addalarms(machine, machineData);

            } catch (err) {
                console.error(`${machine.machineName}: ${err.message}`);

                await MachineModel.findByIdAndUpdate(machine._id, {
                    status: "offline",
                    lastSeen: new Date()
                });
            }
        })
    );
}

module.exports = backgroundjob;