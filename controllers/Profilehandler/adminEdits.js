const UserModel = require('../../models/user.model.js');
const CompanyModel = require('../../models/company.model.js')
async function EditAdmin( req , res){

    try{
        const body = req.body;
        const user = req.user;
       
        const company = req.company;
        const Changes = body.Changes;
     
        const UpdateUser = await UserModel.findOneAndUpdate(
           { _id: user._id },
        {
            name: Changes.name || user.name,
            email: Changes.email || user.email,
        },
         { returnDocument: 'after' }
        );
        if(!UpdateUser){
            return res.status(404).json({
            message: "User Not Found",
          })
        }     
        const UpdateCompany = await CompanyModel.findOneAndUpdate(
           { _id: company._id },
        {
          $set:{
          contactemail: Changes.companyEmail || company.contactemail,
          contactname: Changes.companyContactName || company.contactname,
          name: Changes.companyName || company.name,
          location: Changes.location || company.location,
          }
        },
          { returnDocument: 'after' }
        );
        if(!UpdateCompany){
            return res.status(404).json({
            message: "company Not Found",
          })
        } 
      
      return res.status(200).json({
        message: " Changes are Saved",
      })
      }catch(err){
        return res.status(500).json({
        message: "Internel server error",
      })
      }
    
}

module.exports = EditAdmin