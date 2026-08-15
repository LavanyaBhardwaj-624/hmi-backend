

const AdminPermission = async ( req , res , next) =>{

    try{
      
        const user = req.user;

        if( user.role === 'admin'){
            next();
        }else{
            return res.status(403).json({
                message: "Don't have Permission to Access this."
            })
        }
    }catch(err){
       return res.status(500).json({
        message: "Internel Server Error",
       })
    }
}

const OperatorPermission = async ( req , res , next) =>{

    try{
      
        const user = req.user;

        if( user.role === 'operator'){
            next();
        }else{
            return res.status(403).json({
                message: "Doesn't Have Permission to access this page"
            })
        }
    }catch(err){
       return res.status(500).json({
        message: "Internel Server Error",
       })
    }
}

module.exports = {
    AdminPermission,
    OperatorPermission,
}