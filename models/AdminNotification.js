

const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  
    beforeCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },


    afterCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    type: {
      type: String,
      enum: ["COMPANY_CHANGE_REQUEST"],
      default: "COMPANY_CHANGE_REQUEST",
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
    adminResponse: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AdminNotification = mongoose.model("AdminNotification",adminNotificationSchema);

module.exports = AdminNotification;