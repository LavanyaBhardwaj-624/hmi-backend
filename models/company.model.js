const mongoose = require("mongoose");
const companySchema = new mongoose.Schema(
  {
    name: {
         type: String,
         required: [true , "Company name is required" ],
         trim: true,
         unique: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true , "A admin must be present to register a company"],
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selectedMachineTypes: [
      {
        type: String,
        enum: ["Packaging Line", "Boiler Unit", "Conveyor Belt"],
      },
    ],
    location:{
      type:String,
      required: [true , "Company Location is Required"]
    },
    companyId:{
        type:String,
        required: true,
        unique: true,
        trim: true,
    },
   contactemail: {
        type: String,
        required: [true ," email is required "],
        unique: [true , " email should be unique "],
        trim : true,
        lowercase: true,
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address" ],
    },
    contactname:{
    type: String,
    required: true
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);