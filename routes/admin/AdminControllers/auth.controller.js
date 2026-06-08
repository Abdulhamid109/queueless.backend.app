import { AdminLogin, AdminSignup } from "../AdminServices/auth.service.js";

export const AdminLoginController =async(req,res)=>{
    try {
        const {email,password} = req.body;
        const token = await AdminLogin(email,password);
        return res.status(200).json(
            {success:true,token}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"internal server errror"+error}
        )
    }
}

export const AdminSignupController =async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        const data = await AdminSignup(name,email,password);
        return res.status(200).json(
            {success:true}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"internal server errror"+error}
        )
    }
}