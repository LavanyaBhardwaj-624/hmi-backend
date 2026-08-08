const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    machineType: {
      type: String,
      enum: ["Packaging Line", "Boiler Unit", "Conveyor Belt"],
      required: true,
    },

    machineName: { type: String, required: true },
    Location:{
      type:String,
       required: true,
    },
    IpAddress:{
      type: String,
      required: true,
    },
    Port:{
      type: Number,
      required: true,
      min: 1,
    },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum:["offline" , "online"],
      default: "online"
    },
    lastSeen: {
    type: Date,
    default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Machine' , machineSchema);