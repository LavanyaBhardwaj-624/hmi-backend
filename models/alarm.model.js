const mongoose = require('mongoose');

const alarmEventSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
      index: true
    },

    machineType: {
      type: String,
      required: true
    },

    //for  dynamic field (temperature, pressure, etc)
    field: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    actualValue: Number,

    // store full threshold object
    threshold: {
      high: Number,
      low: Number
    },

  
    status: {
      type: String,
      enum: ["active", "acknowledged", "resolved"],
      default: "active"
    },

    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    severity: {
      type: String,
      enum: ["warning", "critical"],
      required: true
    },
 
    direction: {
      type: String,
      enum: ["high", "low"],
      required: true
    },
  },
  { timestamps: true }
);

// useful index
alarmEventSchema.index({ companyId: 1, machineId: 1, field: 1 });

module.exports = mongoose.model("AlarmEvent", alarmEventSchema);


/*const alarmEventSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
      index: true,
    },

    machineType: {
      type: String,
      enum: ["packaging_line", "boiler", "conveyor_belt"],
      required: true,
    },

    alarmType: { type: String, required: true },
    message: { type: String, required: true },

    actualValue: Number,
    thresholdValue: Number,

    status: {
      type: String,
      enum: ["active", "acknowledged", "resolved"],
      default: "active",
    },
  },
  { 
    timestamps: true 
}
);

alarmEventSchema.index({ companyId: 1 , machineId: 1})

module.exports = mongoose.model("AlarmEvent", alarmEventSchema);

/*
 const alarmEventSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
      index: true,
    },

    machineType: {
      type: String,
      enum: ["packaging_line", "boiler", "conveyor_belt"],
      required: true,
    },

    alarmType: { type: String, required: true }, // temperature, pressure, speed etc
    message: { type: String, required: true },

    actualValue: Number,
    thresholdValue: Number,

    status: {
      type: String,
      enum: ["active", "acknowledged", "resolved"],
      default: "active",
    },

    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AlarmEvent", alarmEventSchema);
 */