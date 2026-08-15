
const UserModel = require('../../models/user.model.js');
const CompanyModel = require('../../models/company.model.js');
const AdminNotificationModel = require('../../models/AdminNotification.js');

async function UpdateUser(req , res){

     try{
            const body = req.body;
            const user = req.user;
            const UserData = body.UserData;

            const UpdateUser = await UserModel.findOneAndUpdate(
               { _id: user._id },
            {
                name: UserData.name ?? user.name,
                email: UserData.email ?? user.email,
            },
             { returnDocument: 'after' }
            );
            if(!UpdateUser){
                return res.status(404).json({
                   message: "User Not Found",
                })
            }     
            return res.status(200).json({
                message: "Details has been Updated",
            })
            
          }catch(err){
               return res.status(500).json({
                message: "Internel server error",
            })
          }
}

async function UpdateCompany(req , res){

    try{

        const company = req.company;
        const CompanyDetail = req.body.CompanyData;
        const companyTochange = await CompanyModel.findOne({
             companyId: CompanyDetail.companyId,
            selectedMachineTypes: {
               $exists: true,
               $not: { $size: 0 },
            },
           })

        if(!companyTochange){
            return res.status(400).json({
                message: `Company Doesn't exist . Please Verify ID of Company where you want to change
                          Or it may not have any Machine Yet.`
            })
        }

        const id = companyTochange._id;
        const UpdateCompany = await CompanyModel.findOneAndUpdate({
            _id : company._id,
        },{
            companyTochange: id,
        },{
            returnDocument: 'after'
        })

        const notify = await AdminNotificationModel.create({
            adminId: company.adminId,
            operatorId: req.user._id,
            beforeCompanyId: company._id,
            afterCompanyId: id,
        })

        return res.status(200).json({
            message: "Company change Request Sent to Admin"
        })
    }catch(err){
        console.log(err.message)
        res.status(500).json({
            message: " Internal Server Error! , Request Couldn't be sent",
        })
    }
}

module.exports = {
     UpdateUser,
     UpdateCompany
}