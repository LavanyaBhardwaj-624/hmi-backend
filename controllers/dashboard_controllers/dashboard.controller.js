const Machine = require("../../models/machine.model.js");
const AlarmEvent = require("../../models/alarm.model.js");
const AdminNotification = require("../../models/AdminNotification.js");

async function getDashboard(req, res) {
  try {
    const companyId = req.company._id;

    //  const io = req.app.get("io"); //io instance

    //  Machines
    const machines = await Machine.find({ companyId: companyId });
    
    const totalMachines = machines.length;
  

    let running = 0;
    let stopped = 0;

    machines.forEach((m) => {
      if (m.isActive) running++;
      else stopped++;
    });

    // Active alarms
    const activeAlarms = await AlarmEvent.find({
      companyId,
      status: "active"
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Stats
    const alarmCount = activeAlarms.length;

    // telemetry: --
    const telemetry = machines.map((m) => ({
      machineName: m.machineName,
      state: m.isActive ? "Running" : "Stopped"
    }));
    
    const Notify = await AdminNotification.findOne({ 
      adminId: req.user._id,
      status: "PENDING",
    })
    let HasNotification = Notify ? true : false;
    const resData =  {
      stats: {
        totalMachines,
        running,
        stopped,
        alarms: alarmCount,
        
      },
      machines,
      alarms: activeAlarms,
      telemetry,
      HasNotification,
      UserDetails:{
      name: req.user.name,
      role: req.user.role,
      }
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