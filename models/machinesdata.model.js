const mongoose = require('mongoose');

const machineReadingSchema = new mongoose.Schema(
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
      enum: ["Packaging Line", "Boiler Unit", "Conveyor Belt"],
      required: true,
    },
    
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    versionKey: false 
  }
);

module.exports = mongoose.model("MachineReading", machineReadingSchema);