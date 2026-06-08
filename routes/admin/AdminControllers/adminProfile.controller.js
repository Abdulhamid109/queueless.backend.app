import { getAdminProfileData } from "../AdminServices/adminProfile.service.js";


export const getAdminProfileInfo =async(req,res)=>{
    try {
        const adminId = req.params.adminId;
        const adminData = await getAdminProfileData(adminId);
        return res.status.json(
            {success:true,data:adminData}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal Server error => "+error}
        )
    }
}