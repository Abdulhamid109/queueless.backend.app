import { AdminChangePasswordService, AdminForgortPasswordService, AdminLogin, AdminPreSignupService, AdminSignup, AdminValidateOTPService } from "../AdminServices/auth.service.js";

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

export const AdminForgotPasswordController = async(req,res)=>{
    try {
        const {email} = req.body;
        const status = await AdminForgortPasswordService(email);
        return res.status(200).json(
            {success:true}
        )
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
}

export const AdminValidateOTPController =async(req,res)=>{
    try {
        const {OTP,email} = req.body;
        const status = await AdminValidateOTPService(OTP,email);
        return res.status(200).json(
            {success:true}
        )
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}


export const AdminPreSignupController = async(req,res)=>{
    try {
        const {email} = req.body;
        const status = await AdminPreSignupService(email);
        return res.status(200).json(
            {success:true}
        )
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
}

export const AdminChangePasswordController =async(req,res)=>{
    try {
        const {email,password} = req.body;
        const status = await AdminChangePasswordService(email,password);
        return res.status(200).json(
            {success:true}
        )

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}