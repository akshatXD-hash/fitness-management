import { User } from "../models/user.model.js"

export const getUser = async(req,res)=>{
    try{
     const user = await User.findById(
       req.user.id
     )

     if(!user){
        return res.status(404).json({
            message:"User Not found"
        })
     }

     return res.status(200).json({
        user
     })
    }catch(err){
    console.log(err);
    return res.status(500).json({
        message:'Internal Server Error'
    })
    }
}