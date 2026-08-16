
const UserModel = require('../../models/user.model.js')
async function sendUser( req , res){

   try{
    const company =  req.company;
    const user = req.user;

    if(!user || !company){
        return res.status(404).json({
           message: "User details Not found",
        })
    }

    const admin = await UserModel.findById(company.createdBy);

     if(!admin){
        return res.status(404).json({
           message: "admin is not found",
        })        
     }
    return res.status(200).json({
        profile: user,
        company: company,
        admin: admin
    })

  }catch(err){

    return res.status(500).json({
        message: "Some Internal error",
        err: err.message,
    })
  }
}

module.exports = sendUser;