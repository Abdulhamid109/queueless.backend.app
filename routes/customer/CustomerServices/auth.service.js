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
        role: userdb.role
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
    return token;
}

export const CustomerPreSignupService = async (email) => {
    if (!email) {
        throw new Error("Email not found!");
    }
    const ispresent = await customer.findOne({ email });
    if (ispresent) {
        throw new Error("User already Present,Kindly Login")
    }

    const OTPGenerated = await generateOTP();
    const { data, error } = await resendClient.emails.send({
        from: "Queueless <auth@queueless.fun>",
        to: email,
        subject: "Your Queueless verification code",
        text: `Your OTP is ${OTPGenerated}. This code expires in 5 minutes. If you didn't request this, ignore this email.`,
        html: `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Verify your email</h2>
            <p>Your one-time password is:</p>
            <h1 style="letter-spacing: 4px;">${OTPGenerated}</h1>
            <p>This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
            <hr/>
            <p style="font-size: 12px; color: #888;">Queueless · auth@queueless.fun</p>
        </div>
    `
    });

    if (error) {
        console.log("Error => " + JSON.stringify(error));
        throw new Error("From Email" + error)
    }
    console.log("From Email => " + data);

    await redisClient.setex(`OTP-${email}`, 300, OTPGenerated);

    return true;
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

export const customerForgortPasswordService = async (email) => {
    if (!email) {
        throw new Error("registered Email not found");
    }
    const ispresent = await customer.findOne({ email });
    if (!ispresent) {
        throw new Error("Email not registered!");
    }
    const OTPGenerated = await generateOTP();
    const { data, error } = await resendClient.emails.send({
        from: "Queueless <auth@queueless.fun>",
        to: email,
        subject: "Your Queueless verification code",
        text: `Your OTP is ${OTPGenerated}. This code expires in 5 minutes. If you didn't request this, ignore this email.`,
        html: `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Verify your email</h2>
            <p>Your one-time password is:</p>
            <h1 style="letter-spacing: 4px;">${OTPGenerated}</h1>
            <p>This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
            <hr/>
            <p style="font-size: 12px; color: #888;">Queueless · auth@queueless.fun</p>
        </div>
    `
    });

    if (error) {
        console.log("Error => " + JSON.stringify(error));
        throw new Error("From Email" + error)
    }
    console.log("From Email => " + data);

    //storing the OTP inside the redis with OTP-UID format
    await redisClient.setex(`OTP-${ispresent.email}`, 300, OTPGenerated);

    return true;
}


export const ValidateOTPService = async (OTP, email) => {
    if (!OTP) {
        throw new Error("OTP not found");
    }
    if (!email) {
        throw new Error("Registered email not found")
    }
    const SavedOTP = await redisClient.getex(`OTP-${email}`);
    if (!SavedOTP) {
        throw new Error("OTP expired or not found!");
    }
    if (SavedOTP !== OTP) {
        throw new Error("Invalid OTP");
    }
    return true;

}
