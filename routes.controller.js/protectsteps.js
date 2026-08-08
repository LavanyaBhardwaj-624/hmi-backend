
/** Auth User */
async function towardcompany(req , res ){
 
    const user = req.user;
    
    if( user.role === "admin" && !req.company){
        return  res.status(200).json({
            description: "Ok",
            message: "Permission Allowed"
          })
    }

   return res.status(403).json({
            description:"forbidden",
            message: "Permission not Allowed"
          })
}

async function toMachineSelect(req , res){

}

