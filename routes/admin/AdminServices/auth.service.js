import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dbconnect from "../../../config/dbConfig.js"
import admin from "../../../models/AdminModal.js";




dbconnect();
export const AdminLogin = async (email, password) => {
    if (!email || !password) {
        throw new Error("Kindly enter the values")
    }

    const admindb = await admin.findOne({ email });
    if (!admindb) {
        throw new Error("account not found, Kindly signup")
    }

    const result = await bcrypt.compare(password, admindb.password);
    if (!result) {
        throw new Error("Invalid Credentials")
    }

    const payload = {
        uid: admindb._id,
        email: email,
        role:admindb.role
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
    return token;
}

export const AdminSignup = async (name, email, password) => {
    if(!name || !email || !password){
        throw new Error("Kindly enter the values")
    }
    const admindb = await admin.findOne({ email });
    if (admindb) {
        throw new Error("Account already exists, Kindly Login")
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);

    const newAdminUser = new admin({
        name,
        email,
        password:hashPassword
    });

    const savedAdminUser = await newAdminUser.save();
    return savedAdminUser;
}