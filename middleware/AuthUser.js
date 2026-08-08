const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const UserModel = require('../models/user.model.js')
const CompanyModel = require('../models/company.model.js')
const redisClient = require('../config/redis.js')

async function Authuser( req , res , next){

  
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 

    if(!token){
        return res.status(401).json({
            description: "Unauthorized access",
            message: "First Login to view this page"
        })
    }
    try{

        const isBlocked = await redisClient.exists(`token:${token}`);
           if(isBlocked){
            return res.status(401).json({
            description: "Unauthorized access",
            message: "token is not valid"
          })
         }

         
        const decodedtoken = jwt.verify( token , process.env.Private_key)

        const userId = decodedtoken.id;
         
        const user = await UserModel.findById(userId).select("+password").exec();
     
        if(!user){
            return res.status(404).json({
            description: "Not Found",
            message: "User Not Found"
        })
        }
        req.user = user;
        
        if( decodedtoken.companyId){
        const company_Id = decodedtoken.companyId;
        const company = await CompanyModel.findById(company_Id);
        if(!company){
            return res.status(404).json({
            description: "Not Found",
            message: "Company Not Found"
        })
        }
        req.company = company;
        }
        next();
    }catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        return res.status(401).json({
            description: "Unauthorized access",
            message: "Invalid or expired token"
        });
    }
    return res.status(500).json({
        description: "Server Error",
        message: "Something went wrong",
        error: err.message
    });
}
}

module.exports = Authuser