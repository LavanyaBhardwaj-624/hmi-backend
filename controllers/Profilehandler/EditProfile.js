const UserModel = require('../../models/user.model.js');
const CompanyModel = require('../../models/company.model.js')
function EditProfile( req , res){

    try{

        const body = req.body;
        const user = req.user;
        const company = req.company;
        const UserData = body.UserData;
        const CompanyDetail = body.CompanyData;
        const UpdateUser = await UserModel.findOneAndUpdate(
           { _id: user._id },
        {
            name: UserData.name ?? user.name,
            email: UserData.email ?? user.email,
        },
         { new: true }
        );

        const UpdateCompany = await CompanyModel.findOneAndUpdate(
           { _id: company._id },
        {
          contactemail: CompanyDetail.companyEmail ?? company.contactemail,
          contactname: CompanyDetail.companyContactName ?? company.contactname,
          name: CompanyDetail.companyName ?? company.name,
          location: CompanyDetail.location ?? company.location,
        },
          { new: true }
        );
 

      }catch(err){
           return res.status(500).json({
            message: "Internel server error",
           })
      }
    
}

