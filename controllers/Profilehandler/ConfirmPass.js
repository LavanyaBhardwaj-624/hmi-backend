
const UserModel = require('../../models/user.model.js')
const bcrypt = require('bcrypt')
const validator = require('validator');

async function ConfirmPass(req , res){
    
    try{

        const user = await UserModel.findById( req.user._id).select("+password").exec();;
   
        const oldpass = req.body.oldpassword;
        const Verify = await bcrypt.compare( oldpass , user.password);

        if(Verify){
        return res.status(200).json({
            verification: Verify,
            message: "Password is correct ",
        })
       }else{
        return res.status(400).json({
           verification: Verify,
           message: "Incorrect Password",
        })
    }

    }catch(err){
        return res.status(500).json({
            verification: false,
            message: "Internal Server Error",
        })
    }

}

async function SetPass( req , res){

    try{
        const user = req.user;
        const UserData = req.body;
        const newPass = UserData.newPassword;
        const ConfirmPass = UserData.confirmPassword;

       if (!validator.isStrongPassword(newPass)) {
        return res.status(400).json({
          message: "Password must contain 8+ characters including uppercase, lowercase, number & symbol"
        });
       }

        if(newPass && newPass === ConfirmPass){
            const hashedPassword = await bcrypt.hash(newPass, 10);

            const UpdateUser = await UserModel.findOneAndUpdate({
                _id: user._id
            },{
                password: hashedPassword,
            },{
                returnDocument: 'after',
            })
            return res.status(200).json({
                message: "Password changed successfully",
            })
        }else{
            return res.status(400).json({
              message: "New Password and Confirm Password must be same",
            })
        }
    }catch(err){
        console.log(" error : " + err.message)
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

module.exports = { 
    ConfirmPass,
    SetPass
}