const ModbusRTU = require("modbus-serial");


const machineFieldMap = {
  "Boiler Unit": [
    { name: "Temperature", address: 0 },
    { name: "Pressure", address: 1 },
    { name: "Water Level", address: 2 }
  ],

  "Conveyor Belt": [
    { name: "Speed", address: 3 },
    { name: "Load", address: 4 },
    { name: "Vibration", address: 5 },
    { name: "Motor Temp", address: 6 }
  ],

  "Packaging Line": [
    { name: "Temperature", address: 7 },
    { name: "Pressure", address: 8 },
    { name: "Speed", address: 9 },
    { name: "Load", address: 10 },
    { name: "Vibration", address: 11 }
  ]
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
        // 1. Connect
        await client.connectTCP(machine.IpAddress, {
            port: machine.Port
        });

        client.setID(machine.unitId || 1);

        const config = machineFieldMap[machine.machineType];

        if (!config) {
            throw new Error("Invalid machine type");
        }

        
        const addresses = config.map(f => f.address);
        const minAddr = Math.min(...addresses);
        const maxAddr = Math.max(...addresses);
        const length = maxAddr - minAddr + 1;

       
        const response = await client.readHoldingRegisters(minAddr, length);

        const machineData = {};

        config.forEach(field => {
            const index = field.address - minAddr;
            machineData[field.name] = response.data[index];
        });

        return machineData;

    } catch (err) {
        console.error("Modbus Error:", err.message);
        return null;
    } finally {
        if (client.isOpen) {
            client.close();
        }
    }
}

module.exports = connectPLC;