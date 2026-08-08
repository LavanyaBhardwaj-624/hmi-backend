const User = require('../../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Company = require('../../models/company.model.js')
const redisClient = require('../../config/redis.js')
require('dotenv').config();


/** First Run User Validate */
async function CreateAdmin(req, res) {
  try {
    console.log(req.body)
    const { email, password, name, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
  
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role
    });
  
    const token = jwt.sign(
      { id: user._id },
      process.env.Private_key,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    return res.status(201).json({
      description:"New User Created",
      message: "Admin created successfully",
      redirectto: "/Company",
    }); 

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ 
      description: "internal Failure",
      message: `${err.message}`
    });
  }
}

/**First run user.validate */

async function CreateOperator(req , res){

   try {
    const { email, password, name, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const companyId = req.body.companyId;
    const company  = await Company.findOne({companyId: companyId});
    if(!company){
      return res.status(404).json({
            description: "Not Found",
            message: "Company not Found , Please enter correct company Id",
      })
    }
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      companyId: company._id,
    });
  

    const token = jwt.sign(
      { id: user._id , company_id: company._id },
      process.env.Private_key,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      redirectto: "/operatordashboard",
    }); 

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ 
      result: "Failure",
      Error: `${err.message}`
    });
  }

}

async function Login(req, res) {
  try {

    if( !req.body.email){
      return res.status(400).json({
        description: "bad input",
        message: "Email is required to login"
      })
    }
       if( !req.body.password){
      return res.status(400).json({
        description: "bad input",
        message: "enter password to login"
      })
    }
    const user = await User.findOne({ email: req.body.email }).select("+password").exec();
    

    if (!user) {
      return res.status(404).json({
        description: "User Not Found",
        message: "Invalid Credentials",
      });
    }

    const ok = await bcrypt.compare(req.body.password, user.password);

    if (!ok) {
      return res.status(401).json({
        description:" Unauhtorization failed",
        message: "Invalid Credentials",
      });
    }
     let token;
    if(!user.companyId){
     token = jwt.sign( { id: user._id}, process.env.Private_key, { expiresIn: "1h" });
  }else{
     token = jwt.sign( { id: user._id , companyId: user.companyId}, process.env.Private_key, { expiresIn: "1d" });
  }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    if(!user.companyId)
    return res.status(200).json({
      description: "Ok",
      message: " Please Fill Company details First",
      redirectto: "/Company",
    });

    if( user.role === "operator"){
        return res.status(200).json({
           description: "Ok",
            message: "Login Successfully",
            redirectto: "/OperatorDashboard",
        })
    }

    if( user.isComplete === false ){
      return res.status(200).json({
        description:"Ok",
        message: "Please Select your machine types",
        redirectto: "/SelectMachineType",
      })
    }

    return res.status(200).json({
        description: "Ok",
        message: "Login Successfully",
        redirectto: "/AdminDashboard",
    })
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Server error " + err });
  }
}

async function Logout( req , res){
    

  try{
     
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
       if(!token){
        return res.status(401).json({
            description: "Unauthorized access",
            message: "First Login"
        })
    }
     const decodedtoken = jwt.verify( token , process.env.Private_key)
   
     if(decodedtoken.companyId){
        const companyId = decodedtoken.companyId;
        const cacheKey = `company:${companyId}:machines`;
        await redisClient.del(cacheKey);
     }

    await redisClient.set(`token:${token}` , 'Blocked');

    const Decodedtoken = jwt.decode(token);

    const Exptime = Decodedtoken.exp;
     await redisClient.expireAt(`token:${token}` , Exptime)

      res.clearCookie("token",{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
  
    res.status(200).json({
       "message": "session log out successfully",
    })
  }catch(err){
    res.status(500).json({
       "message": "Internal server error"
    })
  }

}

module.exports ={
    CreateAdmin,
    CreateOperator,
    Login,
    Logout
}