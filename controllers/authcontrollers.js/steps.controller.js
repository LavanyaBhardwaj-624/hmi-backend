const jwt = require('jsonwebtoken')
const Company = require('../../models/company.model.js');
const User = require('../../models/user.model.js')
require('dotenv').config();
const validator = require('validator')
const Machine = require('../../models/machine.model.js')
const threshold = require('../../models/threshold.model.js')
const UserModel = require('../../models/user.model.js');

const requiredFields = ['contactemail', 'name', 'contactname', 'location'];

async function CreateCompany( req , res ){

    try{
    const body = req.body; 

    const isOk = requiredFields.every(field => field in body);


      if (!isOk) {
      return res.status(401).json({
        message: "All fields are required"
      });
    }

        if (!validator.isEmail(req.body.contactemail)) {
          return res.status(401).json({
            message: "Invalid email format"
          });
        }
     const user = req.user;
     const UserId = req.user._id;

     if( user.companyId ){
      return res.status(409).json({
        description: "Conflict",
        message: "User is already associated with a Company"
      })
     }
     
     const company = await Company.create({
        ...req.body,
          createdBy: UserId,
          companyId: `COMP-${Date.now()}`,
          adminId: UserId,
     })
     
     const newToken = jwt.sign({id: UserId , companyId: company._id} , process.env.Private_key, {
        expiresIn: "1d",
     })

     const newuser = await User.findByIdAndUpdate(
        UserId , 
        {companyId: company._id},
        {new: true},
     )

     res.clearCookie("token");

     res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      });

      return res.status(201).json({
        message: 'Company created successfully',
      })

    }catch(err){
   
        return res.status(500).json({
            message:"server error",
        })
    }
}


async function AddMachineType( req , res , next ){

    try{
      const machinetypes = req.body.machinetypes; // machinetypes
      
      if(!req.company._id){
        return res.status(400).json({
          message: "Unauthorized access"
        })
      }
      const company_id = req.company._id;

      const company = await Company.findByIdAndUpdate(
        company_id,
        { selectedMachineTypes : machinetypes},
        { new : true},
      )
      req.company_id = company._id;
      next();

    }catch(err){
        return res.status(500).json({
            message:"server error",
        })
    }

}


async function AddMachines(req, res) {
  try {
    const data = req.body.payload;
   
    if (!Array.isArray(data)) {
      return res.status(400).json({
        message: "Expected array of machines",
        status: "Failure"
      });
    }

   
    const machineDocs = data.map((element) => {
      const [machineType] = element.machine.MachineDetails.split(",");
    
      return {
        companyId: req.company._id,
        machineType, // cleaner
        machineName: element.machine.MachineName,
        Location: element.machine.Location,
        IpAddress: element.machine.IpAddress,
        Port: element.machine.Port,
      };
    });

  
    const insertedMachines = await Machine.insertMany(machineDocs);

   
    const configDocs = insertedMachines.map((machine, index) => {
      const config = data[index].config;

      return {
        companyId: req.company._id,
        machineId: machine._id,
        thresholds: config.thresholds || {},
        alarms: config.alarms || {}
      };
    });

    await threshold.insertMany(configDocs);

     const user = req.user;
     const updateduser = await UserModel.findOneAndUpdate({
      _id: user._id
     },{
      isComplete: true,
     },{
      
      returnDocument: 'after',
      setDefaultsOnInsert: true
     });

    return res.status(201).json({
      description: "Ok",
      message: "Machines + configs added successfully",
      status: "Success"
    });

  } catch (err) {
  
    return res.status(500).json({
      message: "Server error"
    });
  }
}

module.exports = {
   AddMachines,
   AddMachineType,
   CreateCompany
}