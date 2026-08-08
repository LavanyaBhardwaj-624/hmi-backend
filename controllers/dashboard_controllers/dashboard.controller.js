const Machine = require("../../models/machine.model.js");
const AlarmEvent = require("../../models/alarm.model.js");

async function getDashboard(req, res) {
  try {
    const companyId = req.company._id;

    //  const io = req.app.get("io"); //io instance

    // 1️⃣ Machines
    const machines = await Machine.find({ companyId: companyId });
    
   
    
    const totalMachines = machines.length;
  

    // Simulated status (later replace with real PLC data)
    let running = 0;
    let stopped = 0;

    machines.forEach((m) => {
      if (m.isActive) running++;
      else stopped++;
    });

    // 2️⃣ Active alarms
    const activeAlarms = await AlarmEvent.find({
      companyId,
      status: "active"
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // 3️⃣ Stats
    const alarmCount = activeAlarms.length;

    // telemetry: --
    const telemetry = machines.map((m) => ({
      machineName: m.machineName,
      state: m.isActive ? "Running" : "Stopped"
    }));

    const resData =  {
      stats: {
        totalMachines,
        running,
        stopped,
        alarms: alarmCount
      },
      machines,
      alarms: activeAlarms,
      telemetry
    };


    res.status(200).json(resData);

       // 👇 ALSO emit real-time update
    // io.emit("dashboardUpdate", resData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getDashboard };