import { handleLogin, handleSignUp } from "../CustomerServices/auth.service.js";


export const CustomerLogin = async(req,res)=>{
    try {
        const {email,password} = await req.body;
        const token =await handleLogin(email,password);
        return res.status(200).json(
            {success:true,token}
        )

    } catch (error) {
        return res.status(400).json({

            success: false,
            error: error.message,
        });
    }
}

export const CustomerSignup = async(req,res)=>{
    try {
        const {FullName, email, password, CustomerAddress, latitude, longitude, phone} = req.body;
        const savedCustomer = await handleSignUp(FullName, email, password, CustomerAddress, latitude, longitude, phone);
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

