const validator = require('validator');
const UserModel = require("../models/user.model.js");

const requiredFields = ['email', 'name', 'password', 'role'];

async function validate(req, res, next) {
  try {
    const body = req.body;
    const { email, password, name, role } = body;
   
 if (!email || typeof email !== "string" || !password || typeof password !== "string" || !name || typeof name !== "string" ||
  !role || typeof role !== "string"
) {
  return res.status(400).json({ message: "Bad Input" });
}

    const isOk = requiredFields.every(field => field in body);

    if (!isOk) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }


    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must contain 8+ chars, uppercase, lowercase, number & symbol"
      });
    }

 
    const isEmailExist = await UserModel.findOne({ email });

    if (isEmailExist) {
      return res.status(409).json({
        message: "User already exists with this email"
      });
    }

    next();

  } catch (err) {
   
    return res.status(400).json({
      message: "Server error"
    });
  }
}

module.exports = validate;