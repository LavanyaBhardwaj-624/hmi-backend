const ModbusRTU = require("modbus-serial");


const machineFieldMap = {
    "Boiler Unit": ["Temperature", "Pressure", "Water Level"],
    "Conveyor Belt": ["Speed", "Load", "Vibration", "Motor Temp"],
    "Packaging Line": ["Temperature", "Pressure", "Speed", "Load", "Vibration"]
};

//authUser -> modbusconnection -> setdata

function extraction(machine) {
    return {
        Port: machine.Port,
        IpAddress: machine.IpAddress,
        machineType: machine.machineType
    };
}

async function connectPLC(machine) {
    const client = new ModbusRTU();
    try {
        const obj = extraction(machine);

        await client.connectTCP(obj.IpAddress, {
            port: obj.Port
        });

        client.setID(1);

        const fields = machineFieldMap[obj.machineType];

        if (!fields) {
           throw new Error("Invalid machine type"); 
        }

        const response = await client.readHoldingRegisters(0, fields.length);

        
        const machineData = {};

        fields.forEach((field, index) => {
            machineData[field] = response.data[index];
        });

        return machineData;

    } catch (err) {
        console.log(err.message);
    } finally {
        await client.close();
    }
}

module.exports = connectPLC;