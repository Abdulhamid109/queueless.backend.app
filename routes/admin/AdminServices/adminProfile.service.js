import admin from "../../../models/AdminModal.js"


export const getAdminProfileData =async(adminid)=>{
    if(!adminid){
        throw new Error("Unauthorized admin")
    }
    const adminProfileData = await admin.findById(adminid);
    return adminProfileData;
}