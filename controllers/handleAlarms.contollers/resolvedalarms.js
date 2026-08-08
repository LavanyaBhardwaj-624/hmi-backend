// const alarmModel = require('../../models/alarm.model.js');
// const thresholdModel = require('../../models/threshold.model.js')


// /**
//  * first auth
//  * 
//  * resolvedalarms
//  *  */ 
// async function resolvedalarms( req , res){
 
//    try{
//        const alarm = await alarmModel.findOneAndUpdate({ 
//          companyId: machine.companyId, 
//          machineId: machine.machineId,
//          field: key,
//       } ,{
//         $set:{
//            status: "acknowledged",
//            acknowledgedBy: req.user._id,
//         }
//        },{
//           new: true,
//           setDefaultsOnInsert: true
//        })

//         return res.status(200).json({
//             description: "Ok",
//             message: `alarm has been acknowledged`
//          })
//       }catch(err){
//          return res.status(500).json({

//             message: `server error : ${err.message}`
//          })
//       }
// }

// module.exports = resolvedalarms