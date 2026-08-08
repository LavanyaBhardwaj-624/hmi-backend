const mongoose = require('mongoose');

const machineConfigSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
      required: true,
    },

    thresholds: {
       type: Map,
         of: new mongoose.Schema(
           {
               high: Number,
               low: Number
            },
        { _id: false }
      )
    },

    alarms: {
        type: Map,
          of: new mongoose.Schema(
          {
           enabled: { type: Boolean, default: true }
         },
        { _id: false }
       )
     }
  },
  { timestamps: true }
);

const threshold = mongoose.model( "threshold" , machineConfigSchema)

module.exports = threshold