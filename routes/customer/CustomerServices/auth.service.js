import customer from "../../../models/CustomerModal.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dbconnect from "../../../config/dbConfig.js";
import resendClient from "../../../utils/resendClient.js";
import { generateOTP } from "../../../helpers/OTPGeneration.js";
import redisClient from "../../../utils/redisClient.js";

dbconnect();
export const handleLogin = async (email, password) => {
    if (!email || !password) {
        throw new Error("Kindly enter the values")
    }

    const userdb = await customer.findOne({ email });
    if (!userdb) {
        throw new Error("User not found, Kindly Login")
    }

    const result = await bcrypt.compare(password, userdb.password);
    if (!result) {
        throw new Error("Invalid Credentials")
    }

    const payload = {
        uid: userdb._id,
        email: email,
        role:userdb.role
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
    return token;
}


export const handleSignUp = async (FullName, email, password, CustomerAddress, latitude, longitude, phone) => {
    if (!email || !FullName || !password || !CustomerAddress || !latitude || !longitude || !phone) {
        throw new Error("Kindly enter full values")
    }
    const ispresent = await customer.findOne({ email });
    if (ispresent) {
        throw new Error("User already Present,Kindly Login")
    }
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const newCustomer = new customer({
        name: FullName,
        email,
        password: hashpassword,
        phone,
        "CustomerCurrentLocation.type": "Point",
        "CustomerCurrentLocation.coordinates": [longitude, latitude],
        CustomerAddress
    });

    const savedUser = await newCustomer.save();

    return savedUser;

}

export const customerForgortPasswordService = async(email)=>{
    if(!email){
        throw new Error("registered Email not found");
    }
    const ispresent = await customer.findOne({email});
    if(!ispresent){
        throw new Error("Email not registered!");
    }
    const OTPGenerated = await generateOTP();
    const {data,error} = await resendClient.emails.send({
        from: "Password-Auth <auth@queueless.fun>",
        to:email,
        subject:"OTP Validation for Forgot Password",
        html:`Your OTP for ${email} is ${OTPGenerated}`
    });

    if(error){
        console.log("Error => "+JSON.stringify(error));
        throw new Error("From Email"+error)
    }
    console.log("From Email => "+data);

    //storing the OTP inside the redis with OTP-UID format
    await redisClient.setex(`OTP-${ispresent._id}`,60,OTPGenerated);

    return true;
}
