import dbconnect from "../../../config/dbConfig.js";
import customer from "../../../models/CustomerModal.js";

dbconnect();

export const UpdateFCMTokenService = async(uid,fcmToken) =>{
    if(!uid || !fcmToken){
        throw new Error("uid and fcmtokennot found!")
    }
    const updatedCustomer = await customer.findByIdAndUpdate(uid,{
        fcmToken
    });
    return updatedCustomer;
}