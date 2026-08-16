import { fetchCustomerProfileData, updateProfileDataService } from "../CustomerServices/profile.service.js";

// here the geting the profile and updating also carried out

export const GetCustomerProfileDataController=async(req,res)=>{
    try {
        const id = req.params.id;
        const Data = await fetchCustomerProfileData(id);
        return res.status(200).json(
            {success:true,Data}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal server error"+error}
        )
    }
}


export const UpdateProfileDataController =async(req,res)=>{
    try {
        const id = req.params.id;
        const {updatedName, updatedPhone, updatedAddress,latitude,longitude} = req.body;
        const data = await updateProfileDataService(id,updatedName, updatedPhone, updatedAddress,latitude,longitude);
        return res.status(200).json(
            {success:true}
        )
    } catch (error) {
        return res.status(500).json(
            {error:"Internal server error"+error}
        )
    }
}