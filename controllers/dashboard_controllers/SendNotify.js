const AdminNotification = require('../../models/AdminNotification.js');

async function SendNotification(req , res){

    try{

        const user = req.user;

        const Notification = await AdminNotification.find({
            adminId: user._id,
            status: "PENDING",
        }).populate("operatorId").populate("afterCompanyId");
        
        return res.status(200).json({
            Notification,
        })

    }catch(err){
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }

}
module.exports = SendNotification