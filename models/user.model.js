const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
     name:{
        type: String,
        required: [true , "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true ," email is required "],
        unique: [true , " email should be unique "],
        trim : true,
        lowercase: true,
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address" ],
    },
     password: {
        type: String,
        required: [true , " Password is required for security purposes"],
        minlength: 8,
        select: false   
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "operator"],
        default: "operator",
      },
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    isComplete:{
      type: Boolean,
      required:true,
      default:false 
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);