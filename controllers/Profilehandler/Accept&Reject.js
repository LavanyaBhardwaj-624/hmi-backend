const UserModel = require('../../models/user.model.js');
const NotificationModel = require('../../models/AdminNotification.js')
async function Accept(req , res){

   try{


    const Notification = await NotificationModel.findOneAndUpdate({
           _id: req.body._id,
           beforeCompanyId:req.company._id,
           adminId:req.user._id,
           status: "PENDING",
    },{
        status: "APPROVED",
        adminResponse: req.body.message,
        isRead: true,
    },{
        returnDocument: 'after',
    });

    if(!Notification){
        return res.status(422).json({
            message: "Notification Not Found",
        })
    }   

    const UpdateUser = await UserModel.findOneAndUpdate({
        _id : Notification.operatorId,
    },{
       companyId: Notification.afterCompanyId,
    },{
        returnDocument: 'after'
    })
    
    return res.status(200).json({
        message: "Request Approved",
    })

   }catch(err){
        return res.status(500).json({
            message: "Internal Server Error",
        })
   }
}

async function Reject(req , res){

   try{
    
    const Notification = await NotificationModel.findOneAndUpdate({
           _id: req.body._id,
           beforeCompanyId:req.company._id,
           adminId:req.user._id,
           status: "PENDING",
    },{
        status: "REJECTED",
        adminResponse: req.body.message,
        isRead: true,
    },{
        returnDocument: 'after',
    });
      if(!Notification){
        return res.status(422).json({
            message: "Notification Not Found",
        })
    }
    
    return res.status(200).json({
        message: "Request Rejected",
    })

   }catch(err){
        return res.status(500).json({
            message: "Internal Server Error",
        })
   }
}

module.exports = {
    Accept,
    Reject
}