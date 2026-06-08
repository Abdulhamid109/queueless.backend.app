import customer from "../../../models/CustomerModal.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dbconnect from "../../../config/dbConfig.js";

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