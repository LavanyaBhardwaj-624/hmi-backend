const alarmModel = require('../../models/alarm.model.js')

async function Save(req ,res){

    const machineId = req.body.machineId
    const companyId = req.company._id
    const field = req.body.field
    const Id = req.body.Id
    const status = req.body.status
    try{

        const data = await alarmModel.findOneAndUpdate({  _id: Id , companyId: companyId} ,
            {
            $set:{
                status: status,
                acknowledgedBy: req.user._id
            }
            } , {
          returnDocument: 'after',
          setDefaultsOnInsert: true
        });
        
        if(!data){
            return res.status(400).json({
                message: 'Bad Input'
            })
        }
        const alarms = await alarmModel.find({ companyId : companyId})

        if(!alarms){
            return res.status(400).json({
                message: 'Bad Input'
            })
        }
    return res.status(200).json({
        message: "success",
        data:alarms
    })
    }catch(err){
         return res.status(500).json({
          message: ' internal server error '
        })
     
    }

}

module.exports = Save